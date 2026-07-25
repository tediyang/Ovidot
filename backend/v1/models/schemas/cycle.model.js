const { Schema } = require('mongoose');
const { symptoms } = require('../../enums.js');
const { encryptText, decryptText } = require('../../utility/encryption/encryption.js');


const dailyLogSchema = new Schema({
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
    symptoms: {
        // Mood (single-select)
        mood: {
        type: String,
        enum: Object.values(symptoms.mood),
        },
        // Flow (single-select)
        flow: {
        type: String,
        enum: Object.values(symptoms.flow),
        },
        // Energy (single-select)
        energy: {
        type: String,
        enum: Object.values(symptoms.energy),
        },
        // Physical symptoms (multi-select)
        physical: {
        type: [String],
        enum: Object.values(symptoms.physical),
        },
        // Emotional symptoms (multi-select)
        emotional: {
        type: [String],
        enum: Object.values(symptoms.emotional),
        },
        // Digestive symptoms (multi-select)
        digestive: {
        type: [String],
        enum: Object.values(symptoms.digestive),
        },
        // Sleep symptoms (multi-select)
        sleep: {
        type: [String],
        enum: Object.values(symptoms.sleep),
        },
        // Skin symptoms (multi-select)
        skin: {
        type: [String],
        enum: Object.values(symptoms.skin),
        },
        // Cognitive symptoms (multi-select)
        cognitive: {
        type: [String],
        enum: Object.values(symptoms.cognitive),
        },
        // Sexual symptoms (multi-select)
        sexual: {
        type: [String],
        enum: Object.values(symptoms.sexual),
        },
        // Behavioral symptoms (multi-select)
        behavioral: {
        type: [String],
        enum: Object.values(symptoms.behavioral),
        },
    },
    painLevel: {
        type: Number,
        min: 0,
        max: 10,
        default: 0,
    },
    notes: {
        type: String,
        maxLength: 1000,
    },
}, { timestamps: true });


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
    unsafe_days: { type: [String], required: true },
    dailyLogs: { type: [dailyLogSchema], default: [] },
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
 * Encrypt sensitive fields before updating (findOneAndUpdate, findByIdAndUpdate, updateOne, etc.)
 */
