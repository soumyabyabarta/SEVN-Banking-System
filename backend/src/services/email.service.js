require('dotenv').config();
const nodemailer = require('nodemailer');
/*
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});
*/

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"SEVN Bank" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

async function sendRegistrationEmail(userEmail,name) {
/*  const subject = 'Welcome to SEVN Bank!';
  const text = `Hi ${name},\n\nThank you for registering with our banking backend service. We're excited to have you on board!\n\nBest regards,\nBanking Backend Team`;
  const html = `<p>Hi ${name},</p><p>Thank you for registering with our banking backend service. We're excited to have you on board!</p><p>Best regards,<br>Banking Backend Team</p>`;
*/

const subject = 'Welcome to SEVN Bank — Banking Like a Finisher';

const text = `Hi ${name},

Welcome to SEVN Bank 

Your account is now ready to play in the financial IPL.

At SEVN, we believe:
• Money should move faster than Dhoni’s stumping 
• Banking should stay cooler than “Captain Cool” 
• And your balance should only go UP 

Your digital vault is officially unlocked 🔓

No long queues.
No “server down”.
No uncle asking for photocopies.

Just smooth banking. 24×7.

“Trust the process. Finish strong.” — probably Thala

Thanks for joining SEVN Bank.

Best regards,
Team SEVN
Banking Like a Finisher`;

const html = `
<div style="font-family: Arial, sans-serif; line-height:1.6; color:#222;">
  <h2 style="color:#111;">Welcome to <span style="color:#6C47FF;">SEVN Bank</span></h2>

  <p>Hi ${name},</p>

  <p>
    Your account is now ready to play in the financial IPL.
  </p>

  <p>At SEVN, we believe:</p>

  <ul>
    <li> Money should move faster than Dhoni’s stumping</li>
    <li> Banking should stay cooler than “Captain Cool”</li>
    <li> Your balance should only go UP</li>
  </ul>

  <p>
    Your digital vault is officially unlocked 🔓
  </p>

  <blockquote style="border-left:4px solid #6C47FF; padding-left:12px; color:#555;">
    “Trust the process. Finish strong.” ~ MS Dhoni
  </blockquote>

  <p>
    No long queues.<br>
    No “server down”.<br>
    No uncle asking for photocopies.
  </p>

  <p>
    Just smooth banking. 24×7.
  </p>

  <br>

  <p>
    Best regards,<br>
    <strong>Team SEVN</strong><br>
    <span style="color:#6C47FF;">Banking Like a Finisher </span>
  </p>
</div>
`;

  await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionEmail(userEmail,name,amount,toAccount) {
  const subject = 'SEVN Bank - Transaction Alert';
  const text = `Hi ${name},\n\nYou have successfully transferred ₹${amount} to account ${toAccount}.\n\nThank you for banking with SEVN Bank!\n\nBest regards,\nTeam SEVN`;
  const html = `<p>Hi ${name},</p><p>You have successfully transferred <strong>₹${amount}</strong> to account <strong>${toAccount}</strong>.</p><p>Thank you for banking with SEVN Bank!</p><p>Best regards,<br>Team SEVN</p>`;
  await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionFailureEmail(userEmail,name,amount,toAccount) {
  const subject = 'SEVN Bank - Transaction Failed';
  const text = `Hi ${name},\n\nWe regret to inform you that your transaction of ₹${amount} to account ${toAccount} has failed. Please check your account balance and try again.\n\nThank you for banking with SEVN Bank!\n\nBest regards,\nTeam SEVN`;
  const html = `<p>Hi ${name},</p><p>We regret to inform you that your transaction of <strong>₹${amount}</strong> to account <strong>${toAccount}</strong> has failed. Please check your account balance and try again.</p><p>Thank you for banking with SEVN Bank!</p><p>Best regards,<br>Team SEVN</p>`;
  await sendEmail(userEmail, subject, text, html);
}


module.exports = {sendRegistrationEmail,
  sendTransactionEmail,
  sendTransactionFailureEmail
};