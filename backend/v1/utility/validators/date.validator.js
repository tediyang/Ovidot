const { timeShare } = require("../../enums.js");
const requestValidator = require('./requests.validator.js');

// VALIDATE DATES
class Validator {

  constructor() {
    // Create an immutable object of the day
    this.DATE_OPTIONS = Object.freeze({
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0
    });

    this.MILLISECONDS_IN_A_DAY = 24 * 60 * 60 * 1000;
  }

  /**
   * Check if the date is valid.
   * @param {String} date - The user inputed data.
   * @returns Boolean value
   */
  isValidDate = date => !isNaN(new Date(date));

  /**
   * Validate if the user sends an appropriate date to start the cycle.
   * @param {String} startDate - date (YYYY-MM-DD)
   * @returns {boolean} - true if the date is valid, false otherwise
   */
  validateCreateDate(startDate) {
    if (!this.isValidDate(startDate)) {
      return false;
    }

    const currentDate = new Date();
    const userDate = new Date(startDate);

    // Set both dates to midnight for accurate date comparison
    userDate.setHours(this.DATE_OPTIONS.hours, this.DATE_OPTIONS.minutes, this.DATE_OPTIONS.seconds, this.DATE_OPTIONS.milliseconds);
    currentDate.setHours(this.DATE_OPTIONS.hours, this.DATE_OPTIONS.minutes, this.DATE_OPTIONS.seconds, this.DATE_OPTIONS.milliseconds);

    const differenceInDays = (currentDate - userDate) / this.MILLISECONDS_IN_A_DAY;

    return differenceInDays <= 21 && differenceInDays >= 0;
  }

  /**
   * Validate if the user sends an appropriate ovulation date. Valid date falls between
   * the end of the period and less than 18 days from the period start date.
   * @param {String} prevDate - initial start date of the cycle to update.
   * @param {String} newDate - new ovulation date to update (YYYY-MM-DD)
   * @param {Number} period - the duration of menstraution
   * @returns {boolean} - true if the date is valid, false otherwise
   */
  validateUpdateDate(prevDate, newDate, period) {
    if (!this.isValidDate(prevDate) || !this.isValidDate(newDate) || !period) {
      return false;
    }

    const newDateObj = new Date(newDate);
    const prevDateObj = new Date(prevDate);

    // Set both dates to midnight for accurate date comparison
    newDateObj.setHours(this.DATE_OPTIONS.hours, this.DATE_OPTIONS.minutes, this.DATE_OPTIONS.seconds, this.DATE_OPTIONS.milliseconds);
    prevDateObj.setHours(this.DATE_OPTIONS.hours, this.DATE_OPTIONS.minutes, this.DATE_OPTIONS.seconds, this.DATE_OPTIONS.milliseconds);

    const differenceInDays = (newDateObj - prevDateObj) / this.MILLISECONDS_IN_A_DAY;

    // Validate the ovulation date. Assume ovulation occur after menstraution and
    // doesn't exceed 18 days from the previous start date.
    return differenceInDays > period && differenceInDays <= 18;
  }

  /**
   * Parses the given query and createdAt object into a MongoDB query format.
   * If the createdAt object has a range, it will be converted into a MongoDB
   * query that looks like { $lte: Date.now(), $gte: Date.now() - timeShare[time_share] * times }.
   * If the createdAt object has an exact_range, it will be converted into a MongoDB
   * query that looks like { $lte: exact_range[1], $gte: exact_range[0] }.
   * If the exact_range only has one date, it will be converted into a MongoDB
   * query that looks like { $lte: exact_range[0] + 24hr, $gte: exact_range[0] }.
   * @param {Object} query - The query object to be updated.
   * @param {Object} createdAt - The createdAt object to be parsed.
   */
  dateParse(query, createdAt) {
    const { range, exact_range } = createdAt;
    if(range) {
      const { times, time_share } = range;
      // between now and the stipulated time
      query.createdAt = { 
        $lte: new Date(), 
        $gte: requestValidator.last_times(timeShare[time_share], times)
      };
    }

    if(exact_range) {
      const date = exact_range.split('_') // "2024-10-09_2024-10-10"
      if(date.length === 2) {
        // making sure it covers the entire day
        const date_data = new Date(date[1])
        date_data.setHours(23, 59, 59, 999);
        query.createdAt = { 
          $lte: date_data,
          $gte: new Date(date[0])
        };
      }

      if(date.length === 1) {
        const ends = new Date(date[0]);
        ends.setHours(23, 59, 59, 999);
        query.createdAt = { 
          $lte: ends, 
          $gte: new Date(date[0])
        };
      }
    }
  }
}


const dateValidator = new Validator();
module.exports = dateValidator;
