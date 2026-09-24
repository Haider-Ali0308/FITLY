import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  sets: {
    type: Number,
    required: true,
  },
  reps: {
    type: String,
    required: true,
  },
  weight: {
    type: String,
    required: true,
  },
});

const workoutDaySchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
  },
  focus: {
    type: String,
    required: true,
  },
  exercises: [exerciseSchema],
});

const workoutPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    planName: {
      type: String,
      required: true,
    },
    planData: {
      summary: {
        type: String,
        required: true,
      },
      workoutDays: [workoutDaySchema],
      tips: [String], 
    },
    userInputs: {
      weight: String,
      height: String, 
      goal: String,
      fitnessLevel: String,
      daysPerWeek: String,
      limitations: String,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const WorkoutPlan = mongoose.model("WorkoutPlan", workoutPlanSchema);

export default WorkoutPlan;
