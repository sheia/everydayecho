const mongoose = require('mongoose');

const journalEntrySchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  prompt: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('JournalEntry', journalEntrySchema);
