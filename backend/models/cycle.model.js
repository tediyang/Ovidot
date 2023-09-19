const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Setup the calender model
const CycleSchema = Schema({
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    month: {
        type: String,
        require: true
    },
    period: {
        type: Number,
        required: true,
        min: 1
    },
    start_date: {
        type: Date,
        require: true
    },
    days: {
	    type: Number,
	    required: true,
        min: 1
    },
    ovulation: {
        type: Date,
    },
    period_range: [
        {
            type: Date,
            required: true
        }
    ],
    ovulation_range: [
        {
            type: Date,
            required: true,
        }
    ],
    safe_days: [
        {
            type: Date,
            required: true
        }
    ]
});

const Cycle = mongoose.model('Cycle', CycleSchema);
module.exports = Cycle;
