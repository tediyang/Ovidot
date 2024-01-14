
import { createTransport } from 'nodemailer';
import { logger } from '../middleware/logger.js';
import { renderWelcomeTemplate, renderGoodbyeTemplate } from './views/handle.template.js';
import dotenv from 'dotenv';
dotenv.config();

// Default constants for sender details
const emailAddress = process.env.EMAIL;
const emailPassword = process.env.EMAILPASSWORD;
const EMAIL_SERVICE = 'Gmail';
const CACHE_EXPIRATION_TIME = 20 * 86400; // 20 days in seconds

// Create the sender details
export const sender = createTransport({
  service: EMAIL_SERVICE,
  auth: {
    user: emailAddress,
    pass: emailPassword
  },
});

const notifications = {
  /**
   * Generates a notification based on the provided data, action, and message.
   *
   * @param {Object} data - The data used to generate the notification.
   * @param {string} action - The action associated with the notification.
   * @param {string} message - The message of the notification.
   * @return {Object} - The generated notification object.
   */
  generateNotification: (data, action, message) => {
    const id = action.includes('User') || action === ('deletedCycle') ? null : data._id;
    const notify = {
      date: data.updated_at,
      action: action,
      id,
      message: message
    };

    return notify;
  },

  /**
   * Deletes the first element of the notifications array if it is greater than 15 (FIFO).
   *
   * @param {Array} data - the notifications array
   */
  manageNotification: (data) => {
    if (data.length > 15) {
      data.shift();
    }
  },

  /**
   * Sends a notification to the user upon creation.
   *
   * @param {Object} data - The user data.
   * @property {string} email - The user's email.
   * @property {string} username - The user's username.
   * @return {Promise} A promise that resolves when the notification is sent.
   */
  sendUserCreationNotification: async (data) => {
    const welcomeTemplate = await renderWelcomeTemplate(data);

    const receiver = {
      to: data.email,
      subject: 'Welcome to Ovidot - Your Personal Cycle Calendar',
      html: welcomeTemplate
    };

    try {
      const info = await sender.sendMail(receiver);
      logger.info(`Email sent for user creation: ${info.response}`);
    } catch (error) {
      logger.error(`Error sending email for user creation: ${error.message}`);
      throw error;
    }
  },

  /**
   * Sends a termination notification to the user.
   *
   * @param {Object} data - The data object containing the user's email and username.
   * @return {Promise} - A Promise that resolves with the information about the sent email.
   */
  sendUserTerminationNotification: async (data) => {
    const goodbyeTemplate = await renderGoodbyeTemplate(data);

    const receiver = {
      to: data.email,
      subject: 'Account Deletion - Ovidot',
      html: goodbyeTemplate
    };

    try {
      const info = await sender.sendMail(receiver);
      logger.info(`Email sent for user termination: ${info.response}`);
    } catch (error) {
      logger.error(`Error sending email for user termination: ${error.message}`);
      throw error;
    }
  }
};

export default notifications;
