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
        require: true
    },
    days: Number,
    firstSprint: {
        type: Date,
        require: true
    },
    secondSprint: {
        type: Date,
        require: true
    },
    lastSprint: {
        type: Date,
        require: true
    },
});

const Pregnancy = mongoose.model('User', PregnancySchema);
module.exports = Pregnancy;
