const mongoose = require('mongoose');

const macroSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  command: { type: String, required: true }
});

module.exports = mongoose.model('Macro', macroSchema);