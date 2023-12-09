// This module contains all the helper functions for cycle controller
import notifications from "../services/notifications.js";
import Cycle from "../models/cycle.model.js";
import User from "../models/user.model.js";
import { month as _month, calculate } from '../utility/cycle.calculator.js';
import { cycleParser } from "./cycle.parsers.js";

/**
 * Check if there is an existing cycle for the given user and start date.
 *
 * @param {Object} res - The response object for handling HTTP responses.
 * @param {Object} user - The user object containing information about the user.
 * @param {Date} startdate - The start date of the cycle to be checked.
 */
export const checkExistingCycle = (user, startdate) => {
  if (user._cycles.length > 0) {
    /**
     * 1. Get the most recent data for that month.
     * 2. Get the predicted nextdate for the previous cycle.
     * 3. Get the difference from the new month startdate
     * 4. If the difference is greater than 7 (7 days) send a
     * respond requesting for update or delete cycle. This estimate is made based on
     * an assumption that a female cycle can't come earlier than 7 days.
     */
    const lastCycle = user._cycles[user._cycles.length - 1];
    const nextD = new Date(lastCycle.next_date);
    const prevD = new Date(startdate);
    const diff = (nextD - prevD) / (24 * 60 * 60 * 1000);
    if (diff > 7) {
      return true
    }
  }
};

/**
 * Create a new cycle and notify the user.
 * @param {object} newCycle - The new cycle object to be saved.
 * @param {object} user - The user object.
 * @param {string} startdate - The start date of the cycle.
 * @throws {Error} If an error occurred during the process.
 */
export const createCycleAndNotifyUser = async (newCycle, user, startdate) => {
  try {
    // Save the new cycle
    await newCycle.save();

    const message = `Cycle created for ${startdate}}`;

    const notify = notifications.generateNotification(newCycle, 'createdCycle', message);

    // Add new notification
    user.notificationsList.push(notify);

    // manage notifications
    notifications.manageNotification(user.notificationsList);

    user._cycles.push(newCycle._id);
    await User.findByIdAndUpdate(user.id, {
      _cycles: user._cycles,
      notificationsList: user.notificationsList
    });

  } catch (error) {
    // If an error occurred, delete the new cycle
    if (newCycle) {
      await Cycle.findByIdAndDelete(newCycle._id);
    }
    throw error;
  }
}

/**
 * Updates a cycle and generates a notification for the user.
 *
 * @param {number} cycle - the cycle number
 * @param {number} period - the length of the menstrual period
 * @param {number} ovulation - the day of ovulation
 * @param {string} cycleId - the ID of the cycle to update
 * @param {object} user - the user object
 * @return {object} the updated cycle object
 */
export const performUpdateAndNotify = async (cycle, period, ovulation, cycleId, user) => {
  try {
    const updated_at = new Date();
    const month = _month(cycle.start_date);
    const updatedData = await calculate(period, cycle.start_date, ovulation);
    const data = cycleParser(month, period, cycle.start_date.toISOString(), updatedData);
  
    const updatedCycle = await Cycle.findByIdAndUpdate(cycleId, {
      ...data,
      updated_at: updated_at
    }, { new: true });
  
    // Generate notification
    const message = `Cycle for ${cycle.start_date.toISOString().split('T')[0]} was updated`;
  
    const notify = notifications.generateNotification(updatedCycle, 'updatedCycle', message);
  
    // Add new notification
    user.notificationsList.push(notify);
  
    // manage noifications
    notifications.manageNotification(user.notificationsList);
  
    await user.save();
  
    return updatedCycle;
  } catch(error) {
    throw error;
  }
}

/**
 * Deletes a cycle and generates a notification for the user.
 *
 * @param {string} cycleId - The ID of the cycle to be deleted.
 * @param {object} user - The user object to whom the notification will be sent.
 * @return {Promise} A promise that resolves when the cycle is deleted and the notification is generated.
 */
export const performDeleteAndNotify = async (cycleId, user) => {
  try {
    const cycle = await Cycle.findByIdAndRemove(cycleId);
    cycle.updated_at = new Date();

    // Generate notification
    const message = `Cycle deleted for ${cycle.start_date.toISOString().split('T')[0]}`;
  
    const notify = notifications.generateNotification(cycle, 'deletedCycle', message);
  
    // Add new notification
    user.notificationsList.push(notify);
  
    // manage noifications
    notifications.manageNotification(user.notificationsList);
    await user.save();

    return cycle;

  } catch(error) {
    throw error;
  }
};
