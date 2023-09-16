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
        require: true
    },
    password: {
        type: String,
        require: true
    },
    username: String,
    age: Number,
    period: Number,
    _cycle: [
        {
            type: Schema.ObjectId,
            ref: 'Cycle'
        }
    ],
    _pregnancy: [
        {
            type: Schema.ObjectId,
            ref: 'Pregnancy'
        }
    ]
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
