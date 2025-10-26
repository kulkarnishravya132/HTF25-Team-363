const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  command: { type: String, required: true },
  runAt: { type: Date, required: true },
  status: { type: String, default: 'pending' } // pending, running, completed
});

module.exports = mongoose.model('ScheduledJob', jobSchema);