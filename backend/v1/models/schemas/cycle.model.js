const { Schema } = require('mongoose');
const { encryptText, decryptText } = require('../../utility/encryption/encryption.js');

/**
 * Cycle Schema
 * Sensitive fields are encrypted before being saved
 * and decrypted automatically when converted to JSON.
 */
const cycleSchema = new Schema({
    month: { type: String, required: true },
    year: { type: String, required: true },
    period: { type: Number, required: true, min: 1 },
    ovulation: { type: Date },
    start_date: { type: Date, required: true },
    next_date: { type: Date, required: true },
    days: { type: Number, required: true, min: 18, max: 38 },
    period_range: { type: [String], required: true },
    ovulation_range: { type: [String], required: true },
    unsafe_days: { type: [String], required: true }
}, { timestamps: true });

/**
 * Encrypt sensitive fields before saving.
 */
cycleSchema.pre('save', function (next) {
    if (this.isModified('month')) {
        this.month = encryptText(this.month);
    }

    if (this.isModified('year')) {
        this.year = encryptText(this.year);
    }

    if (this.isModified('period_range')) {
        this.period_range = this.period_range.map(date =>
            encryptText(date.toISOString())
        );
    }

    if (this.isModified('ovulation_range')) {
        this.ovulation_range = this.ovulation_range.map(date =>
            encryptText(date.toISOString())
        );
    }

    if (this.isModified('unsafe_days')) {
        this.unsafe_days = this.unsafe_days.map(date =>
            encryptText(date.toISOString())
        );
    }

    next();
});

/**
 * Decrypt fields when returning JSON.
 */
cycleSchema.methods.toJSON = function () {
    const obj = this.toObject();

    if (obj.month) {
        obj.month = decryptText(obj.month);
    }

    if (obj.year) {
        obj.year = decryptText(obj.year);
    }

    if (Array.isArray(obj.period_range)) {
        obj.period_range = obj.period_range.map(value =>
            new Date(decryptText(value))
        );
    }

    if (Array.isArray(obj.ovulation_range)) {
        obj.ovulation_range = obj.ovulation_range.map(value =>
            new Date(decryptText(value))
        );
    }

    if (Array.isArray(obj.unsafe_days)) {
        obj.unsafe_days = obj.unsafe_days.map(value =>
            new Date(decryptText(value))
        );
    }

    return obj;
};

module.exports = cycleSchema;
