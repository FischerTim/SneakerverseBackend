const mongoose = require('mongoose')
 
module.exports = new mongoose.Schema({
    _userId: { type : String, unique:true, required : true}, 
    _refreshToken: { type : String, unique:true, required : true},
})