/**
 * Calculate the estimated cycle for the individual
 * Note: this calcutor is based on the average 28 days cycle,
 * proper estimation will be made on later version from data provided
 * individula by users to get an accurate prediction.
 * @param {String} Number- the number of days of menstruation 
 * @returns - an object with variables of days (cycle duration), periodRange,
 * ovulationRange and unsafeDays.
 */
exports.calculate = (period, startDate, ovulation = null) => {
    return new Promise((resolve, reject) => {
        try {
            const dayOne = new Date(startDate);
            const periodRange = [];
            const unsafeDays = [];

            /**
             * Check if the user provided a date which ovulation was experienced
             * if yes:
             *      then get the difference of the date from the start day to get
             *      the range.
             * if no:
             *      use the default ovulationDate for the user.
             */
            if (ovulation == null) {
                ovulation = new Date(dayOne);
                ovulation.setDate(dayOne.getDate() + 9 + period);
            } else {
                ovulation = new Date(ovulation);
                if (ovulation.getDate() < dayOne.getDate()) {
                    throw new Error("ovulation date can't occur before period date");
                }
            }

            // Get the total days of cycle.
            // totalCycleDays = ovulationDate + 14days - StartDate
            const days = new Date(ovulation);
            days.setDate(ovulation.getDate() + 15);
            const totalCycleDays = (days - dayOne) / (24 * 60 * 60 * 1000);

            // Get the period range by adding each day
            for (let i = 0; i < period; i++) {
                const currDate = new Date(dayOne);
                currDate.setDate(dayOne.getDate() + i);
                periodRange.push(currDate.toISOString().split('T')[0]);  // remove the time format
            }

            // Calculate the predicted start date and end date for ovulation.
            const ovulationRangeStart = new Date(ovulation);
            ovulationRangeStart.setDate(ovulation.getDate() - 1);

            const ovulationRangeEnd = new Date(ovulation);
            ovulationRangeEnd.setDate(ovulation.getDate() + 1);

            // Calculate the ovulation
            const ovulationRange = [
                ovulationRangeStart.toISOString().split('T')[0],
                ovulation.toISOString().split('T')[0],
                ovulationRangeEnd.toISOString().split('T')[0]
            ]

            /** Calculate the unsafeRange
            * Get unsafeRangeStart, and if the difference between unsafeRangeStart and lastPeriod is less than 0.
            * increase the unsafeRangeStart date
            */ 
            const unsafeRangeStart = new Date(ovulation);
            const lastPeriodDay = new Date(periodRange[periodRange.length - 1]);
            let i = 5;
            do {
                unsafeRangeStart.setDate(ovulation.getDate() - i);
                i--;
            } while (unsafeRangeStart.getDate() - lastPeriodDay.getDate() < 0 && i >= 0);

            const unsafeRangeEnd = new Date(ovulation);
            unsafeRangeEnd.setDate(ovulation.getDate() + 5);

            // Append all the unsafeDays
            while (unsafeRangeStart <= unsafeRangeEnd) {
                unsafeDays.push(unsafeRangeStart.toISOString().split('T')[0]); // Format as "YYYY-MM-DD"
                unsafeRangeStart.setDate(unsafeRangeStart.getDate() + 1);
            }

            let nextDate = new Date();
            nextDate.setDate(dayOne.getDate() + totalCycleDays)
            nextDate = nextDate.toISOString().split('T')[0];

            resolve ({
                days: totalCycleDays,
                periodRange,
                ovulation: ovulationRange[1],
                ovulationRange,
                unsafeDays,
                nextDate
            });
        } catch(err) {
            reject(err);
        }
    });
}

/**
 * Extract the month from the datetime
 * @param {String} startdate
 * @returns - return the month
 */
exports.month = startdate => {
    const dateObject = new Date(startdate);
    const month = dateObject.toLocaleString('en-US', { month: 'long' });

    return month;
}
