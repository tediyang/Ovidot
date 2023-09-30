// admin.model.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdminSchema = Schema({
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
    isAdmin: {
        type: Boolean,
        default: true
    }
});

const Admin = mongoose.model('Admin', AdminSchema);
module.exports = Admin;
