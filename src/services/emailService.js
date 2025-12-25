const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { Resend } = require('resend');

// Email configuration
const EMAIL_USER = process.env.EMAIL_USER || 'your-email@gmail.com';
const EMAIL_PASS = process.env.EMAIL_PASS || 'your-app-password';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM || 'no-reply@rideway.app';

// Debug logging
console.log('📧 Email Service Configuration:');
console.log('   RESEND_API_KEY:', RESEND_API_KEY ? '✅ Set' : '❌ Not Set');
console.log('   EMAIL_FROM:', EMAIL_FROM);
console.log('   NODE_ENV:', process.env.NODE_ENV);

// Resend client (used when RESEND_API_KEY is configured)
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

// Create transporter
const createTransporter = () => {
  // Check if Gmail credentials are configured
  if (EMAIL_USER && EMAIL_PASS && EMAIL_USER !== 'your-email@gmail.com') {
    // Use Gmail with real credentials
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });
  } else {
    // No credentials - return null (will use console logging)
    return null;
  }
};

// Generate verification token
const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Send verification email
const sendVerificationEmail = async (user, token) => {
  const verificationUrl = `${FRONTEND_URL}/verify-email?token=${token}`;
  
  try {
    // Prefer Resend if configured
    if (resend) {
      const result = await resend.emails.send({
        from: EMAIL_FROM,
        to: user.email,
        subject: 'Verify Your RideWay Account',
        html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1a4d7a 0%, #0f3554 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 15px 30px; background: #ff6b35; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚍 Welcome to RideWay!</h1>
            </div>
            <div class="content">
              <h2>Hi ${user.name},</h2>
              <p>Thank you for signing up with RideWay! We're excited to have you on board.</p>
              <p>To complete your registration and start booking bus tickets, please verify your email address by clicking the button below:</p>
              <div style="text-align: center;">
                <a href="${verificationUrl}" class="button">Verify Email Address</a>
              </div>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #666; font-size: 14px;">${verificationUrl}</p>
              <p><strong>This link will expire in 24 hours.</strong></p>
              <p>If you didn't create an account with RideWay, please ignore this email.</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
              <p>Happy travels!<br>The RideWay Team</p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply to this message.</p>
              <p>&copy; ${new Date().getFullYear()} RideWay. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
        text: `
        Welcome to RideWay, ${user.name}!

        Thank you for signing up! To complete your registration, please verify your email address by visiting:
        ${verificationUrl}

        This link will expire in 24 hours.

        If you didn't create an account with RideWay, please ignore this email.

        Happy travels!
        The RideWay Team
      `,
      });

      console.log('✅ Verification email sent via Resend to:', user.email);
      return { success: true, messageId: result?.id || result?.data?.id || 'resend' };
    }

    const transporter = createTransporter();

    // If no transporter (no credentials), just log to console
    if (!transporter) {
      console.log('\n📧 ========================================');
      console.log('   VERIFICATION EMAIL (Development Mode)');
      console.log('   Configure EMAIL_USER and EMAIL_PASS in .env to send real emails');
      console.log('========================================');
      console.log('To:', user.email);
      console.log('Subject: Verify Your RideWay Account');
      console.log('\n🔗 Verification Link:');
      console.log(verificationUrl);
      console.log('========================================\n');
      
      return { success: true, messageId: 'dev-mode-no-email' };
    }
    
    const mailOptions = {
      from: `"RideWay" <${EMAIL_USER}>`,
      to: user.email,
      subject: 'Verify Your RideWay Account',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1a4d7a 0%, #0f3554 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 15px 30px; background: #ff6b35; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚍 Welcome to RideWay!</h1>
            </div>
            <div class="content">
              <h2>Hi ${user.name},</h2>
              <p>Thank you for signing up with RideWay! We're excited to have you on board.</p>
              <p>To complete your registration and start booking bus tickets, please verify your email address by clicking the button below:</p>
              <div style="text-align: center;">
                <a href="${verificationUrl}" class="button">Verify Email Address</a>
              </div>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #666; font-size: 14px;">${verificationUrl}</p>
              <p><strong>This link will expire in 24 hours.</strong></p>
              <p>If you didn't create an account with RideWay, please ignore this email.</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
              <p>Happy travels!<br>The RideWay Team</p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply to this message.</p>
              <p>&copy; ${new Date().getFullYear()} RideWay. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Welcome to RideWay, ${user.name}!
        
        Thank you for signing up! To complete your registration, please verify your email address by visiting:
        ${verificationUrl}
        
        This link will expire in 24 hours.
        
        If you didn't create an account with RideWay, please ignore this email.
        
        Happy travels!
        The RideWay Team
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Verification email sent successfully to:', user.email);
    console.log('   Message ID:', info.messageId);
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Failed to send verification email:', error.message);
    console.error('   Full error:', error);
    if (error.code) console.error('   Error code:', error.code);
    if (error.response) console.error('   SMTP Response:', error.response);
    throw error;
  }
};

// Send welcome email after verification
const sendWelcomeEmail = async (user) => {
  try {
    // Prefer Resend if configured
    if (resend) {
      await resend.emails.send({
        from: EMAIL_FROM,
        to: user.email,
        subject: 'Welcome to RideWay - Email Verified!',
        html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1a4d7a 0%, #0f3554 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 15px 30px; background: #ff6b35; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Email Verified!</h1>
            </div>
            <div class="content">
              <h2>Welcome aboard, ${user.name}!</h2>
              <p>Your email has been successfully verified. You can now enjoy all the benefits of RideWay:</p>
              <ul>
                <li>✓ Search and book bus tickets</li>
                <li>✓ View and manage your bookings</li>
                <li>✓ Track your travel history</li>
                <li>✓ Get exclusive offers</li>
              </ul>
              <div style="text-align: center;">
                <a href="${FRONTEND_URL}" class="button">Start Booking Now</a>
              </div>
              <p>If you have any questions, feel free to contact our support team.</p>
              <p>Happy travels!<br>The RideWay Team</p>
            </div>
          </div>
        </body>
        </html>
      `,
      });

      console.log('✅ Welcome email sent via Resend to:', user.email);
      return;
    }

    const transporter = createTransporter();

    // If no transporter, just log
    if (!transporter) {
      console.log(`\n🎉 Welcome email would be sent to: ${user.email}\n`);
      return;
    }
    
    const mailOptions = {
      from: `"RideWay" <${EMAIL_USER}>`,
      to: user.email,
      subject: 'Welcome to RideWay - Email Verified!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1a4d7a 0%, #0f3554 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 15px 30px; background: #ff6b35; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Email Verified!</h1>
            </div>
            <div class="content">
              <h2>Welcome aboard, ${user.name}!</h2>
              <p>Your email has been successfully verified. You can now enjoy all the benefits of RideWay:</p>
              <ul>
                <li>✓ Search and book bus tickets</li>
                <li>✓ View and manage your bookings</li>
                <li>✓ Track your travel history</li>
                <li>✓ Get exclusive offers</li>
              </ul>
              <div style="text-align: center;">
                <a href="${FRONTEND_URL}" class="button">Start Booking Now</a>
              </div>
              <p>If you have any questions, feel free to contact our support team.</p>
              <p>Happy travels!<br>The RideWay Team</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent successfully to:', user.email);
  } catch (error) {
    console.error('❌ Failed to send welcome email:', error.message);
    // Don't throw - welcome email is not critical
  }
};

module.exports = {
  generateVerificationToken,
  sendVerificationEmail,
  sendWelcomeEmail,
};
