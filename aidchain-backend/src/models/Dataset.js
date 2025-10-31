const mongoose = require('mongoose');

const datasetSchema = new mongoose.Schema({
  datasetName: { type: String, required: true },
  description: String,
  access: { type: Boolean, default: true },
  price: { type: Number, default: 0 },
  filePath: String,
  sizeFile: String,
  downloads: { type: Number, default: 0 },
  ownerUsername: String,
});

module.exports = mongoose.model('Dataset', datasetSchema);
