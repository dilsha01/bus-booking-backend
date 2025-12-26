# RideWay Authentication

## Login Credentials

The application now has a fully functional authentication system!

### Test Accounts

**Customer Account:**
- Email: `customer@test.com`
- Password: `customer123`
- Role: Customer (can book trips)

**Admin Account:**
- Email: `admin@test.com`
- Password: `admin123`
- Role: Admin (full access to admin dashboard)

## Features

### Authentication System
- ✅ Secure JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Token storage in localStorage
- ✅ Automatic token refresh
- ✅ Protected routes
- ✅ Role-based access control (Customer/Admin)

### Login Page Features
- Email and password validation
- Password visibility toggle
- Error message display
- Loading state during login
- Automatic redirect based on user role:
  - **Admin** → redirects to `/admin` dashboard
  - **Customer** → redirects to `/` home page
- Link to signup page

### Signup Page Features
- Full name, email, and password fields
- Confirm password validation
- Password strength requirement (minimum 6 characters)
- Password visibility toggles
- Real-time error validation
- Loading state during registration
- Automatic login after successful signup
- Link back to login page

### API Endpoints

**Authentication Routes:**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth token)

### Security Features
- Passwords are hashed using bcryptjs (salt rounds: 10)
- JWT tokens expire in 7 days
- Protected admin routes require both authentication and admin role
- 401 responses automatically redirect to login page
- Tokens stored securely in localStorage

## How to Use

1. **Start the Backend Server:**
   ```bash
   cd bus-booking-backend
   node src/server.js
   ```

2. **Start the Frontend:**
   ```bash
   cd bus-booking-frontend
   npm run dev
   ```

3. **Navigate to Login or Signup:**
   - **Login:** Go to `http://localhost:5173/login`
   - **Signup:** Go to `http://localhost:5173/signup`
   - Or click the "Login" or "Sign Up" buttons in the navbar
   - Enter credentials (for login) or fill the registration form (for signup)
   - Click "Login" or "Sign Up"

4. **Reset Database (if needed):**
   ```bash
   cd bus-booking-backend
   node src/resetDb.js
   ```
   This will recreate all tables and seed test users with proper password hashes.

## Environment Variables

Make sure your backend `.env` file includes:
```env
JWT_SECRET=your-secret-key-change-in-production
PORT=4000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=bus_booking
FRONTEND_URL=http://localhost:5173
```

## Next Steps

To enhance the authentication system, consider:
- Email verification
- Password reset functionality
- Refresh token rotation
- Session management
- Two-factor authentication
- OAuth integration (Google, Facebook, etc.)
