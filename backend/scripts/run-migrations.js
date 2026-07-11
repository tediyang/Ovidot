#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();

const migrationsDir = path.join(__dirname, "..", "migrations");
const migrationCollectionName = "migrations";
const action = process.argv[2] || "up";

function getMongoUri() {
  if (process.env.ENVIR === "test" || process.env.ENVIR === "dev") {
    if (
      process.env.DB_TEST &&
      process.env.DB_TEST_HOST &&
      process.env.DB_TEST_PORT
    ) {
      return `mongodb://${process.env.DB_TEST_HOST}:${process.env.DB_TEST_PORT}/${process.env.DB_TEST}`;
    }
  }

  return process.env.MONGO_URL;
}

function getMigrationFiles() {
  if (!fs.existsSync(migrationsDir)) {
    return [];
  }

  return fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".js"))
    .sort()
    .map((file) => path.join(migrationsDir, file));
}

async function ensureMigrationsCollection(connection) {
  const collections = await connection.db
    .listCollections({ name: migrationCollectionName })
    .toArray();
  if (!collections.length) {
    await connection.db.createCollection(migrationCollectionName);
  }
}

async function loadExecutedMigrations(connection) {
  await ensureMigrationsCollection(connection);
  const records = await connection.db
    .collection(migrationCollectionName)
    .find({})
    .project({ name: 1, _id: 0 })
    .toArray();
  return new Set(records.map((record) => record.name));
}

async function markExecuted(connection, name) {
  await connection.db
    .collection(migrationCollectionName)
    .insertOne({ name, executedAt: new Date() });
}

async function removeExecutionRecord(connection, name) {
  await connection.db.collection(migrationCollectionName).deleteOne({ name });
}

async function runUp(connection, migrations, executedMigrations) {
  for (const migration of migrations) {
    if (executedMigrations.has(migration.name)) {
      console.log(`Skipping ${migration.name} because it has already been applied.`);
      continue;
    }

    console.log(`Applying ${migration.name}`);
    await migration.up(connection.db);
    await markExecuted(connection, migration.name);
  }
}

async function runDown(connection, migrations, executedMigrations) {
  for (const migration of [...migrations].reverse()) {
    if (!executedMigrations.has(migration.name)) {
      console.log(
        `Skipping rollback for ${migration.name} because it has not been applied.`,
      );
      continue;
    }

    if (typeof migration.down === "function") {
      console.log(`Rolling back ${migration.name}`);
      await migration.down(connection.db);
      await removeExecutionRecord(connection, migration.name);
    } else {
      console.log(`No rollback defined for ${migration.name}`);
    }
  }
}

async function run() {
  const mongoUri = getMongoUri();

  if (!mongoUri) {
    console.error(
      "Missing MongoDB connection string. Set MONGO_URL or DB_TEST/DB_TEST_HOST/DB_TEST_PORT.",
    );
    process.exit(1);
  }

  await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
  console.log("Connected to MongoDB for migrations.");

  const migrationFiles = getMigrationFiles();
  if (!migrationFiles.length) {
    console.log("No migrations found.");
    await mongoose.disconnect();
    return;
  }

  const executedMigrations = await loadExecutedMigrations(mongoose.connection);
  const migrations = migrationFiles
    .map((filePath) => {
      const migration = require(filePath);
      const name = migration.name || path.basename(filePath, ".js");
      return { ...migration, filePath, name };
    })
    .filter(
      (migration) =>
        typeof migration.up === "function" ||
        typeof migration.down === "function",
    );

  if (action === "down") {
    await runDown(mongoose.connection, migrations, executedMigrations);
  } else {
    await runUp(mongoose.connection, migrations, executedMigrations);
  }

  await mongoose.disconnect();
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
