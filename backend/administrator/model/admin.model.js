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
    username: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    is_admin: {
        type: Boolean,
        default : false
    }
});

const Admin = mongoose.model('Admin', AdminSchema);
module.exports = Admin;
