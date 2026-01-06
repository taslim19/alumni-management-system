const mongoose = require('mongoose');

const alumniProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  graduationYear: {
    type: Number,
    required: [true, 'Graduation year is required'],
    min: [1950, 'Graduation year must be valid'],
    max: [new Date().getFullYear() + 5, 'Graduation year cannot be in the future']
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true
  },
  degree: {
    type: String,
    trim: true
  },
  company: {
    type: String,
    trim: true,
    default: ''
  },
  position: {
    type: String,
    trim: true,
    default: ''
  },
  location: {
    city: {
      type: String,
      trim: true,
      default: ''
    },
    state: {
      type: String,
      trim: true,
      default: ''
    },
    country: {
      type: String,
      trim: true,
      default: ''
    }
  },
  bio: {
    type: String,
    maxlength: [1000, 'Bio cannot exceed 1000 characters'],
    default: ''
  },
  linkedin: {
    type: String,
    default: ''
  },
  github: {
    type: String,
    default: ''
  },
  website: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  privacySettings: {
    showEmail: {
      type: Boolean,
      default: false
    },
    showPhone: {
      type: Boolean,
      default: false
    },
    showLocation: {
      type: Boolean,
      default: true
    }
  },
  skills: [{
    type: String,
    trim: true
  }],
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for search optimization
alumniProfileSchema.index({ graduationYear: 1, department: 1 });
alumniProfileSchema.index({ company: 1 });

module.exports = mongoose.model('AlumniProfile', alumniProfileSchema);

