# Testing Authentication

## Quick Test Steps

### 1. Test Signup (New User)
1. Navigate to http://localhost:5173/signup
2. Fill in the form:
   - Full Name: Test User
   - Email: test@example.com
   - Password: test123
   - Confirm Password: test123
3. Click "Sign Up"
4. You should be automatically logged in and redirected to home page

### 2. Test Login (Existing Users)

**Option A - Customer Account:**
- Email: `customer@test.com`
- Password: `customer123`
- Should redirect to home page (/)

**Option B - Admin Account:**
- Email: `admin@test.com`
- Password: `admin123`
- Should redirect to admin dashboard (/admin)

### 3. Verify Token Storage
After successful login/signup, check browser console:
```javascript
localStorage.getItem('authToken')
localStorage.getItem('user')
```

### 4. Test Protected Routes
Try accessing:
- http://localhost:5173/admin (should work if logged in as admin)
- Should be redirected to login if not authenticated

## Expected Behavior

### Signup Success:
- ✅ User account created in database
- ✅ JWT token generated and stored
- ✅ User data stored in localStorage
- ✅ Automatic redirect to home page
- ✅ Navbar shows logged-in state (if implemented)

### Login Success:
- ✅ Credentials validated against database
- ✅ JWT token generated and stored
- ✅ User data stored in localStorage
- ✅ Redirect based on role (admin/customer)

### Error Cases to Test:

**Signup Errors:**
- ❌ Empty fields → "Please fill in all fields"
- ❌ Password < 6 chars → "Password must be at least 6 characters long"
- ❌ Passwords don't match → "Passwords do not match"
- ❌ Email already exists → "User with this email already exists"

**Login Errors:**
- ❌ Wrong password → "Invalid email or password"
- ❌ Non-existent email → "Invalid email or password"
- ❌ Empty fields → "Email and password are required"

## Backend Server Status

Backend should be running on: http://localhost:4000

Test endpoints manually:
```bash
# Test Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"admin123"}'

# Test Register  
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"New User","email":"new@test.com","password":"password123"}'

# Test Get Me (requires token)
curl -X GET http://localhost:4000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Troubleshooting

**"Cannot connect to server"**
- Make sure backend is running: `cd bus-booking-backend && node src/server.js`
- Check if port 4000 is available
- Verify .env file exists with correct database credentials

**"User already exists"**
- Try a different email address
- Or reset database: `cd bus-booking-backend && node src/resetDb.js`

**"Invalid email or password"**
- Double-check credentials are correct
- Verify users exist in database
- Try resetting database if users were created before password hashing was implemented

**Frontend won't start (Node version error)**
- Vite requires Node.js 20.19+ or 22.12+
- Upgrade Node.js or use nvm to switch versions
