const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
    maxlength: 255
  },
  originalName: {
    type: String,
    required: true,
    maxlength: 255
  },
  size: {
    type: Number,
    required: true
  },
  mimetype: {
    type: String,
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  encryptedPath: {
    type: String,
    required: true
  },
  isAnonymized: {
    type: Boolean,
    default: false
  },
  anonymizationStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  hederaHash: {
    type: String,
    default: null
  },
  hederaTimestamp: {
    type: String,
    default: null
  },
  hederaTopic: {
    type: String,
    default: null
  },
  fileHash: {
    type: String,
    required: true
  },
  metadata: {
    description: String,
    dataType: String,
    patientCount: Number,
    dateRange: {
      start: Date,
      end: Date
    },
    anonymizationMetrics: {
      entitiesRedacted: [String],
      kValue: Number,
      epsilonValue: Number
    }
  }
}, {
  timestamps: true
});

// Index for faster queries
fileSchema.index({ uploadedBy: 1, createdAt: -1 });
fileSchema.index({ hederaHash: 1 });

module.exports = mongoose.model('File', fileSchema);
