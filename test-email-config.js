require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('Testing Email Configuration...\n');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '****' + process.env.EMAIL_PASS.slice(-4) : 'NOT SET');
console.log('');

const transporter = nodemailer.createTransport({
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
    if (error.command) console.error('   Command:', error.command);
    if (error.responseCode) console.error('   Response Code:', error.responseCode);
    console.error('\n📋 Troubleshooting:');
    console.error('   1. Make sure 2-Factor Authentication is enabled on your Gmail');
    console.error('   2. Generate an App Password at: https://myaccount.google.com/apppasswords');
    console.error('   3. Use the 16-character App Password (with or without spaces)');
    console.error('   4. Don\'t use your regular Gmail password');
    console.error('   5. The App Password should look like: abcd efgh ijkl mnop');
    process.exit(1);
  } else {
    console.log('✅ Email configuration is valid!');
    console.log('   Gmail SMTP connection successful');
    console.log('\n🎉 Your email service is ready to send verification emails!');
    process.exit(0);
  }
});
