const express = require('express');
const { check, validationResult } = require('express-validator');
const Quiz = require('../models/Quiz');
const Score = require('../models/Score');
const { auth, admin } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/quiz
// @desc    Get all public quizzes
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, difficulty, search, page = 1, limit = 10 } = req.query;
    
    const query = { isPublic: true, isActive: true };
    
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const quizzes = await Quiz.find(query)
      .populate('creator', 'username profile.firstName profile.lastName')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Quiz.countDocuments(query);

    res.json({
      quizzes,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get quizzes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/quiz/:id
// @desc    Get quiz by ID (without answers for taking)
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('creator', 'username profile.firstName profile.lastName');
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    if (!quiz.isPublic || !quiz.isActive) {
      return res.status(404).json({ message: 'Quiz not available' });
    }

    // Return quiz without correct answers
    const quizForTaking = quiz.getQuizForTaking();
    res.json(quizForTaking);
  } catch (error) {
    console.error('Get quiz error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/quiz
// @desc    Create a new quiz
// @access  Private
router.post('/', auth, [
  check('title', 'Title is required').not().isEmpty(),
  check('description', 'Description is required').not().isEmpty(),
  check('category', 'Category is required').not().isEmpty(),
  check('questions', 'At least one question is required').isArray({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, category, difficulty, questions, timeLimit, passingScore, tags } = req.body;

    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question || !q.options || q.options.length < 2 || q.correctAnswer === undefined) {
        return res.status(400).json({ 
          message: `Invalid question at index ${i}` 
        });
      }
    }

    const quiz = new Quiz({
      title,
      description,
      category,
      difficulty: difficulty || 'medium',
      questions,
      timeLimit: timeLimit || 30,
      passingScore: passingScore || 70,
      tags: tags || [],
      creator: req.user.id
    });

    await quiz.save();

    // Update user stats
    await req.user.updateStats(0, true);

    res.json(quiz);
  } catch (error) {
    console.error('Create quiz error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/quiz/:id
// @desc    Update a quiz
// @access  Private (creator or admin)
router.put('/:id', auth, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Check if user is creator or admin
    if (quiz.creator.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedQuiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedQuiz);
  } catch (error) {
    console.error('Update quiz error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/quiz/:id
// @desc    Delete a quiz
// @access  Private (creator or admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Check if user is creator or admin
    if (quiz.creator.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Quiz.findByIdAndDelete(req.params.id);
    res.json({ message: 'Quiz removed' });
  } catch (error) {
    console.error('Delete quiz error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/quiz/:id/submit
// @desc    Submit quiz answers and get score
// @access  Private
router.post('/:id/submit', auth, async (req, res) => {
  try {
    const { answers, timeTaken } = req.body;
    
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    if (!quiz.isPublic || !quiz.isActive) {
      return res.status(404).json({ message: 'Quiz not available' });
    }

    // Calculate score
    let score = 0;
    const answerDetails = [];

    for (let i = 0; i < answers.length; i++) {
      const answer = answers[i];
      const question = quiz.questions[answer.questionIndex];
      
      if (question && answer.selectedAnswer === question.correctAnswer) {
        score += question.points;
        answerDetails.push({
          questionIndex: answer.questionIndex,
          selectedAnswer: answer.selectedAnswer,
          isCorrect: true,
          pointsEarned: question.points
        });
      } else {
        answerDetails.push({
          questionIndex: answer.questionIndex,
          selectedAnswer: answer.selectedAnswer,
          isCorrect: false,
          pointsEarned: 0
        });
      }
    }

    const totalPoints = quiz.totalPoints;
    const percentage = Math.round((score / totalPoints) * 100);
    const passed = percentage >= quiz.passingScore;

    // Save score
    const scoreRecord = new Score({
      user: req.user.id,
      quiz: quiz._id,
      score,
      totalPoints,
      percentage,
      passed,
      timeTaken,
      answers: answerDetails
    });

    await scoreRecord.save();

    // Update quiz stats
    await quiz.updateStats(score);

    // Update user stats
    await req.user.updateStats(score);

    res.json({
      scoreId: scoreRecord._id,
      score,
      totalPoints,
      percentage,
      passed,
      timeTaken,
      answers: answerDetails
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/quiz/:id/leaderboard
// @desc    Get quiz leaderboard
// @access  Public
router.get('/:id/leaderboard', async (req, res) => {
  try {
    const leaderboard = await Score.getLeaderboard(req.params.id, 10);
    res.json(leaderboard);
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

