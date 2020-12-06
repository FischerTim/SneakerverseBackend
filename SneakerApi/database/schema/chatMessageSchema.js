const mongoose = require("mongoose");


module.exports = new mongoose.Schema({
    _senderName: {type: String, required: true},
    _message: {type: String, required: true},
    _chatId: {type: String, required: true},
});
