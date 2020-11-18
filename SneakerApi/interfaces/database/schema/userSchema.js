const mongoose = require('mongoose')
 
module.exports = new mongoose.Schema({
    _username: { type : String, unique : true, required : true}, 
    _password: { type : String, required : true},
    _role: { type : String, default: "User"}
})