const DATE_OPTIONS = Object.freeze({
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
});

const MILLISECONDS_IN_A_DAY = 24 * 60 * 60 * 1000;

/**
 * Calculate the estimated cycle for the individual.
 * Note: this calculator is based on the average 28 days cycle.
 * Proper estimation will be made in later versions from data provided
 * by users to get an accurate prediction.
 *
 * @param {Number} period - the number of days of menstruation
 * @param {Date} startDate - the beginning of the user cycle YYYY-MM-DD
 * @param {Date} ovulation - the day the user experienced ovulation in the cycle. YYYY-MM-DD
 * @returns {Promise} - a promise that resolves to an object with variables of days (cycle duration), periodRange,
 * ovulationRange, unsafeDays, and nextDate.
 */
exports.calculate = (period, startDate, ovulation = null) => {
    return new Promise((resolve, reject) => {
        try {
            const dayOne = new Date(startDate);
            dayOne.setHours(DATE_OPTIONS.hours, DATE_OPTIONS.minutes, DATE_OPTIONS.seconds, DATE_OPTIONS.milliseconds);

            const periodRange = [];
            const unsafeDays = [];

            if (ovulation === null) {
                ovulation = new Date(dayOne);
                ovulation.setDate(dayOne.getDate() + 9 + period);
            } else {
                ovulation = new Date(ovulation);
                let dayLast = new Date(dayOne);
                dayLast.setDate(dayLast.getDate() + period);

                if (ovulation < dayOne || ovulation < dayLast) {
                    const err = new Error("Invalid ovulation date");
                    err.statusCode = 400;
                    reject(err);
                }
            }

            const totalCycleDays = getTotalCycleDays(dayOne, ovulation);

            for (let i = 0; i < period; i++) {
                const currDate = new Date(dayOne);
                currDate.setDate(dayOne.getDate() + i);
                periodRange.push(formatDate(currDate));
            }

            const ovulationRange = getOvulationRange(ovulation);
            const unsafeRange = getUnsafeRange(ovulation, new Date(periodRange[periodRange.length - 1]));

            let nextDate = new Date(dayOne);
            nextDate.setDate(dayOne.getDate() + totalCycleDays);
            nextDate = formatDate(nextDate);

            resolve({
                days: totalCycleDays,
                periodRange,
                ovulation: ovulationRange[1],
                ovulationRange,
                unsafeDays: unsafeRange,
                nextDate,
            });
        } catch (err) {
            reject(err);
        }
    });
};

/**
 * Get the last day of menstruation based on the start date and period.
 *
 * @param {Date} startDate - the beginning of the user cycle
 * @param {Number} period - the number of days of menstruation
 * @returns {Date} - the last day of menstruation
 */
const getLastDayOfMenstruation = (startDate, period) => {
    const lastDay = new Date(startDate);
    lastDay.setDate(lastDay.getDate() + period - 1);
    return lastDay;
};

/**
 * Get the total number of days in the menstrual cycle.
 *
 * @param {Date} startDate - the beginning of the user cycle
 * @param {Date} ovulation - the day the user experienced ovulation
 * @returns {Number} - the total number of days in the cycle
 */
const getTotalCycleDays = (startDate, ovulation) => {
    const days = new Date(ovulation);
    days.setDate(ovulation.getDate() + 15);
    return (days - startDate) / MILLISECONDS_IN_A_DAY;
};

/**
 * Get the range of ovulation dates.
 *
 * @param {Date} ovulation - the day the user experienced ovulation
 * @returns {String[]} - an array containing the start, current, and end dates of ovulation
 */
const getOvulationRange = (ovulation) => {
    const ovulationRangeStart = new Date(ovulation);
    ovulationRangeStart.setDate(ovulation.getDate() - 1);

    const ovulationRangeEnd = new Date(ovulation);
    ovulationRangeEnd.setDate(ovulation.getDate() + 1);

    return [
        formatDate(ovulationRangeStart),
        formatDate(ovulation),
        formatDate(ovulationRangeEnd),
    ];
};

/**
 * Get the range of unsafe days for conception.
 *
 * @param {Date} ovulation - the day the user experienced ovulation
 * @param {Date} lastPeriodDay - the last day of the user's menstruation
 * @returns {String[]} - an array containing unsafe days for conception
 */
const getUnsafeRange = (ovulation, lastPeriodDay) => {
    let unsafeRangeStart;
    let i = 5;
    do {
        unsafeRangeStart = new Date(ovulation);
        unsafeRangeStart.setDate(unsafeRangeStart.getDate() - i);
        i--;
    } while (differenceInDays(unsafeRangeStart, lastPeriodDay) <= 0 && i >= 0);

    const unsafeRangeEnd = new Date(ovulation);
    unsafeRangeEnd.setDate(ovulation.getDate() + 5);

    const unsafeDays = [];
    while (unsafeRangeStart <= unsafeRangeEnd) {
        unsafeDays.push(formatDate(unsafeRangeStart));
        unsafeRangeStart.setDate(unsafeRangeStart.getDate() + 1);
    }

    return unsafeDays;
};

/**
 * Calculate the difference in days between two dates.
 *
 * @param {Date} date1 - the first date
 * @param {Date} date2 - the second date
 * @returns {Number} - the difference in days
 */
const differenceInDays = (date1, date2) => (date1 - date2) / MILLISECONDS_IN_A_DAY;

/**
 * Format a date as a string in "YYYY-MM-DD" format.
 *
 * @param {Date} date - the date to format
 * @returns {String} - the formatted date string
 */
const formatDate = (date) => date.toISOString().split('T')[0];

/**
 * Extract the month from the datetime.
 *
 * @param {String} startdate
 * @returns {String} - the month
 */
exports.month = (startdate) => {
    const dateObject = new Date(startdate);
    const month = dateObject.toLocaleString('en-US', { month: 'long' });

    return month;
};
