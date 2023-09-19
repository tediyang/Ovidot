/**
 * Calculate the estimated cycle for the individual
 * Note: this calcutor is based on the average 28 days cycle,
 * proper estimation will be made on later version from data provided
 * individula by users to get an accurate prediction.
 * @period - the number of days of menstruation 
 * @returns - an object of the ovulation day in the cycle and the total number of days
 * for the total cycle.
 */
exports.calculate = (period) => {
    ovulation = 10 + period;
    days = ovulation + 14;
    return { 'ovulation': ovulation, 'days': days };
}
