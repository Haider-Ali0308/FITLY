import express from "express";
import WorkoutPlan from "../models/WorkoutPlan.js";
import ExerciseProgress from "../models/ExerciseProgress.js";
import Leaderboard from "../models/leaderboard.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const calculatePoints = (plan, progressData) => {
  let planPossiblePoints = 0;

  if (plan.planData?.workoutDays) {
    plan.planData.workoutDays.forEach((day) => {
      planPossiblePoints += (day.exercises?.length || 0) * 5;
    });
  }

  let planEarnedPoints = 0;
  progressData.forEach((progress) => {
    if (progress.status === "completed") planEarnedPoints += 5;
    else if (progress.status === "skipped") planEarnedPoints -= 2;
  });

  return {
    possible: planPossiblePoints,
    earned: Math.max(0, planEarnedPoints),
    percentage:
      planPossiblePoints > 0
        ? Math.round((planEarnedPoints / planPossiblePoints) * 100)
        : 0,
  };
};

// Function to sync new user data with leaderboard
const syncWithLeaderboard = async (userId, userEmail, userName) => {
  try {
    // Check if user already exists in leaderboard
    const existingLeaderboardUser = await Leaderboard.findOne({
      email: userEmail.toLowerCase(),
    });

    const [workoutPlans, allProgress] = await Promise.all([
      WorkoutPlan.find({ user: userId }),
      ExerciseProgress.find({ user: userId }),
    ]);

    if (!workoutPlans.length) return;

    let totalEarned = 0;
    let totalPossible = 0;
    const completedPlans = [];

    workoutPlans.forEach((plan) => {
      const planProgress = allProgress.filter((p) =>
        p.workoutPlanId.equals(plan._id)
      );

      const points = calculatePoints(plan, planProgress);

      // Only count plans that have some progress
      if (points.possible > 0) {
        totalEarned += points.earned;
        totalPossible += points.possible;

        completedPlans.push({
          planType: "Exercise Plan",
          planName: plan.planName || "Custom Plan",
          score: points.percentage,
        });
      }
    });

    // Update leaderboard with current user stats
    if (completedPlans.length > 0) {
      let user = existingLeaderboardUser;

      if (!user) {
        // Create new leaderboard entry for new users
        user = new Leaderboard({
          email: userEmail.toLowerCase(),
          name: userName,
          planHistory: completedPlans,
        });
        console.log(`Creating new leaderboard entry for: ${userEmail}`);
      } else {
        // Update existing user's plan history
        user.planHistory = completedPlans;
        user.name = userName; // Update name in case it changed
        console.log(`Updating existing leaderboard entry for: ${userEmail}`);
      }

      user.updateStats();
      await user.save();
    }
  } catch (error) {
    console.error("Error syncing with leaderboard:", error);
  }
};

// Updated points endpoint with leaderboard sync
router.get("/points", protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const userEmail = req.user.email;
    const userName = req.user.name;

    const [workoutPlans, allProgress] = await Promise.all([
      WorkoutPlan.find({ user: userId }),
      ExerciseProgress.find({ user: userId }),
    ]);

    if (!workoutPlans.length) {
      return res.json({
        totalPlans: 0,
        averagePoints: 0,
        totalEarned: 0,
        totalPossible: 0,
        plans: [],
      });
    }

    let totalEarned = 0;
    let totalPossible = 0;
    const plans = [];

    workoutPlans.forEach((plan) => {
      const planProgress = allProgress.filter((p) =>
        p.workoutPlanId.equals(plan._id)
      );

      const points = calculatePoints(plan, planProgress);

      totalEarned += points.earned;
      totalPossible += points.possible;

      plans.push({
        planId: plan._id,
        planName: plan.planName || "Custom Plan",
        earned: points.earned,
        possible: points.possible,
        percentage: points.percentage,
      });
    });

    const responseData = {
      totalPlans: workoutPlans.length,
      averagePoints:
        totalPossible > 0 ? Math.round((totalEarned / totalPossible) * 100) : 0,
      totalEarned,
      totalPossible,
      plans,
    };

    // Sync with leaderboard in background (for new and existing users)
    syncWithLeaderboard(userId, userEmail, userName).catch(console.error);

    res.json(responseData);
  } catch (error) {
    console.error("Error fetching points:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// New endpoint to manually sync current user with leaderboard
router.post("/sync-leaderboard", protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const userEmail = req.user.email;
    const userName = req.user.name;

    await syncWithLeaderboard(userId, userEmail, userName);

    res.json({
      success: true,
      message: "Successfully synced with leaderboard",
    });
  } catch (error) {
    console.error("Sync error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to sync with leaderboard",
      error: error.message,
    });
  }
});

// Endpoint to update progress and sync with leaderboard
router.post("/exercise/:exerciseId", protect, async (req, res) => {
  try {
    const { exerciseId } = req.params;
    const { workoutPlanId, status, dayIndex, exerciseIndex } = req.body;
    const userId = req.user._id;

    // Update or create exercise progress
    let progress = await ExerciseProgress.findOne({
      user: userId,
      workoutPlanId,
      exerciseId,
      dayIndex,
      exerciseIndex,
    });

    if (progress) {
      progress.status = status;
      progress.completedAt = status === "completed" ? new Date() : null;
    } else {
      progress = new ExerciseProgress({
        user: userId,
        workoutPlanId,
        exerciseId,
        dayIndex,
        exerciseIndex,
        status,
        completedAt: status === "completed" ? new Date() : null,
      });
    }

    await progress.save();

    // Sync with leaderboard after progress update
    const userEmail = req.user.email;
    const userName = req.user.name;
    syncWithLeaderboard(userId, userEmail, userName).catch(console.error);

    res.json({
      success: true,
      data: progress,
    });
  } catch (error) {
    console.error("Error updating exercise progress:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update exercise progress",
      error: error.message,
    });
  }
});

export default router;
