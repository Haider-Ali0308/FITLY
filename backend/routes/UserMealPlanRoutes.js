import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  generateMealPlan,
  saveMealPlan,
  getSavedMealPlans,
  getMealPlanByDate,
  deleteMealPlan,
} from "../controllers/UserMealPlanController.js";

const router = express.Router();

// Public routes
router.post("/generate", generateMealPlan);

// Protected routes
router.post("/save", protect, saveMealPlan);
router.get("/saved", protect, getSavedMealPlans);
router.get("/:date", protect, getMealPlanByDate);
router.delete("/:id", protect, deleteMealPlan);

export default router;
