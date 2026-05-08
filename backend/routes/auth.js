const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// -------- REGISTER --------
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Check if email already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash the password
    const hashed = await bcrypt.hash(password, 10);

    // Save new user
    const user = await User.create({ name, email, password: hashed });
    res.status(201).json({ message: 'User created successfully' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// -------- LOGIN --------
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if password is correct
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: 'Wrong password' });
    }

    // Create and send token
    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );

    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email 
      } 
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;