const mongoose = require("mongoose");

module.exports = new mongoose.Schema({
  _name: { type: String, required: true },
});
