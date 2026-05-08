const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Subscription = require('../models/Subscription');
const User = require('../models/User');
const { sendMail } = require('../utils/mailer');

// -------- GET ALL SUBSCRIPTIONS --------
router.get('/', auth, async (req, res) => {
  try {
    const subs = await Subscription.find({ userId: req.user.id });
    res.json(subs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// -------- ADD NEW SUBSCRIPTION --------
router.post('/', auth, async (req, res) => {
  try {
    const sub = await Subscription.create({
      ...req.body,
      userId: req.user.id
    });

    // Send immediate email if due within reminder days
    const daysLeft = Math.ceil(
      (new Date(sub.dueDate) - new Date()) / (1000 * 60 * 60 * 24)
    );

    if (daysLeft <= sub.reminderDays) {
      const user = await User.findById(req.user.id);
      if (user) {
        console.log(`📧 Sending immediate reminder to ${user.email}`);
        sendMail(user.email, sub.name, daysLeft, sub.amount);
      }
    }

    res.status(201).json(sub);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// -------- UPDATE SUBSCRIPTION --------
router.put('/:id', auth, async (req, res) => {
  try {
    const sub = await Subscription.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(sub);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// -------- DELETE SUBSCRIPTION --------
router.delete('/:id', auth, async (req, res) => {
  try {
    await Subscription.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
