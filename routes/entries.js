const express = require('express');
const JournalEntry = require('../models/JournalEntry');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all entries for a user
router.get('/', auth, async (req, res) => {
  try {
    const entries = await JournalEntry.find({ user: req.user.userId })
      .sort({ createdAt: -1 });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new entry
router.post('/', auth, async (req, res) => {
  try {
    const { content, prompt } = req.body;
    const entry = new JournalEntry({
      content,
      prompt,
      user: req.user.userId
    });
    await entry.save();
    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
