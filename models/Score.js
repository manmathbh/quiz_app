const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 0
  },
  totalPoints: {
    type: Number,
    required: true,
    min: 0
  },
  percentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  passed: {
    type: Boolean,
    required: true
  },
  timeTaken: {
    type: Number, // in seconds
    required: true,
    min: 0
  },
  answers: [{
    questionIndex: {
      type: Number,
      required: true
    },
    selectedAnswer: {
      type: Number,
      required: true
    },
    isCorrect: {
      type: Boolean,
      required: true
    },
    pointsEarned: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  completedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
scoreSchema.index({ user: 1, quiz: 1 });
scoreSchema.index({ user: 1, completedAt: -1 });
scoreSchema.index({ quiz: 1, score: -1 });

// Calculate percentage and passed status
scoreSchema.pre('save', function(next) {
  if (this.score !== undefined && this.totalPoints !== undefined) {
    this.percentage = Math.round((this.score / this.totalPoints) * 100);
    this.passed = this.percentage >= 70; // Default passing score
  }
  next();
});

// Get user's best score for a quiz
scoreSchema.statics.getBestScore = function(userId, quizId) {
  return this.findOne({ user: userId, quiz: quizId })
    .sort({ score: -1 })
    .limit(1);
};

// Get user's quiz history
scoreSchema.statics.getUserHistory = function(userId, limit = 10) {
  return this.find({ user: userId })
    .populate('quiz', 'title category difficulty')
    .sort({ completedAt: -1 })
    .limit(limit);
};

// Get quiz leaderboard
scoreSchema.statics.getLeaderboard = function(quizId, limit = 10) {
  return this.find({ quiz: quizId })
    .populate('user', 'username profile.firstName profile.lastName')
    .sort({ score: -1, timeTaken: 1 })
    .limit(limit);
};

module.exports = mongoose.model('Score', scoreSchema);

