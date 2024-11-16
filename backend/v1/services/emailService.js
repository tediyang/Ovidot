const { createTransport } = require('nodemailer');
const { logger } = require('../middleware/logger.js');
const templates = require('./views/handle.template.js');
const { Email } = require('../models/engine/database.js');
const { emailStatus, emailType } = require('../enums.js');
require('dotenv').config();


class EmailService {
  /**
   * Initializes a new instance of the class.
   *
   * @constructor
   */
  constructor() {
    this.sender = createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAILPASSWORD
      },
    });
  };

  /**
   * Sends a notification to the user upon creation.
   *
   * @param {Object} email - The email object containing the username, email address and status of email.
   * @property {string} username - The user's username.
   * @return {Promise} A promise that resolves when the notification is sent.
   */
  async sendUserCreationEmail(email) {
    const welcomeTemplate = await templates.renderWelcomeTemplate(email.username);

    const receiver = {
      to: email.email,
      subject: 'Welcome to Ovidot - Your Personal Cycle Calendar',
      html: welcomeTemplate
    };

    try {
      const info = await this.sender.sendMail(receiver);
      email.status = emailStatus.sent;
      await email.save();
      logger.info(`Email sent for user creation: ${info.response}`);
    } catch (error) {
      email.status = emailStatus.failed;
      await email.save();
      logger.error(`Error sending email for user creation: ${error.message}`);
    }
  };

  /**
   * Sends a deactivation email to the user.
   *
   * @param {Object} email - The email object containing the username, email address and status of email.
   * @property {string} username - The user's username.
   * @return {Promise} A promise that resolves when the notification is sent.
   */
  async sendUserDeactivationEmail (email) {    
    try {
      const deactivatedTemplate = await templates.renderDeactivationTemplate(email.username);
  
      const receiver = {
        to: email.email,
        subject: `Account Deactivated - Ovidot`,
        html: deactivatedTemplate
      };

      const info = await this.sender.sendMail(receiver);
      email.status = emailStatus.sent;
      await email.save();
      logger.info(`Disable Account Email sent to user : ${info.response}`);
    } catch (error) {
      email.status = emailStatus.failed;
      await email.save();
      logger.error(`Error sending disabled account email to user: ${error.message}`);
    }
  };

  /**
   * Sends a termination notification to the user.
   *
   * @param {Object} email - The email object containing the username, email address and status of email.
   * @return {Promise} - A Promise that resolves with the information about the sent email.
   */
  async sendUserTerminationEmail(email) {    
    try {
      const goodbyeTemplate = await templates.renderGoodbyeTemplate(email.username);
  
      const receiver = {
        to: email.email,
        subject: 'Account Deletion - Ovidot',
        html: goodbyeTemplate
      };

      const info = await this.sender.sendMail(receiver);
      email.status = emailStatus.sent;
      await email.save();
      logger.info(`Email sent for user termination: ${info.response}`);
    } catch (error) {
      email.status = emailStatus.failed;
      await email.save();
      logger.error(`Error sending email for user termination: ${error.message}`);
    }
  }

  /**
   * Asynchronously sends a password reset email to the specified user.
   *
   * @param {Object} email - The email object containing the username, email address, content and status of email.
   * @return {Promise<void>} A Promise that resolves when the email is sent successfully or rejects with an error if the email fails to send.
   */
  async sendUserForgetPassEmail (email) {    
    try {
      const forgetPass = await templates.renderForgetTemplate(email.username, email.content);
  
      const receiver = {
        to: email.email,
        subject: 'Password Reset',
        html: forgetPass
      };

      const info = await this.sender.sendMail(receiver);
      logger.info('Password reset link sent.');
      email.status = emailStatus.sent;
      await email.save();
    } catch (error) {
      email.status = emailStatus.failed;
      await email.save();
      logger.error(`Failed to send reset link email: ${error.message}`);
    }
  };

  /**
   * Asynchronously handles the email cron job.
   *
   * This function retrieves a limited number of pending emails from the database
   * and sends the appropriate email based on the email type for each email.
   *
   * @return {Promise<void>} A Promise that resolves when all emails have been processed.
   */
  async handleEmailCron() {
    try {
      const emails = await Email
        .find({
          status: emailStatus.pending})
        .limit(process.env.LIMIT)
        .exec();

      if (emails.length === 0) {
        return
      }

      for (const email of emails ) {
        if (email.email_type === emailType.forget) {
          await this.sendUserForgetPassEmail(email);
        } else if (email.email_type === emailType.delete) {
          await this.sendUserTerminationEmail(email);
        } else if (email.email_type === emailType.welcome) {
          await this.sendUserCreationEmail(email);
        } else {
          await this.sendUserDeactivationEmail(email);
        }
      }
    } catch (error) {
      logger.error(error);
    }
  };
}


const email_service = new EmailService();
module.exports = email_service;
