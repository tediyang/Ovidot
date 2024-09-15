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
        required: true,
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
    status: {
        type: String,
        enum: Object.values(userStatus),
        default: userStatus.active
    },
    role: {
        type: String,
        enum: Object.values(Role),
        default: Role.admin
    }
}, {timestamps: true});

adminSchema.pre('save', function(next) {
    if (this.isModified('username')) {
        this.username = this.username.toLowerCase();
    }
    next();
});


module.exports = adminSchema;
