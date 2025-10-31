const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  firstName: String,
  lastName: String,
  role: { type: String, enum: ['researcher', 'hospital', 'admin'], default: 'researcher' },
});

module.exports = mongoose.model('User', userSchema);
