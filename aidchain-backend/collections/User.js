const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
		maxlength: 255,
	},
	password: {
		type: String,
		required: true,
		maxlength: 255,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
});

// Middleware to update the `updatedAt` field on save
userSchema.pre('save', function (next) {
	this.updatedAt = Date.now();
	next();
});

const User = mongoose.model('User', userSchema);

module.exports = { User }