import mongoose from "mongoose";

const leaderboardSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: true,
    },
    totalPlans: {
      type: Number,
      default: 0,
    },
    averageScore: {
      type: Number,
      default: 0,
    },
    planHistory: [
      {
        planType: {
          type: String,
          enum: ["Exercise Plan", "Meal Plan"],
          required: true,
        },
        planName: {
          type: String,
          required: true,
        },
        score: {
          type: Number,
          min: 0,
          max: 100,
          required: true,
        },
        completedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Instance method to update stats
leaderboardSchema.methods.updateStats = function () {
  this.totalPlans = this.planHistory.length;

  if (this.totalPlans > 0) {
    const totalScore = this.planHistory.reduce(
      (sum, plan) => sum + plan.score,
      0
    );
    this.averageScore = Math.round(totalScore / this.totalPlans);
  } else {
    this.averageScore = 0;
  }
};

// Static method to get top performers
leaderboardSchema.statics.getTopPerformers = async function (limit = 10) {
  return await this.find({ totalPlans: { $gt: 0 } })
    .sort({
      averageScore: -1,
      totalPlans: -1,
      updatedAt: -1,
    })
    .limit(limit)
    .select("-__v");
};

// Static method to update user score
leaderboardSchema.statics.updateUserScore = async function (
  email,
  name,
  planType,
  planName,
  score
) {
  let user = await this.findOne({ email: email.toLowerCase() });

  if (!user) {
    user = new this({
      email: email.toLowerCase(),
      name,
      planHistory: [],
    });
  } else {
    // Update name in case it changed
    user.name = name;
  }

  // Add new plan to history
  user.planHistory.push({
    planType,
    planName,
    score,
    completedAt: new Date(),
  });

  // Update calculated stats
  user.updateStats();

  await user.save();
  return user;
};

const Leaderboard = mongoose.model("Leaderboard", leaderboardSchema);

export default Leaderboard;
