import express from "express";
import Leaderboard from "../models/leaderboard.js";

const router = express.Router();

// @desc    Get top performers (default 10, max 20)
// @route   GET /api/leaderboard
// @access  Public
const getLeaderboard = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 10, 20); // Default 10, max 20
    const topPerformers = await Leaderboard.getTopPerformers(limit);

    res.json({
      success: true,
      data: topPerformers,
      count: topPerformers.length,
      message:
        topPerformers.length === 0
          ? "No leaderboard data available yet"
          : undefined,
    });
  } catch (error) {
    console.error("Leaderboard fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch leaderboard data",
      error: error.message,
    });
  }
};

// @desc    Get user's leaderboard stats
// @route   GET /api/leaderboard/user/:email
// @access  Public
const getUserStats = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await Leaderboard.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found in leaderboard",
        data: {
          email: email.toLowerCase(),
          name: "Unknown User",
          totalPlans: 0,
          averageScore: 0,
          planHistory: [],
          rank: null,
        },
      });
    }

    // Get user's rank
    const rank =
      (await Leaderboard.countDocuments({
        $or: [
          { averageScore: { $gt: user.averageScore } },
          {
            averageScore: user.averageScore,
            totalPlans: { $gt: user.totalPlans },
          },
        ],
      })) + 1;

    res.json({
      success: true,
      data: {
        ...user.toJSON(),
        rank,
      },
    });
  } catch (error) {
    console.error("User stats fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user stats",
      error: error.message,
    });
  }
};

// @desc    Update user's leaderboard entry
// @route   POST /api/leaderboard/update
// @access  Public
const updateLeaderboard = async (req, res) => {
  try {
    const { email, name, planType, planName, score } = req.body;

    // Validate required fields
    if (!email || !name || !planType) {
      return res.status(400).json({
        success: false,
        message: "Email, name, and planType are required",
      });
    }

    // Validate planType
    if (!["Exercise Plan", "Meal Plan"].includes(planType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid plan type. Must be "Exercise Plan" or "Meal Plan"',
      });
    }

    // Validate score
    const validScore = Math.max(0, Math.min(100, score || 0));

    const updatedUser = await Leaderboard.updateUserScore(
      email,
      name,
      planType,
      planName || `${planType} - ${new Date().toLocaleDateString()}`,
      validScore
    );

    res.json({
      success: true,
      message: "Leaderboard updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Leaderboard update error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update leaderboard",
      error: error.message,
    });
  }
};

// @desc    Get leaderboard statistics
// @route   GET /api/leaderboard/stats
// @access  Public
const getLeaderboardStats = async (req, res) => {
  try {
    const totalUsers = await Leaderboard.countDocuments({
      totalPlans: { $gt: 0 },
    });

    const totalPlans = await Leaderboard.aggregate([
      { $match: { totalPlans: { $gt: 0 } } },
      { $group: { _id: null, total: { $sum: "$totalPlans" } } },
    ]);

    const avgScore = await Leaderboard.aggregate([
      { $match: { totalPlans: { $gt: 0 } } },
      { $group: { _id: null, avgScore: { $avg: "$averageScore" } } },
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalPlans: totalPlans[0]?.total || 0,
        averageScore: Math.round(avgScore[0]?.avgScore || 0),
      },
    });
  } catch (error) {
    console.error("Leaderboard stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch leaderboard statistics",
      error: error.message,
    });
  }
};

// @desc    Force refresh leaderboard for current user (for testing)
// @route   POST /api/leaderboard/refresh
// @access  Public
const refreshUserLeaderboard = async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email || !name) {
      return res.status(400).json({
        success: false,
        message: "Email and name are required",
      });
    }

    // This would typically sync with the progress system
    // For now, we'll just return current user data
    const user = await Leaderboard.findOne({ email: email.toLowerCase() });

    if (user) {
      // Recalculate stats
      user.updateStats();
      await user.save();

      res.json({
        success: true,
        message: "User leaderboard data refreshed",
        data: user,
      });
    } else {
      res.json({
        success: false,
        message: "User not found in leaderboard",
      });
    }
  } catch (error) {
    console.error("Refresh error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to refresh leaderboard",
      error: error.message,
    });
  }
};

router.get("/", getLeaderboard);
router.get("/user/:email", getUserStats);
router.post("/update", updateLeaderboard);
router.get("/stats", getLeaderboardStats);
router.post("/refresh", refreshUserLeaderboard);

export default router;
