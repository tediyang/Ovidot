const notifications = require('../../services/notifications.js');
const { Cycle, User, Connection } = require('../../models/engine/database.js');
const CycleCalculator = require('./cycle.calculator.js');
const cycleParser = require('./cycle.parsers.js');
const { userAction } = require('../../enums.js');

const DATE_FORMAT = 'YYYY-MM-DD';

class CycleHelper extends CycleCalculator {
  
  constructor() {
    super();
  
    this.MIN_UPDATE_DIFFERENCE = 7;
  }

  /**
   * Check if there is an existing cycle for the given user and start date.
   *
   * @param {Object} user - The user object containing information about the user.
   * @param {Date} startdate - The start date of the cycle to be checked.
   * @returns {boolean} - True if an existing cycle needs an update or deletion, false otherwise.
   */
  checkExistingCycle = (user, startdate) => {
    const hasCycles = user._cycles.length > 0;
  
    if (hasCycles) {
      const lastCycle = user._cycles[user._cycles.length - 1];
      const nextDate = new Date(lastCycle.next_date);
      const startDate = new Date(startdate);
      const differenceInDays = (nextDate - startDate) / this.MILLISECONDS_IN_A_DAY;

      return differenceInDays > this.MIN_UPDATE_DIFFERENCE;
    }

    return false;
  };

  /**
   * Create a new cycle and notify the user.
   *
   * @param {object} newCycle - The new cycle object to be saved.
   * @param {object} user - The user object.
   * @param {string} startdate - The start date of the cycle.
   * @throws {Error} If an error occurred during the process.
   */
  createCycleAndNotifyUser = async (newCycle, user, startdate) => {
    try {
      await Connection.transaction(async () => {
        // Save the new cycle
        await newCycle.save();

				// Generate notification
        const message = `Cycle created for ${this.formatDate(startdate)}`;
        const notify = await notifications.generateNotification(userAction.createdCycle, message, newCycle._id);

				// // Add the notification
        user._cycles.push(newCycle._id);
        user.notificationsList.push(notify);

        // Manage notifications
        notifications.manageNotification(user.notificationsList);

        // Update the user's cycles and notifications list
        await User.findByIdAndUpdate(user.id, {
          _cycles: user._cycles,
          notificationsList: user.notificationsList,
        });
			});

    } catch (error) {
      throw error;
    }
  };

  /**
   * Updates a cycle and generates a notification for the user.
   *
   * @param {object} cycle - The cycle object to be updated.
   * @param {number} period - The length of the menstrual period.
   * @param {number} ovulation - The day of ovulation.
   * @param {string} cycleId - The ID of the cycle to update.
   * @param {object} user - The user object.
   * @return {object} - The updated cycle object.
   * @throws {Error} If an error occurred during the process.
   */
  performUpdateAndNotify = async (cycle, period, ovulation, cycleId, user) => {
    try {
      // const updated_at = new Date();
      const month = this.getMonth(cycle.start_date);
      const updatedData = await this.calculate(period, cycle.start_date, ovulation);
      const data = cycleParser.Parse(month, period, cycle.start_date, updatedData);
      let updated;

      await Connection.transaction(async () => {
        // Update the cycle
        updated = await Cycle.findByIdAndUpdate(cycleId, {
          ...data
        }, { new: true });

        // Generate notification and add it to the user's list
        const message = `Cycle for ${this.formatDate(cycle.start_date)} was updated`;
        const notify = await notifications.generateNotification(userAction.updatedCycle, message, updated._id);

        user.notificationsList.push(notify);

        // Manage notifications
        notifications.manageNotification(user.notificationsList);

        // Save the user with the updated notifications list
        await user.save();
      });

      return updated;
      
    } catch (error) {
      throw error;
    }
  };

  /**
   * Deletes a cycle and generates a notification for the user.
   *
   * @param {string} cycleId - The ID of the cycle to be deleted.
   * @param {object} user - The user object.
   * @return {Promise} - A promise that resolves when the cycle is deleted and the notification is generated.
   * @throws {Error} If an error occurred during the process.
   */
  performDeleteAndNotify = async (cycleId, user) => {
    try {
      let cycle;

      await Connection.transaction(async () => {
        cycle = await Cycle.findByIdAndRemove(cycleId);

        const message = `Cycle deleted for ${this.formatDate(cycle.start_date)}`;
        const notify = await notifications.generateNotification(userAction.deletedCycle, message, cycle._id);

        // Generate notification and add it to the user's list
        user.notificationsList.push(notify);

        // Manage notifications
        notifications.manageNotification(user.notificationsList);

        // Save the user with the updated notifications list
        await user.save();

      })
      return cycle;
  
    } catch (error) {
      throw error;
    }
  };
}

const cycleHelper = new CycleHelper();
module.exports = cycleHelper;
