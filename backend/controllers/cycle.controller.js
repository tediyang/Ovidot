const Cycle = require("../models/cycle.model");
const handleResponse = require("../utility/handle.response");
const cycleCalculator = require("../utility/cycle.calculator");
const HttpStatus =  require('httpstatus');
const User = require('../models/user.model');
const { populateWithCycles } = require('../utility/user.populate')

// create a cycle for a given user
exports.create = async(req, res, next) => {
	try {
		const id = req.params.userId;
		const { period, ovulation, startdate } = req.body;

		const month = cycleCalculator.month(startdate);

		const user = await populateWithCycles(id, 'month', month);
		if (user === null) {
			console.log('User not found');
			return handleResponse(res, HttpStatus.NOT_FOUND, 'User not found');
		}
		if (user._cycles.length > 0) {
			/**
			 * 1. Get the most recent data for that month.
			 */
			const lastCycle = user._cycles[user._cycles.length - 1];
			const nextD = new Date(lastCycle.next_date);
			const prevD = new Date(startdate);
			const diff = (nextD - prevD) / (24 * 60 * 60 * 1000);
			if (diff > 10) {
				await Cycle.findByIdAndDelete(lastCycle._id);
			}
		}
		// if user._cycles is false, create a new one.
		const cycleData = await cycleCalculator.calculate(period, startdate, ovulation);

		const newCycle = await Cycle({
			month: month,
			period: period,
			ovulation: cycleData.ovulation,
			start_date: startdate,
			next_date: cycleData.next_date,
			days: cycleData.days,
			period_range: cycleData.periodRange,
			ovulation_range: cycleData.ovulationRange,
			unsafe_days: cycleData.unsafeDays
		});

		await newCycle.save();
		user._cycles.push(newCycle._id);
		await user.save();
		return res.status(201).send();

	} catch(error) {
    	console.error(error);
      	return handleResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
	}
}

// fetch all the cycles for a given user
exports.fetchAll = async(req, res, next) => {
	try {
		const id = req.params.userId;

		User.findById(id)
  		.populate({
    		path: '_cycles'
		})
  		.exec((err, user) => {
			if (err) {
				console.error(err);
				return handleResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
			}
			if (!user) {
				console.log('User not found');
				return handleResponse(res, HttpStatus.NOT_FOUND, 'User not found');
			}

			return res.status(200).json(user._cycles);
		})
	} catch (err) {
		return handleResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
	}
}

// get cycle by cycleId for a given user
exports.fetchOne = async (req, res, next) => {
	try {
		const { userId, cycleId } = req.params;

		const user = await populateWithCycles(userId, '_id', cycleId);
		if (user === null) {
			console.log('User not found');
			return handleResponse(res, HttpStatus.NOT_FOUND, 'User not found');
		}
		if (user._cycles.length == 0) {
			return handleResponse(res, HttpStatus.NOT_FOUND, "Cycle not found");
		}
		return res.status(200).json(user._cycles[0]);
	} catch (err) {
		return handleResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
	}
}

// get cycle by month fora a given user
exports.fetchMonth = async (req, res, next) => {
	try {
		const { userId, month } = req.params;

		const user = await populateWithCycles(userId, 'month', month);
		if (user === null) {
			console.log('User not found');
			return handleResponse(res, HttpStatus.NOT_FOUND, 'User not found');
		}
		if (user._cycles.length == 0) {
			return handleResponse(res, HttpStatus.NOT_FOUND, "Cycle not found");
		}
		return res.status(200).json(user._cycles[0]);
	} catch (err) {
		return handleResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
	}
}

/* update a cycle record by cycleId for a given user */
exports.update = async(req, res) => {
	try {
		const { userId, cycleId } = req.params;
		const { period, ovulation, startdate } = req.body;

		const user = await populateWithCycles(userId, '_id', cycleId);
		if (user === null) {
			return handleResponse(res, HttpStatus.NOT_FOUND, "User not found");
		}
		if (user._cycles.length == 0) {
			return handleResponse(res, HttpStatus.NOT_FOUND, "Cycle not found");
		}
		const updated_at = new Date();
		const cycleFound = user._cycles[0];
		const newCycle = await cycleCalculator.calculate(period, startdate, ovulation);
		const updatecycle = await Cycle.findByIdAndUpdate(cycleFound._id, {
			updated_at: updated_at,
			period: period,
			ovulation: newCycle.ovulation,
			start_date: startdate,
			next_date: newCycle.next_date,
			days: newCycle.days,
			period_range: newCycle.periodRange,
			ovulation_range: newCycle.ovulationRange,
			unsafe_days: newCycle.unsafeDays
		},
		{ new: true });

		await user.save();
	}
	catch(error) {
		console.error(error);
		handleResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, "internal server error");
	}
}

/* Delete cycle by cycleId for a given user */
exports.delete = async(req, res, next) => {
	try {
		const { userId, cycleId } = req.params;
		const user = await populateWithCycles(userId, '_id', cycleId);
		if (user === null) {
			return handleResponse(res, HttpStatus.NOT_FOUND, "User not found");
		}
		if (user._cycles.length == 0) {
			return handleResponse(res, HttpStatus.NOT_FOUND, "Cycle not found");
		}
		await Cycle.findByIdAndRemove(cycleId);
		return handleResponse(res, HttpStatus.OK, "cycle successfully deleted");
	}
	catch(error) {
		console.log(err);
		handleResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, "internal server error");
	}
};
