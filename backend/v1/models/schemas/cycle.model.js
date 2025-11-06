const mongoose = require('mongoose');
const { encryptText, decryptText } = require('../../utility/encryption/encryption.js');

const { Schema } = mongoose;

/**
 * Cycle Schema
 * Represents menstrual cycle tracking data.
 * Sensitive date fields are encrypted for privacy protection.
 */
const cycleSchema = new Schema(
  {
    month: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    period: {
      type: Number,
      required: true,
      min: 1,
    },
    ovulation: {
      type: String,
    },
    start_date: {
      type: String,
      required: true,
    },
    next_date: {
      type: String,
      required: true,
    },
    days: {
      type: Number,
      required: true,
      min: 18,
      max: 38,
    },
    period_range: {
      type: [String],
      required: true,
    },
    ovulation_range: {
      type: [String],
      required: true,
    },
    unsafe_days: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);

/**
 * Pre-save middleware
 * Encrypts all sensitive date fields before saving to the database.
 */
cycleSchema.pre('save', function (next) {
  try {
    if (this.isModified('start_date'))
      this.start_date = encryptText(
        this.start_date.toISOString ? this.start_date.toISOString() : this.start_date
      );

    if (this.isModified('next_date'))
      this.next_date = encryptText(
        this.next_date.toISOString ? this.next_date.toISOString() : this.next_date
      );

    if (this.isModified('ovulation') && this.ovulation)
      this.ovulation = encryptText(
        this.ovulation.toISOString ? this.ovulation.toISOString() : this.ovulation
      );

    if (this.isModified('period_range'))
      this.period_range = this.period_range.map((d) =>
        encryptText(d.toISOString ? d.toISOString() : d)
      );

    if (this.isModified('ovulation_range'))
      this.ovulation_range = this.ovulation_range.map((d) =>
        encryptText(d.toISOString ? d.toISOString() : d)
      );

    if (this.isModified('unsafe_days'))
      this.unsafe_days = this.unsafe_days.map((d) =>
        encryptText(d.toISOString ? d.toISOString() : d)
      );

    next();
  } catch (err) {
    next(err);
  }
});

/**
 * Post-init middleware
 * Decrypts fields automatically after document retrieval (e.g., find, findOne).
 */
cycleSchema.post('init', function (doc) {
  try {
    doc.start_date = new Date(decryptText(doc.start_date));
    doc.next_date = new Date(decryptText(doc.next_date));
    doc.ovulation = doc.ovulation ? new Date(decryptText(doc.ovulation)) : null;
    doc.period_range = doc.period_range.map((d) => new Date(decryptText(d)));
    doc.ovulation_range = doc.ovulation_range.map((d) => new Date(decryptText(d)));
    doc.unsafe_days = doc.unsafe_days.map((d) => new Date(decryptText(d)));
  } catch (err) {
    console.error('Decryption failed for cycle document:', err.message);
  }
});

module.exports = cycleSchema;
