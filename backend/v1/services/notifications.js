const { userAction, notificationStatus } = require("../enums.js");

class NotificationService {
  /**
   * Generates a notification based on the provided data, action, and message.
   *
   * @param {string} action - The action associated with the notification.
   * @param {string} message - The message of the notification.
   * @param {any} [id=null] - The id associated with the notification.
   * @param {string} [status=notificationStatus.unread] - The status of the notification.
   * @return {Object} - The generated notification object.
   */
  async generateNotification(action, message, id=null, status=notificationStatus.unread) {
    const _id = [userAction.createdUser, userAction.updatedUser, userAction.deletedCycle].includes(action) ? null : id;
    const notify = {
      action: action,
      itemId: _id,
      message: message,
      status: status
    };

    return notify;
  };

  /**
   * Deletes the first element of the notifications array if it is greater than 50 (FIFO).
   *
   * @param {Array} data - the notifications array
   */
  async manageNotification(data) {
    if (data.length > 50) {
      data.shift();
    }
  };
};


const notifications = new NotificationService();
module.exports = notifications;
