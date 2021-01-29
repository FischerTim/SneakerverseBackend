const mongoose = require("mongoose");
const City = require("./citySchema");
module.exports = new mongoose.Schema({
    _username: {type: String, unique: true, required: true},
    _password: {type: String, required: true},
    _role: {type: String, default: "User"},
    _sessionToken: {type: String},
    _offers: {type: []},
    _favorites: {type: []},
    _registered: {type: String, required: true},
    _chats: {type: []},
    _city: {type: City},
    _ratings: {type:[]}
});
