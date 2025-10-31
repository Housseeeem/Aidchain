const mongoose = require('mongoose');

const datasetRequestSchema = new mongoose.Schema({
  datasetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dataset', required: true },
  username: { type: String, required: true },
  approved: { type: Boolean, default: false },
});

module.exports = mongoose.model('DatasetRequest', datasetRequestSchema);
