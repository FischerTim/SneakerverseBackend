const mongoose = require("mongoose");
const Double = require('@mongoosejs/double');
require('mongoose-long')(mongoose);
const Long = mongoose.Schema.Types.Long;

module.exports = new mongoose.Schema({
    _streetName: {type: String, require: true},
    _homeNumber: {type: Number, require: true},
    _postCode: {type: Long, require: true},
    _cityName: {type: String, require: true},
});
