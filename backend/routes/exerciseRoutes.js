import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// Create a schema for exercises
const exerciseSchema = new mongoose.Schema({
  muscleGroup: String,
  exercises: [
    {
      name: String,
      path: String,
    },
  ],
});

// Create a model using the default connection
const Exercise = mongoose.model("Exercise", exerciseSchema, "exercise");

router.get("/:muscleGroup", async (req, res) => {
  try {
    const muscleGroup = decodeURIComponent(req.params.muscleGroup).toLowerCase();
    console.log("Fetching exercises for muscleGroup:", muscleGroup);

    const result = await Exercise.findOne({ muscleGroup });

    if (result) {
      console.log(`Found ${result.exercises.length} exercises for ${muscleGroup}`);
      res.json(result.exercises);
    } else {
      console.log(`No exercises found for ${muscleGroup}`);
      res.status(404).json({ message: `No exercises found for ${muscleGroup}` });
    }
  } catch (error) {
    console.error("Error fetching exercises:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

export default router;