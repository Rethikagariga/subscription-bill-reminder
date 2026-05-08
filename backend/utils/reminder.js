const cron = require('node-cron');
const Subscription = require('../models/Subscription');
const User = require('../models/User');
const { sendMail, sendOverdueMail } = require('./mailer');

// Runs every day at 8:00 AM automatically
cron.schedule('0 8 * * *', async () => {
  console.log('⏰ Running daily reminder check for ALL users...');

  try {
    const today = new Date();
    const subs = await Subscription.find({ isActive: true });
    console.log(`📋 Checking ${subs.length} subscriptions...`);

    for (const sub of subs) {
      const daysLeft = Math.ceil(
        (new Date(sub.dueDate) - today) / (1000 * 60 * 60 * 24)
      );

      // Send reminder if due within reminder days
      if (daysLeft >= 0 && daysLeft <= parseInt(sub.reminderDays)) {
        const user = await User.findById(sub.userId);
        if (user) {
          console.log(`📧 Sending reminder to ${user.email} for ${sub.name}`);
          sendMail(user.email, sub.name, daysLeft, sub.amount);
        }
      }

      // Send overdue notice if bill is past due date
      if (daysLeft < 0) {
        const user = await User.findById(sub.userId);
        if (user) {
          console.log(`🚨 Sending overdue to ${user.email} for ${sub.name}`);
          sendOverdueMail(user.email, sub.name, Math.abs(daysLeft), sub.amount);
        }
      }
    }

    console.log('✅ Daily reminder check complete!');
  } catch (err) {
    console.log('❌ Reminder error:', err);
  }
});