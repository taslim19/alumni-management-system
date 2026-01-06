const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Announcement title is required'],
    trim: true
  },
  message: {
    type: String,
    required: [true, 'Announcement message is required'],
    maxlength: [2000, 'Message cannot exceed 2000 characters']
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  targetAudience: {
    type: [String],
    enum: ['admin', 'alumni', 'student', 'all'],
    default: ['all']
  },
  isImportant: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Announcement', announcementSchema);

