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
    days: Number,
    period: Number,
    ovulation: Number
})

const Cycle = mongoose.model('Cycle', CycleSchema);
module.exports = Cycle;
