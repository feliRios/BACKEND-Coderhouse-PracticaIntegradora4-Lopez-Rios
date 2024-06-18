const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({
    user: { 
        type: String, 
        required: true
    },
    message: { 
        type: String, 
        required: true
    },
    date: {
        type: String,
        required: true
    }
});

const Message = mongoose.model('Messages', MessageSchema);

module.exports = Message