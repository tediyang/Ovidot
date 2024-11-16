// Swagger JSDoc configuration
const swaggerJSDoc = require('swagger-jsdoc');
require('dotenv').config();


/**
 * Documentation for Ovidot Backend.
 * 
 * @author Eyang, Daniel Eyoh <https://github.com/Tediyang>
 */

const PATH_PREFIX = 'https://ovidotcycle.onrender.com/api/v1';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ovidot Backend API',
      version: '1.0.0',
      description: 'Ovidot Backend API Documentation',
    },
    components: {
      securitySchemes: {
        adminToken: { // This name must match the name used in the security section of your path
          type: 'http', // The type of the security scheme
          scheme: 'bearer', // The name of the HTTP Authorization scheme to be used
          bearerFormat: 'JWT', // Optional, only needed if using bearer tokens
        },
        userToken: { // This name must match the name used in the security section of your path
          type: 'http', // The type of the security scheme
          scheme: 'bearer', // The name of the HTTP Authorization scheme to be used
          bearerFormat: 'JWT', // Optional, only needed if using bearer tokens
        },
      },
    },
    servers: [
      {
        url: `http://${process.env.HOST}:${process.env.APP_PORT}${PATH_PREFIX}/admin`,
        description: 'Admin Routes Server',
      },
      {
        url: `http://${process.env.HOST}:${process.env.APP_PORT}${PATH_PREFIX}/auth`,
        description: 'Authenticated Routes server',
      },
      {
        url: `http://${process.env.HOST}:${process.env.APP_PORT}${PATH_PREFIX}`,
        description: 'General Routes server',
      },
    ],
  },
  apis: ['./v1/routes/*.js', "./v1/routes/auth/*.js", "./v1/admin/route/*.js"]
};


const swaggerSpec = swaggerJSDoc(swaggerOptions);
module.exports = { swaggerSpec, PATH_PREFIX };
