#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { logger } = require("../v1/middleware/logger");

const migrationName = process.argv[2];

if (!migrationName) {
  logger.error("Usage: npm run migrate:create -- <migration-name>");
  process.exit(1);
}

const timestamp = new Date()
  .toISOString()
  .replace(/[-:T.]/g, "")
  .slice(0, 14);
const fileName = `${timestamp}-${migrationName}.js`;
const targetPath = path.join(__dirname, "..", "migrations", fileName);

const template = `module.exports = {
  name: '${fileName}',
  async up(db) {
    // Write your migration logic here.
  },

  async down(db) {
    // Write rollback logic here.
  },
};
`;

fs.writeFileSync(targetPath, template);
logger.info(`Created migration ${fileName}`);
