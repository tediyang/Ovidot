
/**
 * The number of milliseconds in a day.
 * @constant {number}
 */
const MILLISECONDS_IN_A_DAY = 24 * 60 * 60 * 1000;

/**
 * The default duration of the menstrual cycle in days.
 * @constant {number}
 */
const DEFAULT_CYCLE_DURATION = 28;

/**
 * The date format used for formatting dates as strings.
 * @constant {string}
 */
const DATE_FORMAT = 'YYYY-MM-DD';

/**
 * The number of days used in calculations for unsafe days.
 * @constant {number}
 */
const DAYS_FOR_UNSAFE_CALCULATIONS = 5;

/**
 * Calculate the estimated menstrual cycle for an individual.
 *
 * @param {number} period - The number of days of menstruation.
 * @param {Date} startDate - The beginning of the user's cycle (YYYY-MM-DD).
 * @param {Date|null} ovulation - The day the user experienced ovulation in the cycle (YYYY-MM-DD), or null for default.
 * @returns {Promise} - A promise that resolves to an object with variables for cycle information.
 */
export async function calculate(period, startDate, ovulation = null) {
    try {
        const dayOne = new Date(startDate);
        let dayLast;

        // Generate the period range
        const periodRange = generateDateRange(dayOne, period);

        // Initialize the ovulation date
        ovulation = initializeOvulationDate(ovulation, dayOne, period);

        // Determine the last day of menstruation
        dayLast = getLastDayOfMenstruation(dayOne, period);

        // Validate ovulation date
        validateOvulationDate(ovulation, dayLast);

        // Calculate total cycle days
        const totalCycleDays = getTotalCycleDays(dayOne, ovulation, DEFAULT_CYCLE_DURATION);

        // Get the range of ovulation
        const ovulationRange = getOvulationRange(ovulation, dayLast);

        // Get the range of unsafe days
        const unsafeRange = getUnsafeRange(ovulation, periodRange[periodRange.length - 1]);

        // Calculate the next date
        const nextDate = calculateNextDate(dayOne, totalCycleDays);

        // Resolve the promise with the calculated information
        return {
            days: totalCycleDays,
            periodRange,
            ovulation: formatDate(ovulation),
            ovulationRange,
            unsafeDays: unsafeRange,
            nextDate
        };
    } catch (err) {
        // Reject the promise with an error if any exception occurs
        throw err;
    }
}

/**
 * Generate an array of dates representing the period range.
 *
 * @param {Date} startDate - The beginning of the user's cycle.
 * @param {number} period - The number of days of menstruation.
 * @returns {string[]} - An array of formatted date strings.
 */
const generateDateRange = (startDate, period) => {
    const periodRange = [];
    for (let i = 0; i < period; i++) {
        const currDate = new Date(startDate);
        currDate.setDate(startDate.getDate() + i);
        periodRange.push(formatDate(currDate));
    }
    return periodRange;
};

/**
 * Initialize the ovulation date, either using the provided date or a default value.
 *
 * @param {Date|null} ovulation - The day the user experienced ovulation in the cycle, or null for default.
 * @param {Date} dayOne - The beginning of the user's cycle.
 * @param {number} period - The number of days of menstruation.
 * @returns {Date} - The initialized ovulation date.
 */
const initializeOvulationDate = (ovulation, dayOne, period) => {
    if (ovulation === null) {
        ovulation = new Date(dayOne);
        ovulation.setDate(dayOne.getDate() + 9 + period);
    } else {
        ovulation = new Date(ovulation);
    }
    return ovulation;
};

/**
 * Get the last day of menstruation.
 *
 * @param {Date} dayOne - The beginning of the user's cycle.
 * @param {number} period - The number of days of menstruation.
 * @returns {Date} - The last day of menstruation.
 */
const getLastDayOfMenstruation = (dayOne, period) => {
    const dayLast = new Date(dayOne);
    dayLast.setDate(dayLast.getDate() + period - 1);
    return dayLast;
};

/**
 * Validate the ovulation date to ensure it doesn't occur before or during menstruation.
 *
 * @param {Date} ovulation - The day the user experienced ovulation in the cycle.
 * @param {Date} dayLast - The last day of menstruation.
 */
const validateOvulationDate = (ovulation, dayLast) => {
    if (ovulation <= dayLast) {
        const err = new Error("Invalid ovulation date: Can't occur before or during menstruation");
        err.statusCode = 400;
        throw err;
    }
};

/**
 * Get the total number of days in the menstrual cycle.
 *
 * @param {Date} startDate - The beginning of the user's cycle.
 * @param {Date} ovulation - The day the user experienced ovulation.
 * @param {number} cycleDuration - The duration of the cycle in days.
 * @returns {number} - The total number of days in the cycle.
 */
const getTotalCycleDays = (startDate, ovulation, cycleDuration) => {
    const days = new Date(ovulation);
    days.setDate(ovulation.getDate() + cycleDuration - 1);
    return (days - startDate) / MILLISECONDS_IN_A_DAY;
};

/**
 * Get the range of ovulation dates.
 *
 * @param {Date} ovulation - The day the user experienced ovulation.
 * @param {Date} dayLast - The last day of menstruation.
 * @returns {string[]} - An array containing the start, current, and end dates of ovulation.
 */
const getOvulationRange = (ovulation, dayLast = null) => {
    const ovulationRangeStart = new Date(ovulation);
    ovulationRangeStart.setDate(ovulation.getDate() - 1);

    const ovulationRangeEnd = new Date(ovulation);
    ovulationRangeEnd.setDate(ovulation.getDate() + 1);

    const result = [
        formatDate(ovulationRangeStart),
        formatDate(ovulation),
        formatDate(ovulationRangeEnd),
    ];

    if (dayLast && ovulationRangeStart.getTime() === dayLast.getTime()) {
        result.shift();
    }

    return result;
};

/**
 * Get the range of unsafe days for conception.
 *
 * @param {Date} ovulation - The day the user experienced ovulation.
 * @param {Date} lastPeriodDay - The last day of the user's menstruation.
 * @returns {string[]} - An array containing unsafe days for conception.
 */
const getUnsafeRange = (ovulation, lastPeriodDay) => {
    let unsafeRangeStart;
    let i = DAYS_FOR_UNSAFE_CALCULATIONS;
    do {
        unsafeRangeStart = new Date(ovulation);
        unsafeRangeStart.setDate(unsafeRangeStart.getDate() - i);
        i--;
    } while (differenceInDays(unsafeRangeStart, lastPeriodDay) <= 0 && i >= 0);

    const unsafeRangeEnd = new Date(ovulation);
    unsafeRangeEnd.setDate(ovulation.getDate() + DAYS_FOR_UNSAFE_CALCULATIONS);

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
 * @param {Date} date1 - The first date.
 * @param {Date} date2 - The second date.
 * @returns {number} - The difference in days.
 */
const differenceInDays = (date1, date2) => (date1 - date2) / MILLISECONDS_IN_A_DAY;

/**
 * Format a date as a string in "YYYY-MM-DD" format.
 *
 * @param {Date} date - The date to format.
 * @returns {string} - The formatted date string.
 */
const formatDate = (date) => date.toISOString().split('T')[0];

/**
 * Extract the month from the datetime.
 *
 * @param {string} startdate - The starting date.
 * @returns {string} - The month.
 */
export function month(startdate) {
    const dateObject = new Date(startdate);
    return dateObject.toLocaleString('en-US', { month: 'long' });
}
