const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Setup a user model
const UserSchema = Schema({
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    username: {
        type: String,
        require: true
    },
    age: {
        type: Number,
        require: true,
        min: 8,
        max: 55
    },
    is_admin: {
        type: Boolean,
        default: false
    },
    reset: String,
    resetExp: Date,
    _cycles: [
        {
            type: Schema.ObjectId,
            ref: 'Cycle'
        }
    ],
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
