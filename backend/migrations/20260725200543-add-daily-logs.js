module.exports = {
  name: '20260725200543-add-daily-logs.js',
  async up(db, client) {
    const result = await db.collection('cycles').updateMany(
      { dailyLogs: { $exists: false } },
      {
        $set: {
          dailyLogs: []
        }
      }
    );
    
    console.log(`Added dailyLogs field to ${result.modifiedCount} cycle(s).`);
  },

  async down(db, client) {
    const result = await db.collection('cycles').updateMany(
      { dailyLogs: { $exists: true } },
      {
        $unset: {
          dailyLogs: ""
        }
      }
    );
    
    console.log(`Removed dailyLogs field from ${result.modifiedCount} cycle(s).`);
  }
};
