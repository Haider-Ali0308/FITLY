import asyncHandler from "express-async-handler";
import ExerciseProgress from "../models/ExerciseProgress.js";
import Workout from "../models/WorkoutPlan.js";

// @desc    Update exercise status (complete or skip)
// @route   POST /api/progress/update
// @access  Private
const updateExerciseStatus = asyncHandler(async (req, res) => {
  const { workoutPlanId, dayIndex, exerciseIndex, status } = req.body;

  if (!["completed", "skipped"].includes(status)) {
    res.status(400);
    throw new Error("Invalid status value");
  }

  // Verify workout plan exists and belongs to user
  const workoutPlan = await Workout.findById(workoutPlanId);
  if (!workoutPlan) {
    res.status(404);
    throw new Error("Workout plan not found");
  }

  if (workoutPlan.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }

  // Find and update or create progress record
  const progressRecord = await ExerciseProgress.findOneAndUpdate(
    {
      user: req.user._id,
      workoutPlanId,
      dayIndex,
      exerciseIndex,
    },
    {
      status,
      completedAt: status === "completed" ? new Date() : null,
    },
    {
      new: true,
      upsert: true, // Create if doesn't exist
    }
  );

  res.status(200).json(progressRecord);
});

// @desc    Get progress for a specific workout plan
// @route   GET /api/progress/:workoutPlanId
// @access  Private
const getWorkoutProgress = asyncHandler(async (req, res) => {
  const { workoutPlanId } = req.params;

  // Verify workout plan exists and belongs to user
  const workoutPlan = await Workout.findById(workoutPlanId);
  if (!workoutPlan) {
    res.status(404);
    throw new Error("Workout plan not found");
  }

  if (workoutPlan.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }

  const progress = await ExerciseProgress.find({
    user: req.user._id,
    workoutPlanId,
  });

  res.status(200).json(progress);
});

// @desc    Get all progress stats for a user (for dashboard)
// @route   GET /api/progress/stats
// @access  Private
const getProgressStats = asyncHandler(async (req, res) => {
  // Get all workout plans for the user
  const workoutPlans = await Workout.find({ user: req.user._id });
  const planIds = workoutPlans.map((plan) => plan._id);

  // Get all progress records for these plans
  const allProgress = await ExerciseProgress.find({
    user: req.user._id,
    workoutPlanId: { $in: planIds },
  });

  // Calculate statistics
  const progressByPlan = {};
  const completedPlans = new Set();
  const activePlans = new Set();

  // Group progress by plan
  allProgress.forEach((record) => {
    const planId = record.workoutPlanId.toString();
    if (!progressByPlan[planId]) {
      progressByPlan[planId] = {
        completed: 0,
        skipped: 0,
        total: 0,
      };
    }

    if (record.status === "completed") {
      progressByPlan[planId].completed += 1;
    } else if (record.status === "skipped") {
      progressByPlan[planId].skipped += 1;
    }
  });

  // Calculate total exercises for each plan and determine completion percentage
  for (const plan of workoutPlans) {
    const planId = plan._id.toString();
    let totalExercises = 0;

    if (plan.planData && plan.planData.workoutDays) {
      plan.planData.workoutDays.forEach((day) => {
        totalExercises += day.exercises ? day.exercises.length : 0;
      });
    }

    if (!progressByPlan[planId]) {
      progressByPlan[planId] = {
        completed: 0,
        skipped: 0,
        total: totalExercises,
      };
    } else {
      progressByPlan[planId].total = totalExercises;
    }

    // Calculate completion percentage
    const completionPercentage =
      totalExercises > 0
        ? Math.round((progressByPlan[planId].completed / totalExercises) * 100)
        : 0;

    progressByPlan[planId].percentage = completionPercentage;

    // Track completed and active plans
    if (completionPercentage === 100) {
      completedPlans.add(planId);
    } else if (completionPercentage > 0) {
      activePlans.add(planId);
    }
  }

  // Calculate overall progress
  const stats = {
    progressByPlan,
    completedPlansCount: completedPlans.size,
    activePlansCount: activePlans.size,
    overallProgress: 0,
  };

  // Calculate overall progress percentage across all plans
  if (Object.keys(progressByPlan).length > 0) {
    const totalPercentage = Object.values(progressByPlan).reduce(
      (sum, plan) => sum + plan.percentage,
      0
    );
    stats.overallProgress = Math.round(
      totalPercentage / Object.keys(progressByPlan).length
    );
  }

  res.status(200).json(stats);
});

export { updateExerciseStatus, getWorkoutProgress, getProgressStats };