cycleSchema.pre('findOneAndUpdate', async function (next) {
    const update = this.getUpdate();

    // Helper to encrypt a single field
    const encryptField = (field) => {
        if (update[field]) {
            update[field] = encryptText(update[field]);
        }
    };

    // Helper to encrypt an array field
    const encryptArrayField = (field) => {
        if (update[field] && Array.isArray(update[field])) {
            update[field] = update[field].map(v => encryptText(v));
        }
    };

    // Handle direct update (without $set)
    encryptField('ovulation');
    encryptField('start_date');
    encryptField('next_date');
    encryptArrayField('period_range');
    encryptArrayField('ovulation_range');
    encryptArrayField('unsafe_days');

    // Handle updates using $set operator (common in findOneAndUpdate)
    if (update.$set) {
        if (update.$set.ovulation) update.$set.ovulation = encryptText(update.$set.ovulation);
        if (update.$set.start_date) update.$set.start_date = encryptText(update.$set.start_date);
        if (update.$set.next_date) update.$set.next_date = encryptText(update.$set.next_date);
        if (Array.isArray(update.$set.period_range)) {
            update.$set.period_range = update.$set.period_range.map(v => encryptText(v));
        }
        if (Array.isArray(update.$set.ovulation_range)) {
            update.$set.ovulation_range = update.$set.ovulation_range.map(v => encryptText(v));
        }
        if (Array.isArray(update.$set.unsafe_days)) {
            update.$set.unsafe_days = update.$set.unsafe_days.map(v => encryptText(v));
        }
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

cycleSchema.methods.addDailyLog = function(date, logData) {
    // Check if log exists for this date
    const existingLogIndex = this.dailyLogs.findIndex(
        log => log.date.toISOString().split('T')[0] === new Date(date).toISOString().split('T')[0]
    );

    const logEntry = {
        date: new Date(date),
        symptoms: {
            mood: logData.mood || null,
            flow: logData.flow || null,
            energy: logData.energy || null,
            physical: logData.physical || [],
            emotional: logData.emotional || [],
            digestive: logData.digestive || [],
            sleep: logData.sleep || [],
            skin: logData.skin || [],
            cognitive: logData.cognitive || [],
            sexual: logData.sexual || [],
            behavioral: logData.behavioral || [],
        },
        painLevel: logData.painLevel || 0,
        notes: logData.notes || ''
    };

    if (existingLogIndex !== -1) {
        // Update existing log
        this.dailyLogs[existingLogIndex] = {
        ...this.dailyLogs[existingLogIndex].toObject(),
        ...logEntry,
        };
    } else {
        // Add new log
        this.dailyLogs.push(logEntry);
    }
};

// Helper method to get symptoms for a specific date
cycleSchema.methods.getDailyLog = function(date) {
    const dateStr = new Date(date).toISOString().split('T')[0];
    return this.dailyLogs.find(
        log => log.date.toISOString().split('T')[0] === dateStr
    );
};

// Helper method to get all symptoms for a date range
cycleSchema.methods.getSymptomsInRange = function(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return this.dailyLogs.filter(log => {
        const logDate = new Date(log.date);
        return logDate >= start && logDate <= end;
    });
};

// Helper method to get symptom analytics for the cycle
cycleSchema.methods.getSymptomAnalytics = function() {
    const analytics = {
        totalLogs: this.dailyLogs.length,
        moodDistribution: {},
        flowDistribution: {},
        energyDistribution: {},
        symptomFrequency: {},
        painTrends: [],
        symptomTimeline: [],
    };
    
    this.dailyLogs.forEach(log => {
        const symptoms = log.symptoms;
        const date = log.date.toISOString().split('T')[0];
        
        // Track mood
        if (symptoms.mood) {
        analytics.moodDistribution[symptoms.mood] = 
            (analytics.moodDistribution[symptoms.mood] || 0) + 1;
        }
        
        // Track flow
        if (symptoms.flow) {
        analytics.flowDistribution[symptoms.flow] = 
            (analytics.flowDistribution[symptoms.flow] || 0) + 1;
        }
        
        // Track energy
        if (symptoms.energy) {
        analytics.energyDistribution[symptoms.energy] = 
            (analytics.energyDistribution[symptoms.energy] || 0) + 1;
        }
        
        // Track all symptoms
        for (const [category, values] of Object.entries(symptoms)) {
            // Skip the specific distribution categories
            if (['mood', 'flow', 'energy'].includes(category)) {
                continue;
            }

            if (Array.isArray(values) && values.length > 0) {
                values.forEach(value => {
                    const key = `${category}:${value}`;
                    analytics.symptomFrequency[key] = 
                    (analytics.symptomFrequency[key] || 0) + 1;
                });
            } else if (values && typeof values === 'string') {
                const key = `${category}:${values}`;
                analytics.symptomFrequency[key] = 
                (analytics.symptomFrequency[key] || 0) + 1;
            }
        }
        
        // Track pain trends
        analytics.painTrends.push({
            date,
            painLevel: log.painLevel || 0,
        });

        // Track symptom timeline
        const symptomList = [];
        for (const [category, values] of Object.entries(symptoms)) {
            if (Array.isArray(values) && values.length > 0) {
                values.forEach(value => {
                    symptomList.push({ category, value });
                });
            } else if (values && typeof values === 'string') {
                symptomList.push({ category, value: values });
            }
        }
        
        analytics.symptomTimeline.push({
            date,
            symptoms: symptomList,
            count: symptomList.length,
            painLevel: log.painLevel || 0,
        });
    });
    
    // Sort timeline by date
    analytics.symptomTimeline.sort((a, b) => a.date.localeCompare(b.date));
    analytics.painTrends.sort((a, b) => a.date.localeCompare(b.date));
    
    // Get top symptoms
    const sortedSymptoms = Object.entries(analytics.symptomFrequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
    
    analytics.topSymptoms = sortedSymptoms.map(([symptom, count]) => ({
        symptom,
        count,
    }));
    
    return analytics;
};

// Indexes
cycleSchema.index({ 'dailyLogs.date': -1 });


module.exports = cycleSchema;
