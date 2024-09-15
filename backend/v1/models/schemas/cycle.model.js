const { Schema } = require('mongoose');

// Setup a Cycle model
const cycleSchema = new Schema({
    month: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    period: {
        type: Number,
        required: true,
        min: 1
    },
    ovulation: {
        type: Date,
    },
    start_date: {
        type: Date,
        required: true
    },
    next_date: {
        type: Date,
        required: true
    },
    days: {
	    type: Number,
	    required: true,
        min: 18,
        max: 38
    },
    period_range: {
        type: [Date],
        required: true
    },
    ovulation_range: {
        type: [Date],
        required: true
    },
    unsafe_days: {
        type: [Date],
        required: true
    }
}, { timestamps: true });


module.exports = cycleSchema;
