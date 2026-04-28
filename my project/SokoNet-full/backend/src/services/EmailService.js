/**
 * Email Service
 * Sends transactional emails such as OTP verification
 */

const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    const host = process.env.EMAIL_HOST;
    const port = process.env.EMAIL_PORT;
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    this.transporter = host && port && user && pass ? nodemailer.createTransport({
      host,
      port: parseInt(port, 10),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user,
        pass
      }
    }) : null;
  }

  async sendOTPEmail(email, otp) {
    if (!this.transporter) {
      console.warn('EmailService: SMTP credentials not configured, falling back to console output');
      console.log(`OTP for ${email}: ${otp}`);
      return;
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'SokoNet <no-reply@sokonet.com>',
      to: email,
      subject: 'Your SokoNet verification code',
      text: `Your SokoNet verification code is ${otp}. It expires in 5 minutes. Do not share it with anyone.`,
      html: `<p>Your SokoNet verification code is <strong>${otp}</strong>.</p><p>It expires in 5 minutes.</p>`
    };

    await this.transporter.sendMail(mailOptions);
  }
}

module.exports = new EmailService();
