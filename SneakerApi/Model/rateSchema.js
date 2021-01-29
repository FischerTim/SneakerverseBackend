const mongoose = require("mongoose");


module.exports = new mongoose.Schema({
    _evaluatorName: {type: String},
    _targetUsername: {type: String, required: true},
    _created: {type: Date, default: Date.now, required: true},
    _rating: {type: Number, min: 1, max: 5,required: true},
    _message:{type: String}
});
