/**
 * Validate if the user sends appropriate date to start cycle.
 * @param {String} startdate - date (YYYY-MM-DD)
 * @returns - return true if the date is valid or false
 */
exports.validateCreateDate = (startdate) => {
    const currentDate = new Date();
    const userDate = new Date(startdate);

    const difference = ((currentDate - userDate) / (24 * 60 * 60 * 1000));
    
    if (difference <= 3 && difference >= 0) {
        return true;
    } else {
        return false;
    }
}

/**
 * Validate if the user sends appropriate date. Valid date falls between the
 * 5 days behind current cycle startdate.
 * @param {Date} prevdate - initial statedate of the cycle to update.
 * @param {String} newdate - new ovulationdate to update (YYYY-MM-DD)
 * @returns - return true if the date is valid or false
*/
exports.validateUpdateDate = (prevdate, newdate) => {
    const newDate = new Date(newdate);
    const prevDate = new Date(prevdate);

    const difference = ((newDate - prevDate) / (24 * 60 * 60 * 1000));

    /**
     * Validate the ovulation date the user input. Estimate is based on the assumption
     * that ovulation date doesn't exceed 18 days from previous startdate.
     */
    if (difference < 18) return true;
    else return false;
}
