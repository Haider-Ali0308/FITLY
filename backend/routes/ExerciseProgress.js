import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  updateExerciseStatus,
  getWorkoutProgress,
  getProgressStats,
} from "../controllers/ExerciseProgress.js";

const router = express.Router();

// Apply protection middleware to all routes
router.use(protect);

// Update exercise status (complete/skip)
router.post("/update", updateExerciseStatus);
router.get("/stats/all", getProgressStats);
router.get("/:workoutPlanId", getWorkoutProgress);

export default router;
