const { OAuth2Client } = require('google-auth-library');
const crypto = require('crypto');
const { logger } = require('../middleware/logger.js');

class GoogleAuthService {
  constructor() {
    this.client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
  }

  async verifyToken(googleToken) {
    try {
      // Verify the Google ID token
      const ticket = await this.client.verifyIdToken({
        idToken: googleToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();

      // Return the user data from Google
      return {
        success: true,
        data: {
          email: payload.email,
          fname: payload.given_name || payload.name.split(" ")[0],
          lname: payload.family_name || payload.name.split(" ")[1],
        }
      };
    } catch (error) {
      logger.error('Google token verification failed:', error);
      return {
        success: false,
        error: 'Invalid Google token'
      };
    }
  }

  generateUUID() {
    return crypto.randomUUID();
  }
}

const googleAuthService = new GoogleAuthService();
module.exports = googleAuthService;