import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const sendEmail = async (to, subject, text) => {
  try {
    // Validate environment variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error('Email configuration missing. Please set EMAIL_USER and EMAIL_PASS in .env file');
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Verify connection
    await transporter.verify();

    // Send email
    const info = await transporter.sendMail({
      from: `"IMS Admin" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      text: text,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Inventory Managament System</h2>
          <div style="background: #f9f9f9; padding: 20px; border-radius: 5px;">
            ${text.replace(/\n/g, '<br>')}
          </div>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      `
    });

    console.log("✅ Email sent successfully:", info.messageId);
    return info;

  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    throw new Error(`Email sending failed: ${error.message}`);
  }
};

export default sendEmail;