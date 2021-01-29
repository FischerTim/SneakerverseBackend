const mongoose = require("mongoose");
const Double = require('@mongoosejs/double');
require('mongoose-long')(mongoose);
module.exports = new mongoose.Schema({
    _latitude: {type: Double, require: true},
    _longitude: {type: Double, require: true},
    _cityName: {type: String, require: true},
});
