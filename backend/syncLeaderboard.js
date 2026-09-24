// newUserSync.js - Utility functions for handling new user leaderboard entries
import Leaderboard from "./models/leaderboard.js";

// Function to create initial leaderboard entry for new users
export const createNewUserLeaderboardEntry = async (email, name) => {
  try {
    // Check if user already exists
    const existingUser = await Leaderboard.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      console.log(`User ${email} already exists in leaderboard`);
      return existingUser;
    }

    // Create new leaderboard entry
    const newUser = new Leaderboard({
      email: email.toLowerCase(),
      name,
      planHistory: [],
      totalPlans: 0,
      averageScore: 0,
    });

    await newUser.save();
    console.log(`Created new leaderboard entry for: ${email}`);
    return newUser;
  } catch (error) {
    console.error(`Error creating leaderboard entry for ${email}:`, error);
    throw error;
  }
};

// Function to add a completed plan to user's leaderboard
export const addPlanToLeaderboard = async (
  email,
  name,
  planType,
  planName,
  score
) => {
  try {
    const validScore = Math.max(0, Math.min(100, score || 0));

    let user = await Leaderboard.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Create new user if doesn't exist
      user = await createNewUserLeaderboardEntry(email, name);
    }

    // Add new plan to history
    user.planHistory.push({
      planType,
      planName,
      score: validScore,
      completedAt: new Date(),
    });

    // Update stats
    user.updateStats();
    await user.save();

    console.log(
      `Added plan to leaderboard for ${email}: ${planName} (${validScore}%)`
    );
    return user;
  } catch (error) {
    console.error(`Error adding plan to leaderboard for ${email}:`, error);
    throw error;
  }
};

// Function to get user's current leaderboard status
export const getUserLeaderboardStatus = async (email) => {
  try {
    const user = await Leaderboard.findOne({ email: email.toLowerCase() });

    if (!user) {
      return {
        exists: false,
        data: null,
        rank: null,
      };
    }

    // Calculate rank
    const rank =
      (await Leaderboard.countDocuments({
        $or: [
          { averageScore: { $gt: user.averageScore } },
          {
            averageScore: user.averageScore,
            totalPlans: { $gt: user.totalPlans },
          },
        ],
      })) + 1;

    return {
      exists: true,
      data: user,
      rank,
    };
  } catch (error) {
    console.error(`Error getting leaderboard status for ${email}:`, error);
    throw error;
  }
};

// Function to check if user needs to be added to leaderboard
export const shouldAddToLeaderboard = async (email) => {
  try {
    const user = await Leaderboard.findOne({ email: email.toLowerCase() });
    return !user; // Return true if user doesn't exist in leaderboard
  } catch (error) {
    console.error(`Error checking leaderboard status for ${email}:`, error);
    return false;
  }
};
