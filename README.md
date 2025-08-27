# Quiz Platform - MERN Stack Application

A comprehensive quiz platform built with the MERN stack (MongoDB, Express.js, React.js, Node.js) that allows users to create, take quizzes, and track their performance.

## Features

### User Features
- **User Authentication**: Register, login, and profile management
- **Quiz Taking**: Take quizzes with multiple choice questions
- **Score Tracking**: View detailed scores and performance analytics
- **Personal Dashboard**: Track progress and view statistics
- **Quiz History**: View all attempted quizzes and scores

### Creator Features
- **Quiz Creation**: Create custom quizzes with multiple questions
- **Quiz Management**: Edit and delete your created quizzes
- **Performance Analytics**: View how your quizzes perform

### Admin Features
- **User Management**: View and manage all users
- **Quiz Oversight**: Monitor all quizzes and their performance
- **System Statistics**: View platform-wide analytics

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **React Hook Form** - Form management

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd quiz_app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/quiz-platform
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   ```

4. **Start the server**
   ```bash
   npm run server
   ```

### Frontend Setup

1. **Navigate to client directory**
   ```bash
   cd client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

### Running Both (Development)
From the root directory:
```bash
npm run dev
```

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

## Database Schema

### User Model
- Basic info (username, email, password)
- Profile data (firstName, lastName, bio, avatar)
- Statistics (quizzes taken, scores, etc.)
- Role-based access control

### Quiz Model
- Quiz metadata (title, description, category)
- Questions with multiple choice options
- Scoring and timing configuration
- Creator and visibility settings

### Score Model
- User performance tracking
- Detailed answer analysis
- Time tracking and statistics

## Project Structure

```
quiz_app/
├── models/          # Database models
├── routes/          # API routes
├── middleware/      # Custom middleware
├── client/          # React frontend
├── server.js        # Express server
├── package.json     # Dependencies
└── README.md        # Documentation
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.

