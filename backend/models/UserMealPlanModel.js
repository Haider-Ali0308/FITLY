import mongoose from "mongoose";

const mealPlanSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    planName: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    planData: {
      type: Object,
      required: true,
    },
    userData: {
      type: Object,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const MealPlan = mongoose.model("MealPlan", mealPlanSchema);

export default MealPlan;
