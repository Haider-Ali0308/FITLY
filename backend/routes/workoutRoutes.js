// routes/workoutRoutes.js
import express from "express";
import {
  generateWorkoutPlan,
  saveWorkoutPlan,
  getSavedWorkouts,
  getWorkoutById,
  favoriteWorkout,
  deleteWorkout,
} from "../controllers/workout.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/generate", generateWorkoutPlan);

// Protected routes
router.post("/save", protect, saveWorkoutPlan);
router.get("/saved", protect, getSavedWorkouts);
router.get("/:id", protect, getWorkoutById);
router.post("/favorite", protect, favoriteWorkout);
router.delete("/:id", protect, deleteWorkout);

export default router;
