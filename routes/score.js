const express = require('express');
const Score = require('../models/Score');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/score/history
// @desc    Get user's quiz history
// @access  Private
router.get('/history', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const history = await Score.find({ user: req.user.id })
      .populate('quiz', 'title category difficulty')
      .sort({ completedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Score.countDocuments({ user: req.user.id });

    res.json({
      history,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/score/:id
// @desc    Get a specific score by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const score = await Score.findById(req.params.id)
      .populate('quiz', 'title category difficulty questions')
      .populate('user', 'username firstName lastName');

    if (!score) {
      return res.status(404).json({ message: 'Score not found' });
    }

    // Check if user owns this score or is admin
    if (score.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Format the response for the frontend
    const formattedScore = {
      ...score.toObject(),
      answers: score.answers.map(answer => {
        const question = score.quiz.questions[answer.questionIndex];
        return {
          question: question.question,
          selectedAnswer: question.options[answer.selectedAnswer],
          correctAnswer: question.options[question.correctAnswer],
          correct: answer.isCorrect,
          explanation: question.explanation
        };
      })
    };

    res.json(formattedScore);
  } catch (error) {
    console.error('Get score error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/score/quiz/:quizId
// @desc    Get user's score for a specific quiz
// @access  Private
router.get('/quiz/:quizId', auth, async (req, res) => {
  try {
    const score = await Score.findOne({ 
      user: req.user.id, 
      quiz: req.params.quizId 
    }).populate('quiz', 'title category difficulty');

    if (!score) {
      return res.status(404).json({ message: 'Score not found' });
    }

    res.json(score);
  } catch (error) {
    console.error('Get score error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/score/stats/overview
// @desc    Get user's overall statistics
// @access  Private
router.get('/stats/overview', auth, async (req, res) => {
  try {
    const stats = await Score.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: null,
          totalQuizzes: { $sum: 1 },
          totalScore: { $sum: '$score' },
          totalPoints: { $sum: '$totalPoints' },
          averageScore: { $avg: '$percentage' },
          passedQuizzes: { $sum: { $cond: ['$passed', 1, 0] } },
          totalTime: { $sum: '$timeTaken' }
        }
      }
    ]);

    const categoryStats = await Score.aggregate([
      { $match: { user: req.user._id } },
      {
        $lookup: {
          from: 'quizzes',
          localField: 'quiz',
          foreignField: '_id',
          as: 'quizData'
        }
      },
      { $unwind: '$quizData' },
      {
        $group: {
          _id: '$quizData.category',
          count: { $sum: 1 },
          averageScore: { $avg: '$percentage' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const recentScores = await Score.find({ user: req.user.id })
      .populate('quiz', 'title category')
      .sort({ completedAt: -1 })
      .limit(5);

    res.json({
      overview: stats[0] || {
        totalQuizzes: 0,
        totalScore: 0,
        totalPoints: 0,
        averageScore: 0,
        passedQuizzes: 0,
        totalTime: 0
      },
      categoryStats,
      recentScores
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/score/stats/category/:category
// @desc    Get user's statistics for a specific category
// @access  Private
router.get('/stats/category/:category', auth, async (req, res) => {
  try {
    const { category } = req.params;
    
    const scores = await Score.aggregate([
      {
        $lookup: {
          from: 'quizzes',
          localField: 'quiz',
          foreignField: '_id',
          as: 'quizData'
        }
      },
      { $unwind: '$quizData' },
      { $match: { user: req.user._id, 'quizData.category': category } },
      {
        $group: {
          _id: null,
          totalQuizzes: { $sum: 1 },
          totalScore: { $sum: '$score' },
          totalPoints: { $sum: '$totalPoints' },
          averageScore: { $avg: '$percentage' },
          passedQuizzes: { $sum: { $cond: ['$passed', 1, 0] } },
          totalTime: { $sum: '$timeTaken' }
        }
      }
    ]);

    const quizScores = await Score.aggregate([
      {
        $lookup: {
          from: 'quizzes',
          localField: 'quiz',
          foreignField: '_id',
          as: 'quizData'
        }
      },
      { $unwind: '$quizData' },
      { $match: { user: req.user._id, 'quizData.category': category } },
      {
        $project: {
          score: 1,
          percentage: 1,
          passed: 1,
          timeTaken: 1,
          completedAt: 1,
          'quizData.title': 1,
          'quizData.difficulty': 1
        }
      },
      { $sort: { completedAt: -1 } }
    ]);

    res.json({
      category,
      stats: scores[0] || {
        totalQuizzes: 0,
        totalScore: 0,
        totalPoints: 0,
        averageScore: 0,
        passedQuizzes: 0,
        totalTime: 0
      },
      quizScores
    });
  } catch (error) {
    console.error('Get category stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

