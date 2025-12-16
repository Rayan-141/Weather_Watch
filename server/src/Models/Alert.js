const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    type: {
        type: String, // 'rain', 'temperature'
        required: true
    },
    condition: {
        type: String, // '>', '<'
        required: true
    },
    threshold: {
        type: Number,
        required: true
    },
    message: {
        type: String
    }
});

module.exports = mongoose.model('Alert', AlertSchema);

