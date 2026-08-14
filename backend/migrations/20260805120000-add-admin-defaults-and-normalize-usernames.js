module.exports = {
  name: "20260805120000-add-admin-defaults-and-normalize-usernames.js",

  async up(db, client) {
    const defaultResult = await db.collection("admins").updateMany(
      {
        $or: [
          { loginAttempts: { $exists: false } },
          { changePasswordRequired: { $exists: false } },
          { role: { $exists: false } },
          { status: { $exists: false } },
        ],
      },
      {
        $set: {
          loginAttempts: 0,
          changePasswordRequired: false,
          role: "ADMIN",
          status: "ACTIVE",
        },
      },
    );

    const usernameResult = await db
      .collection("admins")
      .updateMany({ username: { $type: "string" } }, [
        {
          $set: {
            username: { $toLower: "$username" },
          },
        },
      ]);

    console.log(
      `Added default admin fields to ${defaultResult.modifiedCount} admin(s).`,
    );
    console.log(
      `Normalized ${usernameResult.modifiedCount} admin username(s) to lowercase.`,
    );
  },

  async down(db, client) {
    const result = await db.collection("admins").updateMany(
      {
        loginAttempts: 0,
        changePasswordRequired: false,
        role: "ADMIN",
        status: "ACTIVE",
      },
      {
        $unset: {
          loginAttempts: "",
          changePasswordRequired: "",
          role: "",
          status: "",
        },
      },
    );

    console.log(
      `Removed migrated default fields from ${result.modifiedCount} admin(s).`,
    );
  },
};
