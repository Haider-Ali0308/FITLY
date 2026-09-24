import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const exerciseSchema = new mongoose.Schema({
  muscleGroup: String,
  exercises: [
    {
      name: String,
      path: String,
    },
  ],
});

const Exercise = mongoose.model("Exercise", exerciseSchema, "exercise");

const data = JSON.parse(
  fs.readFileSync("./config/Exercise.json", "utf-8")
);

const imageFolder = path.resolve(
  "../frontend/public/assets/exercise"
);

try {
  await mongoose.connect(process.env.MONGODB_URI);

  console.log("Connected to MongoDB");

  let fixedPaths = 0;
  let missingImages = 0;

  for (const group of data) {
    for (const exercise of group.exercises) {

      // Remove extension ONLY from the displayed name
      exercise.name = exercise.name.replace(/\.[^/.]+$/, "");

      // Get the actual filename from the existing path
      const filename = path.basename(exercise.path);

      // Check if that image actually exists
      const imageFile = path.join(imageFolder, filename);

      if (fs.existsSync(imageFile)) {

        const correctPath = `/assets/exercise/${filename}`;

        if (exercise.path !== correctPath) {
          console.log(
            `Fixed path: ${exercise.path} -> ${correctPath}`
          );

          exercise.path = correctPath;
          fixedPaths++;
        }

      } else {
        console.log(`MISSING IMAGE: ${filename}`);
        missingImages++;
      }
    }
  }

  // Replace old exercise data with corrected data
  await Exercise.deleteMany({});
  await Exercise.insertMany(data);

  console.log("");
  console.log("Import complete!");
  console.log(`Muscle groups imported: ${data.length}`);
  console.log(`Paths fixed: ${fixedPaths}`);
  console.log(`Missing images: ${missingImages}`);

  await mongoose.disconnect();

  console.log("Disconnected from MongoDB");
} catch (error) {
  console.error("Import failed:", error);
  process.exit(1);
}