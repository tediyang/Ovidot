// This module contains data parser functions for cycle controller

class CycleParser {

	// mapped months names to integer
	MONTHS = {
		1: 'January',
		2: 'February',
		3: 'March',
		4: 'April',
		5: 'May',
		6: 'June',
		7: 'July',
		8: 'August',
		9: 'September',
		10: 'October',
		11: 'November',
		12: 'December'
	}

	/**
	 * Parse the data to create the cycle.
	 * @param {String} month - Month of Cycle.
	 * @param {Number} period - Number of menstrual days.
	 * @param {Date} startdate - The first day of the cycle.
	 * @param {Object} data - The cycle calculated data.
	 * @returns - Data to parse to cycle model.
	 */
	Parse(month, period, startdate, data ) {
		const result = {
			month: month,
			year: startdate.toISOString().slice(0, 4),
			period: period,
			ovulation: data.ovulation,
			start_date: startdate,
			next_date: data.nextDate,
			days: data.days,
			period_range: data.periodRange,
			ovulation_range: data.ovulationRange,
			unsafe_days: data.unsafeDays
		}
		return result;
	}
	
	/**
	 * Take in a cycle object and return selected cycle properties.
	 * @param {Cycle} cycle.
	 * @returns cycles properties.
	 */
	 Filter(cycle) {
		const result = {
			id: cycle.id,
			month: cycle.month,
			year: cycle.year,
			period: cycle.period,
			ovulation: cycle.ovulation,
			start_date: cycle.start_date,
			next_date: cycle.next_date,
			days: cycle.days,
			period_range: cycle.period_range,
			ovulation_range: cycle.ovulation_range,
			unsafe_days: cycle.unsafe_days
		}
		return result;
	}
}

const cycleParser = new CycleParser();
module.exports = cycleParser;
