const mongoose = require("mongoose");
const chatMessageSchema = require('./chatMessageSchema')

module.exports = new mongoose.Schema({
    _messages: {type: [], default: []},
    _subscriber: {type: []},
});
