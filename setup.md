# Quiz Platform Setup Guide

## Prerequisites

Before setting up the Quiz Platform, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)

## Quick Setup

### 1. Install Backend Dependencies

```bash
npm install
```

### 2. Install Frontend Dependencies

```bash
cd client
npm install
cd ..
```

### 3. Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/quiz-platform
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### 4. Start MongoDB

Make sure MongoDB is running on your system:

**Local MongoDB:**
```bash
# Start MongoDB service
mongod
```

**MongoDB Atlas:**
- Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
- Create a new cluster
- Get your connection string and update the `MONGODB_URI` in your `.env` file

### 5. Start the Application

**Development Mode (Both Frontend and Backend):**
```bash
npm run dev
```

**Backend Only:**
```bash
npm run server
```

**Frontend Only:**
```bash
cd client
npm start
```

## Accessing the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

## Default Admin User

To create an admin user, you can either:

1. **Register normally and update the database:**
   ```javascript
   // In MongoDB shell or MongoDB Compass
   db.users.updateOne(
     { email: "your-email@example.com" },
     { $set: { role: "admin" } }
   )
   ```

2. **Or modify the registration route temporarily to create an admin user**

## Features Implemented

### Backend (Complete)
- ✅ User authentication (register, login, JWT)
- ✅ User management and profiles
- ✅ Quiz CRUD operations
- ✅ Score tracking and analytics
- ✅ Admin routes and middleware
- ✅ Database models and relationships
- ✅ API endpoints for all features

### Frontend (Partially Complete)
- ✅ User authentication pages (login/register)
- ✅ Navigation and layout
- ✅ Home page with features
- ✅ Dashboard with statistics
- ✅ Quiz listing with search/filter
- ✅ Placeholder pages for remaining features
- ✅ Responsive design with Tailwind CSS

### Features to Complete
- Quiz taking interface
- Quiz creation form
- Profile management
- Score history and analytics
- Admin dashboard functionality
- Quiz detail pages

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/user` - Get current user
- `PUT /api/auth/profile` - Update profile

### Quizzes
- `GET /api/quiz` - Get all public quizzes
- `GET /api/quiz/:id` - Get specific quiz
- `POST /api/quiz` - Create new quiz
- `PUT /api/quiz/:id` - Update quiz
- `DELETE /api/quiz/:id` - Delete quiz
- `POST /api/quiz/:id/submit` - Submit quiz answers
- `GET /api/quiz/:id/leaderboard` - Get quiz leaderboard

### Scores
- `GET /api/score/history` - Get user's quiz history
- `GET /api/score/:quizId` - Get specific quiz score
- `GET /api/score/stats/overview` - Get user statistics
- `GET /api/score/stats/category/:category` - Get category statistics

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/user/quizzes` - Get user's created quizzes
- `GET /api/user/dashboard` - Get user dashboard data

### Admin Routes
- `GET /api/user/admin/users` - Get all users
- `PUT /api/user/admin/users/:id/role` - Update user role
- `GET /api/user/admin/stats` - Get admin statistics

## Project Structure

```
quiz_app/
├── models/          # Database models (User, Quiz, Score)
├── routes/          # API routes (auth, quiz, score, user)
├── middleware/      # Custom middleware (auth, admin)
├── client/          # React frontend
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── contexts/    # React contexts
│   │   └── ...
├── server.js        # Express server
├── package.json     # Backend dependencies
└── README.md        # Documentation
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error:**
   - Ensure MongoDB is running
   - Check your connection string in `.env`
   - Verify network access if using MongoDB Atlas

2. **Port Already in Use:**
   - Change the PORT in `.env` file
   - Kill processes using the default ports

3. **Module Not Found Errors:**
   - Run `npm install` in both root and client directories
   - Clear node_modules and reinstall if needed

4. **CORS Issues:**
   - The backend is configured with CORS for development
   - Check that the frontend is running on the correct port

## Next Steps

1. Complete the quiz taking interface
2. Implement quiz creation form
3. Add profile management features
4. Build score history and analytics
5. Complete admin dashboard
6. Add more advanced features like:
   - Quiz sharing and collaboration
   - Advanced analytics and reporting
   - Mobile responsiveness improvements
   - Real-time features
   - Email notifications

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Check the console for error messages
4. Verify all dependencies are installed correctly

