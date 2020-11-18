const mongoose = require('mongoose')
 
module.exports = new mongoose.Schema({
    _userId: { type : String, required : true}, 
    _: { type : String, required : true},
})