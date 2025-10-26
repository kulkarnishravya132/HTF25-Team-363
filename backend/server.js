const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');
require('dotenv').config(); // Loads .env variables

// Import your models and services
const Macro = require('./models/Macro');
const ScheduledJob = require('./models/ScheduledJob');
const { parseCommand } = require('./services/aiService');

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors()); // Allows frontend to call you
app.use(express.json()); // Parses incoming JSON

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

// =============================================
//  HELPER FUNCTION (The Executor)
// =============================================
async function executeMacro(command) {
  console.log(`EXECUTING: ${command}`);
  
  // 1. Parse the command with AI
  const task = await parseCommand(command);
  console.log('AI Task:', task);

  // 2. Run the correct action
  switch (task.action) {
    case 'send_email':
      console.log(`Pretending to send email to ${task.parameters.to} with subject ${task.parameters.subject}`);
      // TODO: Add your real email logic here (e.g., using SendGrid)
      break;
    case 'post_to_social':
      console.log(`Pretending to post '${task.parameters.content}' to ${task.parameters.platform}`);
      // TODO: Add your real Twitter/LinkedIn API logic here
      break;
    default:
      console.log(`Unknown action: ${task.action}`);
  }
}

// =============================================
//  API ENDPOINTS (from your UI)
// =============================================

// 1. GET /api/macros (For the "Choose a Macro Template" dropdown)
app.get('/api/macros', async (req, res) => {
  try {
    const macros = await Macro.find({}, 'name'); // Only send name and id
    res.json(macros);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. POST /api/macros (For the "Save Macro" button)
app.post('/api/macros', async (req, res) => {
  const { name, description, command } = req.body;
  
  const newMacro = new Macro({
    name,
    description,
    command
  });

  try {
    const savedMacro = await newMacro.save();
    res.status(201).json(savedMacro);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 3. POST /api/execute (For the "Run Macro" button)
app.post('/api/execute', (req, res) => {
  const { command } = req.body;
  
  if (!command) {
    return res.status(400).json({ message: 'Command text is required' });
  }
  
  // Don't make the user wait. Acknowledge and run in background.
  executeMacro(command);
  
  res.json({ status: 'processing', message: `Your macro is being executed.` });
});

// 4. POST /api/schedule (For the "Schedule" button)
app.post('/api/schedule', async (req, res) => {
  const { command, runAt } = req.body; // Expecting runAt as an ISO String, e.g., "2025-10-26T11:10:00"

  const newJob = new ScheduledJob({
    command,
    runAt: new Date(runAt)
  });

  try {
    await newJob.save();
    res.json({ status: 'scheduled', message: `Macro scheduled for ${runAt}` });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// =============================================
//  THE SCHEDULER
// =============================================
// This cron job runs every minute to check for jobs
cron.schedule('* * * * *', async () => {
  console.log('Checking for scheduled jobs...');
  
  const now = new Date();
  
  // Find jobs that are due and still pending
  const jobsToRun = await ScheduledJob.find({
    runAt: { $lte: now },
    status: 'pending'
  });

  for (const job of jobsToRun) {
    // 1. Mark as 'running' to prevent double-runs
    job.status = 'running';
    await job.save();

    // 2. Execute the job
    await executeMacro(job.command);

    // 3. Mark as 'completed'
    job.status = 'completed';
    await job.save();
  }
});

// --- Start the server ---
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});