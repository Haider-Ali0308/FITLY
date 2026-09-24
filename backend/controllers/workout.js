import asyncHandler from "express-async-handler";
import Workout from "../models/WorkoutPlan.js";
import User from "../models/userModel.js";
import { generateContent } from "../utils/geminiService.js";

// @desc    Generate a workout plan using Gemini AI
// @route   POST /api/workouts/generate
// @access  Public
const generateWorkoutPlan = asyncHandler(async (req, res) => {
  const { weight, height, goal, fitnessLevel, selectedDays, limitations } =
    req.body;

  try {
    // Construct prompt for Gemini
    const prompt = `Generate a detailed workout plan for a person with the following characteristics:
    - Weight: ${weight} kg/lbs
    - Height: ${height} cm/ft
    - Goal: ${goal}
    - Fitness level: ${fitnessLevel}
    - Selected days: ${selectedDays.join(", ")}
    ${
      limitations
        ? `- Limitations or injuries: ${limitations}`
        : "- No specific limitations"
    }
    
    The workout plan should include:
    1. A brief summary of the plan
    2. Workouts for ONLY the following days: ${selectedDays.join(
      ", "
    )}. Each day should have:
       - Day name (e.g., Monday, Friday, etc. - ONLY use days that the user selected)
       - Focus area (Upper Body, Lower Body, etc.)
       - 4-5 specific exercises with sets, reps, and weight guidelines
    3. Three specific tips for achieving their ${goal} goal
    
    Format the response as a JSON object with the following structure:
    {
      "summary": "Brief description of the plan",
      "workoutDays": [
        {
          "day": "Day name",
          "focus": "Focus area",
          "exercises": [
            {
              "name": "Exercise name",
              "sets": number,
              "reps": "rep range or time",
              "weight": "weight guideline"
            }
          ]
        }
      ],
      "tips": [
        "Tip 1",
        "Tip 2",
        "Tip 3"
      ]
    }
    
    IMPORTANT: The "workoutDays" array should ONLY include the days that the user selected (${selectedDays.join(
      ", "
    )}) and in the correct week order.`;

    // Call Gemini API
    const aiResponse = await generateContent(prompt);

    // Parse response - handle possible formatting issues
    let workoutPlan;
    try {
      workoutPlan = JSON.parse(aiResponse);
    } catch (parseError) {
      // If JSON parsing fails, try to extract JSON from text response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        workoutPlan = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Failed to parse AI response");
      }
    }

    res.json(workoutPlan);
  } catch (error) {
    console.error("Error generating workout plan with AI:", error);
    res.status(500);
    throw new Error("Failed to generate workout plan");
  }
});

// @desc    Save a workout plan
// @route   POST /api/workouts/save
// @access  Private
const saveWorkoutPlan = asyncHandler(async (req, res) => {
  const { userId, planName, planData, userInputs } = req.body;

  // Verify user exists
  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Create and save the workout plan
  const workoutPlan = new Workout({
    user: userId,
    planName: planName || `Workout Plan - ${new Date().toLocaleDateString()}`,
    planData,
    userInputs,
  });

  const savedPlan = await workoutPlan.save();
  res.status(201).json(savedPlan);
});

// @desc    Get all saved workout plans for a user
// @route   GET /api/workouts/saved
// @access  Private
const getSavedWorkouts = asyncHandler(async (req, res) => {
  const workouts = await Workout.find({ user: req.user._id }).sort({
    createdAt: -1,
  });

  res.json(workouts);
});

// @desc    Get a specific workout plan
// @route   GET /api/workouts/:id
// @access  Private
const getWorkoutById = asyncHandler(async (req, res) => {
  const workout = await Workout.findById(req.params.id);

  if (workout && workout.user.toString() === req.user._id.toString()) {
    res.json(workout);
  } else {
    res.status(404);
    throw new Error("Workout plan not found");
  }
});

// @desc    Mark a workout plan as favorite
// @route   POST /api/workouts/favorite
// @access  Private
const favoriteWorkout = asyncHandler(async (req, res) => {
  const { planId } = req.body;

  const workout = await Workout.findById(planId);

  if (!workout) {
    res.status(404);
    throw new Error("Workout plan not found");
  }

  if (workout.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }

  workout.isFavorite = !workout.isFavorite;
  const updatedWorkout = await workout.save();

  res.json(updatedWorkout);
});

// @desc    Delete a workout plan
// @route   DELETE /api/workouts/:id
// @access  Private
const deleteWorkout = asyncHandler(async (req, res) => {
  const workout = await Workout.findById(req.params.id);

  if (workout && workout.user.toString() === req.user._id.toString()) {
    await workout.deleteOne();
    res.json({ message: "Workout plan removed" });
  } else {
    res.status(404);
    throw new Error("Workout plan not found");
  }
});

export {
  generateWorkoutPlan,
  saveWorkoutPlan,
  getSavedWorkouts,
  getWorkoutById,
  favoriteWorkout,
  deleteWorkout,
};
