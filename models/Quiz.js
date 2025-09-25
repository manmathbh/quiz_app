const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },
  options: [{
    type: String,
    required: true,
    trim: true
  }],
  correctAnswer: {
    type: Number,
    required: true,
    min: 0
  },
  explanation: {
    type: String,
    trim: true
  },
  points: {
    type: Number,
    default: 1
  }
});

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  questions: [questionSchema],
  timeLimit: {
    type: Number, // in minutes
    default: 30,
    min: 1,
    max: 180
  },
  passingScore: {
    type: Number,
    default: 70, // percentage
    min: 0,
    max: 100
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  stats: {
    totalAttempts: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    totalScores: { type: Number, default: 0 }
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

quizSchema.virtual('totalPoints').get(function() {
  return this.questions.reduce((total, question) => total + question.points, 0);
});

quizSchema.methods.updateStats = function(score) {
  this.stats.totalAttempts += 1;
  this.stats.totalScores += score;
  this.stats.averageScore = this.stats.totalScores / this.stats.totalAttempts;
  return this.save();
};

quizSchema.methods.getQuizForTaking = function() {
  const quizObj = this.toObject();
  quizObj.questions = quizObj.questions.map(q => ({
    question: q.question,
    options: q.options,
    points: q.points
  }));
  return quizObj;
};

module.exports = mongoose.model('Quiz', quizSchema);

