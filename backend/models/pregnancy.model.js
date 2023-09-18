const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Pregnancy data
const PregnancySchema = Schema({
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    datetime: {
        type: Date,
        required: true
    },
    days: Number,
    firstTrimesterStartDate: {
        type: Date,
        required: true
    },
    secondTrimesterStartDate: {
        type: Date,
        required: true
    },
    thirdTrimesterStartDate: {
        type: Date,
        required: true
    },
});

const Pregnancy = mongoose.model('User', PregnancySchema);
module.exports = Pregnancy;
