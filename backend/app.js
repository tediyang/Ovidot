// Import dependencies
const express = require('express');
const gracefulShutdown = require('express-graceful-shutdown');
const tokenVerification = require('./v1/middleware/tokenVerification.js');
const { logger, appLogger } = require('./v1/middleware/logger.js');
const { serve, setup } = require('swagger-ui-express');
const { startServer } = require('./v1/libs/boot.js');
const { swaggerSpec, PATH_PREFIX } = require('./v1/swagger-docs.js');
const { Admin } = require('./v1/models/engine/database.js');
const { Role, userStatus } = require('./v1/enums.js');
const util = require('./v1/utility/encryption/cryptography.js');
const allowedOrigin = require('./setupCors.js');
require('dotenv').config();

// Import routes
const generalRoutes = require('./v1/routes/general.routes.js');
const authRoutes = require('./v1/routes/auth.routes.js');
const adminRoutes = require('./v1/admin/route/admin.routes.js');


// Start app
const app = express();


// App creates the Ultimate User if it does not exist
const ultimate = (async () => {
  try {
    const admin = await Admin.exists({ email: process.env.APP_EMAIL });

    if(admin) {
      logger.info(`${process.env.APP_NAME}: We are open for business`);
      return;
    }

    if (!admin) {
      await Admin.create({
        email: process.env.APP_EMAIL,
        username: 'ultimate',
        password: await util.encrypt(process.env.APP_PWD),
        role: Role.super_admin,
        status: userStatus.active
      })
    };

    logger.info(`${process.env.APP_NAME}: We are open for business`);
  } catch (error) {
    logger.error('Error creating or checking for ultimate user', error);
    throw error
  }
})();


// Use loggers
app.use(appLogger);

// Setup allowed origins (cors)
allowedOrigin(app);

// Use Swagger UI
app.use(PATH_PREFIX + '/documentation', serve, setup(swaggerSpec));

// Setup Routes
app.use(PATH_PREFIX + '/auth', tokenVerification.userTokenVerification, authRoutes);
app.use(PATH_PREFIX + '/admin', adminRoutes);
app.use(PATH_PREFIX, generalRoutes);

// handles ultimate admin.
ultimate
  .then((resolved) => {
    logger.info(`${process.env.APP_NAME}: ultimate admin is set`);
  })
  .catch((err) => {
    logger.error('Something is wrong....', err);
  });

// start server
startServer(app);

// Graceful shutdown configuration
const shutdown = gracefulShutdown(app, {
  signals: 'SIGINT SIGTERM',
  timeout: 30000,
});

// Handle shutdown signals
['SIGINT', 'SIGTERM'].forEach((signal) => {
  process.on(signal, () => {
    logger.info(`Received ${signal}. Starting graceful shutdown...`);
    shutdown()
      .then(() => {
        logger.info('Server gracefully shut down.');
        process.exit(0);
      })
      .catch((err) => {
        logger.error('Error during graceful shutdown:', err);
        process.exit(1);
      });
  });
});


module.exports = app;
