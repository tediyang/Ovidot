import { createTransport } from 'nodemailer';
import { logger } from '../middleware/logger.js';
import dotenv from 'dotenv';
dotenv.config();


// Sender details
const emailAddress = process.env.EMAIL;
const emailPassword = process.env.EMAILPASSWORD;

/**
 * Create the sender details. user and pass verification is used here, but for more efficient
 * security used Auth. */
export const sender = createTransport({
  service: 'Gmail',
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
    const id = action.includes('User') ? null : data._id;
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
    };
  },

  /**
   * Sends a notification to the user upon creation.
   *
   * @param {Object} data - The user data.
   * @property {string} email - The user's email.
   * @property {string} username - The user's username.
   * @return {Promise} A promise that resolves when the notification is sent.
   * @throws {Error} - If there is an error sending the email.
   */
  sendUserCreationNotification: async (data) => {
    const receiver = {
      to: data.email,
      subject: 'Welcome to Ovidot - Your Personal Cycle Calendar',
      text: `
Dear ${data.username},

Welcome to Ovidot, your personalized cycle calendar app! 🌸 We're thrilled to have you on board.


To get started, simply log in to your account using the credentials you provided during registration.
If you ever forget your password, don't worry! You can easily reset it using the 'Forgot Password' link on the login page.

Best regards,

The Ovidot Team 🌟`
    };

    try {
      const info = await sender.sendMail(receiver);
      logger.info(`Email sent: ${info.response}`);
    } catch (error) {
      throw new Error(error);
    };
  },

  /**
   * Sends a termination notification to the user.
   *
   * @param {Object} data - The data object containing the user's email and username.
   * @return {Promise} - A Promise that resolves with the information about the sent email.
   * @throws {Error} - If there is an error sending the email.
   */
  sendUserTerminationNotification: async (data) => {
    const receiver = {
      to: data.email,
      subject: 'Account Deletion - Ovidot',
      text: `
Dear ${data.username},

We received your request to delete your Ovidot account, and we want to inform you that your account has been successfully deleted. We appreciate the time you spent using Ovidot, and we're here to support you in any way we can.

If you ever decide to return, your data will no longer be available, and you'll need to create a new account.

Wishing you all the best on your journey, and should you ever decide to return, we'll be here for you. Contact us at support@ovidot.com if you have any questions.

Thank you,

The Ovidot Team 🌸`
    };

    try {
      const info = await sender.sendMail(receiver);
      logger.info('Email sent');
    } catch (error) {
      throw new Error(error);
    };
  }
};

export default notifications;
