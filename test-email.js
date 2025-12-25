require('dotenv').config();

async function testEmail() {
  try {
    const nodemailer = require('nodemailer');
    
    console.log('Testing Email Configuration...\n');
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '****' + process.env.EMAIL_PASS.slice(-4) : 'NOT SET');
    console.log('');

    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    console.log('Verifying transporter connection...\n');

    transporter.verify(function (error, success) {
      if (error) {
        console.error('❌ Email Configuration Error:');
        console.error('   Message:', error.message);
        if (error.code) console.error('   Code:', error.code);
        if (error.response) console.error('   Response:', error.response);
        console.error('\n📋 Troubleshooting:');
        console.error('   1. Make sure 2-Factor Authentication is enabled on your Gmail');
        console.error('   2. Generate an App Password at: https://myaccount.google.com/apppasswords');
        console.error('   3. Use the 16-character App Password (spaces optional)');
        console.error('   4. Don\'t use your regular Gmail password');
        process.exit(1);
      } else {
        console.log('✅ Email configuration is valid!');
        console.log('   Server is ready to send emails');
        console.log('\nSending test email...\n');
        
        const mailOptions = {
      from: `"BusGo Test" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to yourself
      subject: 'BusGo Email Test - Success!',
      text: 'This is a test email from BusGo. Your email configuration is working correctly!',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px;">
            <h2 style="color: #1a4d7a;">✅ Email Configuration Successful!</h2>
            <p>Your RideWay email service is working correctly.</p>
            <p>You can now send verification emails to your users.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #666; font-size: 14px;">This is a test email from RideWay backend.</p>
          </div>
        </div>
      `,
        };
        
        transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('❌ Failed to send test email:', error.message);
        process.exit(1);
      } else {
        console.log('✅ Test email sent successfully!');
        console.log('   Message ID:', info.messageId);
        console.log('   Check your inbox:', process.env.EMAIL_USER);
        process.exit(0);
      }
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testEmail();
