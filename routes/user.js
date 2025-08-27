const express = require('express');
const User = require('../models/User');
const Quiz = require('../models/Quiz');
const Score = require('../models/Score');
const { auth, admin } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/user/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/user/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    const { firstName, lastName, bio, avatar } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.profile = {
      ...user.profile,
      firstName: firstName || user.profile.firstName,
      lastName: lastName || user.profile.lastName,
      bio: bio || user.profile.bio,
      avatar: avatar || user.profile.avatar
    };

    await user.save();
    res.json({ user });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/user/quizzes
// @desc    Get user's created quizzes
// @access  Private
router.get('/quizzes', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const quizzes = await Quiz.find({ creator: req.user.id })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Quiz.countDocuments({ creator: req.user.id });

    res.json({
      quizzes,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get user quizzes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/user/dashboard
// @desc    Get user dashboard data
// @access  Private
router.get('/dashboard', auth, async (req, res) => {
  try {
    // Get user stats
    const user = await User.findById(req.user.id);
    
    // Get recent quizzes taken
    const recentScores = await Score.find({ user: req.user.id })
      .populate('quiz', 'title category difficulty')
      .sort({ completedAt: -1 })
      .limit(5);

    // Get user's created quizzes
    const createdQuizzes = await Quiz.find({ creator: req.user.id })
      .sort({ createdAt: -1 })
      .limit(5);

    // Get category performance
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
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      userStats: user.stats,
      recentScores,
      createdQuizzes,
      categoryStats
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin routes
// @route   GET /api/user/admin/users
// @desc    Get all users (admin only)
// @access  Private/Admin
router.get('/admin/users', auth, admin, async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    
    const query = {};
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/user/admin/users/:id/role
// @desc    Update user role (admin only)
// @access  Private/Admin
router.put('/admin/users/:id/role', auth, admin, async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/user/admin/stats
// @desc    Get admin dashboard stats
// @access  Private/Admin
router.get('/admin/stats', auth, admin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalQuizzes = await Quiz.countDocuments();
    const totalScores = await Score.countDocuments();

    const recentUsers = await User.find()
      .select('username email createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    const popularQuizzes = await Quiz.aggregate([
      { $match: { isPublic: true } },
      {
        $project: {
          title: 1,
          category: 1,
          totalAttempts: '$stats.totalAttempts',
          averageScore: '$stats.averageScore'
        }
      },
      { $sort: { totalAttempts: -1 } },
      { $limit: 5 }
    ]);

    const categoryStats = await Quiz.aggregate([
      { $match: { isPublic: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalAttempts: { $sum: '$stats.totalAttempts' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      totalUsers,
      totalQuizzes,
      totalScores,
      recentUsers,
      popularQuizzes,
      categoryStats
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

