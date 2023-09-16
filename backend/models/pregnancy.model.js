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
    days: Number,
    datetime: {
        type: Date,
        require: true
    }
});

const Pregnancy = mongoose.model('User', PregnancySchema);
module.exports = Pregnancy;
