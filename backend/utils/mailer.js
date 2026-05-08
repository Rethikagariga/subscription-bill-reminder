const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.log('❌ Email connection failed:', error.message);
  } else {
    console.log('✅ Email server ready to send reminders!');
  }
});

// -------- REMINDER EMAIL WITH PAY NOW --------
const sendMail = (toEmail, serviceName, daysLeft, amount) => {
  const mailOptions = {
    from: `"BillTracker App" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `⏰ Reminder: ${serviceName} due in ${daysLeft} days`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 550px; margin: 0 auto; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1a237e, #3949ab); padding: 35px 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">💳 BillTracker</h1>
          <p style="color: #9fa8da; margin: 8px 0 0; font-size: 15px;">Payment Reminder</p>
        </div>

        <!-- Alert Banner -->
        <div style="background: ${daysLeft <= 1 ? '#c62828' : daysLeft <= 3 ? '#e65100' : '#1a237e'}; padding: 12px; text-align: center;">
          <p style="color: white; margin: 0; font-size: 14px; font-weight: bold;">
            ${daysLeft === 0 ? '🚨 DUE TODAY!' : daysLeft === 1 ? '⚠️ DUE TOMORROW!' : `⏰ Due in ${daysLeft} days`}
          </p>
        </div>

        <!-- Body -->
        <div style="background: white; padding: 35px 30px;">
          <p style="color: #333; font-size: 16px; margin-top: 0;">Hello,</p>
          <p style="color: #555; font-size: 15px; line-height: 1.6;">
            Your <strong style="color: #1a237e;">${serviceName}</strong> bill is coming up soon. 
            Please make your payment on time to avoid any service interruption!
          </p>

          <!-- Bill Details Box -->
          <div style="background: #f5f7ff; border-radius: 12px; padding: 20px; margin: 25px 0;">
            <h3 style="color: #1a237e; margin: 0 0 15px; font-size: 16px;">📋 Bill Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #e8eaf6;">
                <td style="padding: 10px 0; color: #666;">Service</td>
                <td style="padding: 10px 0; color: #1a237e; font-weight: bold; text-align: right;">${serviceName}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e8eaf6;">
                <td style="padding: 10px 0; color: #666;">Amount Due</td>
                <td style="padding: 10px 0; color: #1a237e; font-weight: bold; text-align: right; font-size: 18px;">₹${amount}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #666;">Due In</td>
                <td style="padding: 10px 0; font-weight: bold; text-align: right; color: ${daysLeft <= 1 ? '#c62828' : '#2e7d32'};">
                  ${daysLeft === 0 ? 'TODAY!' : daysLeft === 1 ? 'TOMORROW!' : `${daysLeft} days`}
                </td>
              </tr>
            </table>
          </div>

          <!-- PAY NOW Button -->
          <div style="text-align: center; margin: 30px 0 20px;">
            <a href="http://localhost:3000/subscriptions" 
               style="background: linear-gradient(135deg, #1a237e, #3949ab); 
                      color: white; padding: 16px 50px; 
                      border-radius: 50px; text-decoration: none; 
                      font-size: 18px; font-weight: bold;
                      box-shadow: 0 4px 15px rgba(26,35,126,0.4);
                      display: inline-block;">
              💳 PAY NOW
            </a>
          </div>

          <!-- Payment Options -->
          <div style="margin: 25px 0;">
            <p style="color: #666; font-size: 14px; text-align: center; margin-bottom: 15px;">
              Choose your preferred payment method:
            </p>
            <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
              
              <!-- UPI -->
              <a href="upi://pay?pa=yourUPI@okaxis&pn=BillTracker&am=${amount}&cu=INR&tn=${serviceName} Bill" 
                 style="background: #f5f7ff; border: 2px solid #e8eaf6; 
                        padding: 12px 20px; border-radius: 10px; 
                        text-decoration: none; color: #1a237e;
                        font-size: 14px; font-weight: bold;
                        display: inline-block; margin: 5px;">
                📱 Pay via UPI
              </a>

              <!-- Google Pay -->
              <a href="https://pay.google.com" 
                 style="background: #f5f7ff; border: 2px solid #e8eaf6; 
                        padding: 12px 20px; border-radius: 10px; 
                        text-decoration: none; color: #1a237e;
                        font-size: 14px; font-weight: bold;
                        display: inline-block; margin: 5px;">
                🟡 Google Pay
              </a>

              <!-- PhonePe -->
              <a href="https://www.phonepe.com" 
                 style="background: #f5f7ff; border: 2px solid #e8eaf6; 
                        padding: 12px 20px; border-radius: 10px; 
                        text-decoration: none; color: #1a237e;
                        font-size: 14px; font-weight: bold;
                        display: inline-block; margin: 5px;">
                💜 PhonePe
              </a>

              <!-- Paytm -->
              <a href="https://paytm.com" 
                 style="background: #f5f7ff; border: 2px solid #e8eaf6; 
                        padding: 12px 20px; border-radius: 10px; 
                        text-decoration: none; color: #1a237e;
                        font-size: 14px; font-weight: bold;
                        display: inline-block; margin: 5px;">
                🔵 Paytm
              </a>

              <!-- Net Banking -->
              <a href="https://www.onlinesbi.sbi" 
                 style="background: #f5f7ff; border: 2px solid #e8eaf6; 
                        padding: 12px 20px; border-radius: 10px; 
                        text-decoration: none; color: #1a237e;
                        font-size: 14px; font-weight: bold;
                        display: inline-block; margin: 5px;">
                🏦 Net Banking
              </a>

            </div>
          </div>

          <p style="color: #999; font-size: 13px; text-align: center; margin-top: 20px;">
            If you have already paid, please ignore this reminder.
          </p>
        </div>

        <!-- Footer -->
        <div style="background: #f5f5f5; padding: 20px; text-align: center;">
          <p style="color: #999; font-size: 12px; margin: 0;">
            This is an automated reminder from BillTracker App 💳
          </p>
          <p style="color: #bbb; font-size: 11px; margin: 6px 0 0;">
            You received this because you registered on BillTracker
          </p>
        </div>

      </div>
    `
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log('❌ Email error:', err.message);
    } else {
      console.log(`✅ Reminder email sent to ${toEmail} for ${serviceName}`);
    }
  });
};

