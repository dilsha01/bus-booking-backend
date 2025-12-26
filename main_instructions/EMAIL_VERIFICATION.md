# Email Verification System

## Overview
The application now requires email verification before users can log in. This adds an extra layer of security and ensures valid email addresses.

## How It Works

### Registration Flow:
1. User fills out signup form
2. Server creates user account (unverified)
3. Verification email sent to user's email address
4. User receives email with verification link
5. User clicks link → redirected to verification page
6. Account verified → auto-login → redirected to home

### Login Flow:
- ✅ Verified users: Login normally
- ❌ Unverified users: See error message prompting email verification

## Backend Changes

### 1. Updated User Model
Added new fields to track verification status:
- `isVerified` (Boolean, default: false)
- `verificationToken` (String, stores unique token)
- `verificationTokenExpiry` (Date, expires in 24 hours)

### 2. Email Service (`emailService.js`)
- **sendVerificationEmail**: Sends styled HTML email with verification link
- **sendWelcomeEmail**: Sends welcome email after successful verification  
- **generateVerificationToken**: Creates secure random tokens

### 3. New API Endpoints
- `POST /api/auth/register` - Creates user and sends verification email
- `GET /api/auth/verify-email?token=xxx` - Verifies email and auto-logs in user
- `POST /api/auth/resend-verification` - Resends verification email

### 4. Updated Login Endpoint
- Now checks `isVerified` status before allowing login
- Returns 403 error with `requiresVerification: true` flag for unverified users

## Frontend Changes

### 1. New Pages
- **VerifyEmail.tsx**: Handles email verification process
  - Shows loading spinner while verifying
  - Success state: Shows checkmark, auto-login, redirect
  - Error state: Shows error message with retry options

### 2. Updated Signup Page
- No longer auto-logs in after registration
- Shows success message with email verification instructions
- Displays user's email address for confirmation

### 3. Updated Login Page
- Detects unverified user errors
- Shows additional help text for unverified accounts

### 4. New Route
- `/verify-email` - Email verification page

## Email Configuration

### Development Setup
The system uses **Ethereal Email** (fake SMTP) for development testing.

**Option 1: Test with Ethereal (Default)**
No configuration needed! Emails won't actually send but you can view them in logs.

**Option 2: Use Gmail for Real Emails**
Add to your `.env` file:
```env
NODE_ENV=production
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FRONTEND_URL=http://localhost:5173
```

**Getting Gmail App Password:**
1. Enable 2-Factor Authentication on your Google account
2. Go to https://myaccount.google.com/apppasswords
3. Generate app password for "Mail"
4. Use that password in EMAIL_PASS

### Production Setup
For production, use professional email services:
- **SendGrid** (recommended)
- **AWS SES**
- **Mailgun**
- **Postmark**

## Testing

### Test Accounts (Pre-Verified)
These accounts bypass email verification for easy testing:
- Customer: `customer@test.com` / `customer123`
- Admin: `admin@test.com` / `admin123`

### Test New User Registration
1. Go to http://localhost:5173/signup
2. Fill in the form with a NEW email address
3. Click "Sign Up"
4. You'll see: "Registration Successful! Check your email..."

**Development Mode:**
- Check server console for email preview URL
- The URL looks like: `Preview URL: https://ethereal.email/message/xxx`
- Open that URL to see the verification email
- Click the verification link in the email

**Production Mode:**
- Check your actual email inbox
- Click the verification link
- You'll be redirected and auto-logged in

### Test Login with Unverified Account
1. Try to login with unverified account
2. You'll see: "Please verify your email before logging in"

## Email Templates

### Verification Email
- Professional RideWay branding
- Clear call-to-action button
- Backup link (in case button doesn't work)
- 24-hour expiry notice
- Mobile-responsive HTML

### Welcome Email
- Sent after successful verification
- Lists key features
- Call-to-action to start booking

## Security Features

1. **Secure Tokens**
   - 32-byte random tokens (crypto.randomBytes)
   - Stored hashed in database
   - Single-use only

2. **Token Expiry**
   - Verification links expire after 24 hours
   - Old tokens automatically invalidated

3. **Email Validation**
   - Email format validated by Sequelize
   - Duplicate email addresses prevented
   - Case-insensitive email lookup

4. **Auto-Login After Verification**
   - JWT token generated after successful verification
   - No need to login again after verifying

## Troubleshooting

### "Failed to send verification email"
- Check EMAIL_USER and EMAIL_PASS in .env
- For Gmail: Ensure app password is correct
- For Gmail: Ensure 2FA is enabled
- Check server logs for detailed error

### "Verification token has expired"
- Token expired after 24 hours
- User needs to register again OR
- Implement resend verification feature (TODO)

### "Email is already verified"
- User already verified, can login normally
- Redirect to login page

### Email not received
1. Check spam/junk folder
2. Verify email address was entered correctly
3. Check server logs for email sending errors
4. In development: Check console for Ethereal preview URL

## Future Enhancements

- [ ] Resend verification email from UI
- [ ] Custom email templates with branding
- [ ] Email verification reminder after 24 hours
- [ ] Admin panel to manually verify users
- [ ] Email change verification
- [ ] SMS verification option
- [ ] Social login (Google, Facebook)

## Environment Variables

```env
# Required for email sending
NODE_ENV=development
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FRONTEND_URL=http://localhost:5173

# Optional (for custom SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
```

## API Examples

### Register (creates user + sends email)
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

Response:
```json
{
  "success": true,
  "message": "Registration successful! Please check your email to verify your account.",
  "data": {
    "email": "test@example.com",
    "name": "Test User"
  }
}
```

### Verify Email
```bash
curl -X GET "http://localhost:4000/api/auth/verify-email?token=abc123xyz..."
```

Response:
```json
{
  "success": true,
  "message": "Email verified successfully!",
  "data": {
    "token": "jwt-token-here",
    "user": {
      "id": 1,
      "name": "Test User",
      "email": "test@example.com",
      "role": "customer"
    }
  }
}
```

### Login (requires verified email)
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Error for unverified:
```json
{
  "success": false,
  "message": "Please verify your email before logging in",
  "requiresVerification": true
}
```
