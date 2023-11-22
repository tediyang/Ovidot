import { Schema, model } from 'mongoose';

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
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true,
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

const User = model('User', UserSchema);
export default User;
