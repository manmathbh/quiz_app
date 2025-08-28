const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

// Set default JWT_SECRET if not provided
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'your-super-secret-jwt-key-change-this-in-production';
  console.log('Warning: Using default JWT_SECRET. Please set JWT_SECRET in your .env file for production.');
}

const app = express();

// Security middleware
app.use(helmet());

// Define the allowed origin (your Vercel frontend URL)
const corsOptions = {
    origin: 'https://quiz-l8y1a5b5c-manmaths-projects-87186561.vercel.app'
};
app.use(cors(corsOptions));

// Trust proxy for rate limiting
app.set('trust proxy', 1);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection with in-memory fallback for development
let mongoServer = null;

const connectDB = async () => {
  try {
    let mongoURI = process.env.MONGODB_URI;
    
    // Use MongoDB Atlas by default, fallback to in-memory for development
    if (!mongoURI) {
      if (process.env.NODE_ENV !== 'production') {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        mongoServer = await MongoMemoryServer.create();
        mongoURI = mongoServer.getUri();
        console.log('Using in-memory MongoDB for development');
      } else {
        mongoURI = 'mongodb://localhost:27017/quiz-platform';
      }
    } else {
      console.log('Using MongoDB Atlas connection');
    }
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected Successfully');
  } catch (err) {
    console.log('MongoDB Connection Error:', err.message);
    console.log('Please ensure MongoDB is running or update MONGODB_URI in your .env file');
    console.log('You can use MongoDB Atlas (cloud) or install MongoDB locally');
    process.exit(1);
  }
};

connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/quiz', require('./routes/quiz'));
app.use('/api/score', require('./routes/score'));
app.use('/api/user', require('./routes/user'));

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  if (mongoServer) {
    await mongoServer.stop();
    console.log('In-memory MongoDB stopped');
  }
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
