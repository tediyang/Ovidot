module.exports = {
  name: '20260718204358-update-phone-validation.js',

  async up(db, client) {
    const result = await db.collection('users').updateOne(
      { phone: { $exists: true } },
      [
        {
          $set: {
            phone: {
              $cond: {
                if: { $regexMatch: { input: "$phone", regex: /^\d+$/ } },
                then: "$phone",
                else: null
              }
            }
          }
        }
      ]
    );
    console.log(`Updated ${result.modifiedCount} user(s) with valid phone numbers.`);
  },

  async down(db, client) {
    const result = await db.collection('users').updateOne(
      { phone: null },
      [
        {
          $set: {
            phone: {
              $cond: {
                if: { $regexMatch: { input: "$phone", regex: /^\+\d+$/ } },
                then: "$phone",
                else: null
              }
            }
          }
        }
      ]
    );
    console.log(`Reverted ${result.modifiedCount} user(s) to previous phone number format.`);
  }
};
