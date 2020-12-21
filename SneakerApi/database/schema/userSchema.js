const mongoose = require("mongoose");
const address = require("../schema/addressSchema");
module.exports = new mongoose.Schema({
    _username: {type: String, unique: true, required: true},
    _password: {type: String, required: true},
    _role: {type: String, default: "User"},
    _sessionToken: {type: String},
    _offers: {type: []},
    _favorites: {type: []},
    _registered: {type: Date, default: Date.now, required: true},
    _chats: {type: []},
    _address: {type: address},
    _ratings: {type:[]}
});
