const express = require('express');
const router = express.Router();
const Macro = require('../models/Macro');

// Create macro
router.post('/', async (req, res) => {
  try {
    const macro = new Macro(req.body);
    await macro.save();
    res.status(201).json(macro);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all macros
router.get('/', async (req, res) => {
  const macros = await Macro.find();
  res.json(macros);
});

module.exports = router;
