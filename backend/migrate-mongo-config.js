const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const config = {
  mongodb: {
    url: process.env.ENVIR === 'test' || process.env.ENVIR === 'dev'
      ? `mongodb://${process.env.DB_TEST_HOST}:${process.env.DB_TEST_PORT}/${process.env.DB_TEST}`
      : process.env.MONGO_URL,
    
    databaseName: process.env.DB_TEST || undefined,
    
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      minPoolSize: 2,
    }
  },

  migrationsDir: path.join(__dirname, 'migrations'),
  changelogCollectionName: 'migrations',
  migrationFileExtension: '.js',
  useFileHash: false,
  moduleSystem: 'commonjs',
};

module.exports = config;