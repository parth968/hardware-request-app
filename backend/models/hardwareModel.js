const mongoose = require('mongoose');

const HardwareSchema = new mongoose.Schema({
    name: { type: String, required: true }, 
    type: { type: String, required: true }, 
    description: { type: String },           
    qrCode: { type: String, required: true }, // QR code string (could be a URL or a base64 string)
    available: { type: Boolean, default: true }, 
});

module.exports = mongoose.model('Hardware', HardwareSchema);
    