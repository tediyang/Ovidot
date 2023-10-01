const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the Admin model
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
        required: true, // 'require' should be 'required'
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    is_admin: {
        type: Boolean,
        default: false
    }
});

// Create the Admin model using the schema
const Admin = mongoose.model('Admin', AdminSchema);

// Export the Admin model
module.exports = Admin;
