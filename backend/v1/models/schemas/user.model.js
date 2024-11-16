const { Schema } = require('mongoose');
const { Role, userStatus, notificationStatus } = require('../../enums.js');


const notificationSchema = new Schema({
    action: {
      type: String,
      required: true,
    },
    itemId: {
      type: String,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(notificationStatus),
      default: notificationStatus.unread,
    },
}, { timestamps: true });

// Setup a user model
const userSchema = new Schema({
    name: { 
        type: {
          fname: { type: String, required: true, min: 3, max: 20 },
          lname: { type: String, required: true, min: 3, max: 20 },
        },
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(v) {
                return /^\+\d+$/.test(v); // Regex to check if the string contains only digits and starts with country code
            },
            message: props => `${props.value} is not a valid phone number! It should start with country code and contain only numbers.`
        }
    },
    username: {
        type: String,
        validate: {
            validator: function(v) {
                return /^[a-zA-Z]+$/.test(v); // Regex to ensure username contains only alphabets
            },
            message: props => `${props.value} is not a valid username! It should contain only alphabets.`
        }
    },
    password: {
        type: String,
        required: true
    },
    dob: {
        type: Date
    },
    period: {
        type: Number,
        min: 2,
        max: 8
    },
    role: {
        type: String,
        enum: Object.values(Role),
        default: Role.user,
    },
    status: {
        type: String,
        enum: Object.values(userStatus),
        default: userStatus.active,
    },
    loginAttempts: {
        type: Number,
        default: 0
    },
    notificationsList: {
        type: [notificationSchema],
        default: [],
    },
    _cycles: [
        {
            type: Schema.ObjectId,
            ref: 'Cycle'
        }
    ],
    reset: String,
    resetExp: Date,
    jwtRefreshToken: {
        type: String,
        default: ''
    },
}, { timestamps: true });

userSchema.pre('save', function(next) {
    if (this.isModified('username')) {
        this.username = this.username.toLowerCase();
    }
    if (this.isModified('name.fname')) {
        this.name.fname = this.name.fname.toLowerCase();
    }
    if (this.isModified('name.lname')) {
        this.name.lname = this.name.lname.toLowerCase();
    }

    next();
});

module.exports = userSchema;
