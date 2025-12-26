# Gmail Setup for Sending Verification Emails

## Step 1: Enable 2-Factor Authentication

1. Go to your Google Account: https://myaccount.google.com/
2. Click on **Security** in the left menu
3. Under "How you sign in to Google", click **2-Step Verification**
4. Follow the steps to enable 2FA if not already enabled

## Step 2: Generate App Password

1. After enabling 2FA, go back to Security settings
2. Under "How you sign in to Google", click **2-Step Verification**
3. Scroll down and click **App passwords**
4. You might need to sign in again
5. In the "Select app" dropdown, choose **Mail**
6. In the "Select device" dropdown, choose **Other (Custom name)**
7. Enter "RideWay Backend" as the name
8. Click **Generate**
9. **IMPORTANT**: Copy the 16-character password that appears (it looks like: `xxxx xxxx xxxx xxxx`)

## Step 3: Configure Your .env File

Open `bus-booking-backend/.env` and update these lines:

```env
EMAIL_USER=your-actual-email@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx
```

**Example:**
```env
EMAIL_USER=dilshamihiranga57@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
```

⚠️ **IMPORTANT**: 
- Use your actual Gmail address for `EMAIL_USER`
- Use the 16-character App Password (with or without spaces) for `EMAIL_PASS`
- Keep these credentials secret! Never commit them to GitHub

## Step 4: Restart Backend Server

After updating the .env file, restart your backend:

```bash
# Stop current server (Ctrl+C in terminal)
cd E:\Bus_Booking\bus-booking-backend
node src/server.js
```

## Step 5: Test Email Sending

1. Go to http://localhost:5173/signup
2. Register with a real email address
3. Check your email inbox (and spam folder)
4. You should receive a verification email from RideWay

## Troubleshooting

### "Invalid login" or "Username and Password not accepted"
- Make sure you're using an **App Password**, not your regular Gmail password
- Verify 2FA is enabled on your Google account
- Try generating a new App Password

### Email not received
- Check your spam/junk folder
- Verify the EMAIL_USER in .env is correct
- Check backend console for error messages
- Make sure the recipient email is valid

### "Less secure app access" error
- This is outdated - you need to use App Passwords with 2FA instead
- Google discontinued "less secure app access" in May 2022

## Alternative: Using Your Own Email

If you don't want to use your personal Gmail:

1. Create a new Gmail account specifically for RideWay
2. Follow the same steps above
3. Use this dedicated email for the app

## Security Best Practices

✅ **DO:**
- Use App Passwords (never your actual Gmail password)
- Keep .env file private (already in .gitignore)
- Use a dedicated email for the app if possible
- Regenerate App Password if compromised

❌ **DON'T:**
- Commit .env file to GitHub
- Share your App Password
- Use your main personal email password
- Disable 2FA to avoid App Passwords

## Quick Setup Checklist

- [ ] Enable 2-Factor Authentication on Gmail
- [ ] Generate App Password from Google Account settings
- [ ] Copy the 16-character App Password
- [ ] Update EMAIL_USER in .env
- [ ] Update EMAIL_PASS in .env
- [ ] Restart backend server
- [ ] Test by signing up with a real email
- [ ] Check email inbox (and spam)

---

Once configured, the system will:
- ✅ Send real verification emails
- ✅ Include working verification links
- ✅ Send welcome emails after verification
- ✅ Show detailed logs in console