// -------- OVERDUE EMAIL --------
const sendOverdueMail = (toEmail, serviceName, daysOverdue, amount) => {
  const mailOptions = {
    from: `"BillTracker App" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `🚨 OVERDUE: ${serviceName} payment is ${daysOverdue} days late!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 550px; margin: 0 auto; border-radius: 16px; overflow: hidden;">
        <div style="background: #c62828; padding: 35px 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">🚨 Payment Overdue!</h1>
          <p style="color: #ffcdd2; margin: 8px 0 0;">BillTracker App</p>
        </div>
        <div style="background: white; padding: 35px 30px;">
          <p style="color: #333; font-size: 16px;">Your <strong>${serviceName}</strong> payment is <strong style="color: #c62828;">${daysOverdue} days overdue!</strong></p>
          <div style="background: #ffebee; border-radius: 12px; padding: 20px; margin: 20px 0;">
            <table style="width: 100%;">
              <tr><td style="color: #666; padding: 8px 0;">Service</td><td style="color: #c62828; font-weight: bold; text-align: right;">${serviceName}</td></tr>
              <tr><td style="color: #666; padding: 8px 0;">Amount</td><td style="color: #c62828; font-weight: bold; text-align: right;">₹${amount}</td></tr>
              <tr><td style="color: #666; padding: 8px 0;">Days Overdue</td><td style="color: #c62828; font-weight: bold; text-align: right;">${daysOverdue} days</td></tr>
            </table>
          </div>
          <div style="text-align: center; margin: 25px 0;">
            <a href="http://localhost:3000/subscriptions" 
               style="background: #c62828; color: white; padding: 16px 50px; 
                      border-radius: 50px; text-decoration: none; 
                      font-size: 18px; font-weight: bold; display: inline-block;">
              🚨 PAY NOW IMMEDIATELY
            </a>
          </div>
          <div style="text-align: center;">
            <a href="upi://pay?pa=yourUPI@okaxis&pn=BillTracker&am=${amount}&cu=INR" style="background: #ffebee; border: 2px solid #ffcdd2; padding: 10px 18px; border-radius: 10px; text-decoration: none; color: #c62828; font-size: 13px; font-weight: bold; display: inline-block; margin: 5px;">📱 UPI</a>
            <a href="https://pay.google.com" style="background: #ffebee; border: 2px solid #ffcdd2; padding: 10px 18px; border-radius: 10px; text-decoration: none; color: #c62828; font-size: 13px; font-weight: bold; display: inline-block; margin: 5px;">🟡 GPay</a>
            <a href="https://www.phonepe.com" style="background: #ffebee; border: 2px solid #ffcdd2; padding: 10px 18px; border-radius: 10px; text-decoration: none; color: #c62828; font-size: 13px; font-weight: bold; display: inline-block; margin: 5px;">💜 PhonePe</a>
            <a href="https://paytm.com" style="background: #ffebee; border: 2px solid #ffcdd2; padding: 10px 18px; border-radius: 10px; text-decoration: none; color: #c62828; font-size: 13px; font-weight: bold; display: inline-block; margin: 5px;">🔵 Paytm</a>
          </div>
        </div>
        <div style="background: #f5f5f5; padding: 16px; text-align: center;">
          <p style="color: #999; font-size: 12px; margin: 0;">Automated reminder from BillTracker App 💳</p>
        </div>
      </div>
    `
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log('❌ Overdue email error:', err.message);
    } else {
      console.log(`✅ Overdue email sent to ${toEmail}`);
    }
  });
};

module.exports = { sendMail, sendOverdueMail };