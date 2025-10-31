const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { generateToken } = require('../utils/jwt');

const router = express.Router();

// POST /auth/register
router.post('/register', async (req, res) => {
  const { email, password, firstName, lastName, role } = req.body;
  
  try {
    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      email,
      passwordHash,
      firstName,
      lastName,
      role: role || 'researcher', // default to researcher
    });

    await newUser.save();

    const token = generateToken(newUser);
    res.status(201).json({
      message: 'User registered successfully',
      jwt: token,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      role: newUser.role,
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: 'Invalid password' });

    const token = generateToken(user);
    res.json({
      jwt: token,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
