const nodemailer = require('nodemailer');

const config = require('../config/config');
const [user, pass] = Object.values(config.emailCredentials);

// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: { user, pass },
});

/**
 * Sends an email using Gmail
 * @param {Object} mailOptions - Options for sending the email (e.g., from, to, subject, text).
 * @returns {Promise} A promise that resolves when the email is sent successfully, or rejects with an error.
 */
async function sendEmail(mailOptions) {
  try {
    await transporter.sendMail({
      from: user,
      ...mailOptions
    });
    console.log(`Email sent successfully to ${mailOptions.to}`);
    return true;

  } catch (error) {
    console.log(`Error sending email to ${mailOptions.to}`);
    return false;
  }
}

module.exports = sendEmail;
