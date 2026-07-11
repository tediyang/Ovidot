module.exports = {
  name: "20260711120000-create-migrations-collection",

  async up(db) {
    const collections = await db
      .listCollections({ name: "migrations" })
      .toArray();

    if (!collections.length) {
      await db.createCollection("migrations");
    }

    await db
      .collection("migrations")
      .createIndex({ name: 1 }, { unique: true });
  },

  async down(db) {
    const collections = await db
      .listCollections({ name: "migrations" })
      .toArray();
    if (collections.length) {
      await db.collection("migrations").drop();
    }
  },
};
