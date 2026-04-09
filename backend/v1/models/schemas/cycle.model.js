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
    ovulation: { type: String },
    start_date: { type: String, required: true },
    next_date: { type: String, required: true },
    days: { type: Number, required: true, min: 18, max: 38 },
    period_range: { type: [String], required: true },
    ovulation_range: { type: [String], required: true },
    unsafe_days: { type: [String], required: true }
}, { timestamps: true });

/**
 * Encrypt sensitive fields before saving.
 */
cycleSchema.pre('save', function (next) {
    if (this.isModified('ovulation')) {
        this.ovulation = encryptText(this.ovulation);
    }

    if (this.isModified('start_date')) {
        this.start_date = encryptText(this.start_date);
    }

    if (this.isModified('next_date')) {
        this.next_date = encryptText(this.next_date);
    }

    if (this.isModified('period_range')) {
        this.period_range = this.period_range.map(date =>
            encryptText(date)
        );
    }

    if (this.isModified('ovulation_range')) {
        this.ovulation_range = this.ovulation_range.map(date =>
            encryptText(date)
        );
    }

    if (this.isModified('unsafe_days')) {
        this.unsafe_days = this.unsafe_days.map(date =>
            encryptText(date)
        );
    }

    next();
});

/**
 * Decrypt fields when returning JSON.
 */
cycleSchema.methods.toJSON = function () {
    const obj = this.toObject();

    if (obj.ovulation) {
        obj.ovulation = decryptText(obj.ovulation);
    }

    if (obj.start_date) {
        obj.start_date = decryptText(obj.start_date);
    }

    if (obj.next_date) {
        obj.next_date = decryptText(obj.next_date);
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
