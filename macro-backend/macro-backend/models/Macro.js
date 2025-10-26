const mongoose = require('mongoose');

const MacroSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true }, // e.g., 'email', 'link'
  payload: { type: Object, required: true }, // e.g., { to, subject, body }
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Macro', MacroSchema);
