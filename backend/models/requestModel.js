const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to User model
        required: true
    },
    hardwareId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hardware', // Reference to Hardware model
        required: true
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        enum: ['lifetime', 'temporary'],
        required: true
    },
    endDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'detached'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Request', requestSchema);
