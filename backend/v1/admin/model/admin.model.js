const { Schema } = require('mongoose');
const { Role, userStatus } = require('../../enums.js');


// Define the schema for the Admin model
const adminSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        unique: true,
        sparse: true, // Allows multiple documents to omit the username field
        validate: {
            validator: function(v) {
                // Return true if value is null/undefined to let optional validation pass
                return v == null || /^[a-zA-Z]+$/.test(v);
            },
            message: props => `${props.value} is not a valid username! It should contain only alphabets.`
        }
    },
    password: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: Object.values(userStatus),
        default: userStatus.active
    },
    role: {
        type: String,
        enum: Object.values(Role),
        default: Role.admin
    },
    loginAttempts: {
        type: Number,
        default: 0
    },
    changePasswordRequired: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});

adminSchema.pre('save', function(next) {
    if (this.isModified('username')) {
        this.username = this.username.toLowerCase();
    }
    next();
});


module.exports = adminSchema;
