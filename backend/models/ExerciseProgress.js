import mongoose from "mongoose";

const exerciseProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    workoutPlanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workout",
      required: true,
    },
    dayIndex: {
      type: Number,
      required: true,
    },
    exerciseIndex: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["completed", "skipped", "pending"],
      default: "pending",
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure unique records per exercise in a plan
exerciseProgressSchema.index(
  { user: 1, workoutPlanId: 1, dayIndex: 1, exerciseIndex: 1 },
  { unique: true }
);

const ExerciseProgress = mongoose.model(
  "ExerciseProgress",
  exerciseProgressSchema
);

export default ExerciseProgress;
