const mongoose = require("mongoose");
const Double = require('@mongoosejs/double');
const Address = require('./addressSchema')
module.exports = new mongoose.Schema({
    _name: {type: String, required: true},
    _description: {type: String, required: true},
    _price: {type: Double, required: true},
    _size: {type: Double, required: true},
    _brand: {type: String, required: true},
    _created: {type: Date, default: Date.now, required: true},
    _condition: {type: String, required: true},
    _ownerName: {type: String, required: true},
    _pickUpAddress: {type: Address,required: true},
});
