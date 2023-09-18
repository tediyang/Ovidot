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
    datetime: {
        type: Date,
        require: true
    },
    days: {
	    type: Number,
	    required: true,
	    min: 1 //min val for days
    },
    period: {
	    type: Number,
	    required: true,
	    min: 1
    },
    ovulation: {
	    type: Number,
	    required: true,
	    min: 1
    },
});

const Cycle = mongoose.model('Cycle', CycleSchema);
module.exports = Cycle;
