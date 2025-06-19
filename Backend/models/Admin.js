const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        // unique: true // Optional: helps prevent duplicate emails
    },
    password: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    }
}, {
    timestamps: true // Optional: adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Admin', adminSchema);
