// utils/planGenerator.js

const goalToText = (goal) => {
  const goalMap = {
    weightLoss: "weight loss",
    muscleGain: "muscle gain",
    endurance: "improving endurance",
    general: "general fitness",
  };
  return goalMap[goal] || "general fitness";
};

// Exercise database organized by goals and muscle groups
const exerciseDatabase = {
  weightLoss: {
    cardio: [
      {
        name: "Jumping Jacks",
        beginner: "2 sets × 30 seconds",
        intermediate: "3 sets × 45 seconds",
        advanced: "4 sets × 60 seconds",
      },
      {
        name: "Mountain Climbers",
        beginner: "2 sets × 30 seconds",
        intermediate: "3 sets × 45 seconds",
        advanced: "3 sets × 60 seconds",
      },
      {
        name: "High Knees",
        beginner: "2 sets × 20 seconds",
        intermediate: "3 sets × 30 seconds",
        advanced: "4 sets × 45 seconds",
      },
      {
        name: "Burpees",
        beginner: "2 sets × 5 reps",
        intermediate: "3 sets × 10 reps",
        advanced: "4 sets × 15 reps",
      },
      {
        name: "Jump Rope",
        beginner: "2 sets × 1 minute",
        intermediate: "3 sets × 2 minutes",
        advanced: "4 sets × 3 minutes",
      },
    ],
    fullBody: [
      {
        name: "Bodyweight Squats",
        beginner: "2 sets × 10 reps",
        intermediate: "3 sets × 15 reps",
        advanced: "4 sets × 20 reps",
      },
      {
        name: "Push-ups",
        beginner: "2 sets × 5 reps",
        intermediate: "3 sets × 10 reps",
        advanced: "4 sets × 15 reps",
      },
      {
        name: "Lunges",
        beginner: "2 sets × 8 reps each leg",
        intermediate: "3 sets × 12 reps each leg",
        advanced: "4 sets × 15 reps each leg",
      },
      {
        name: "Plank",
        beginner: "2 sets × 20 seconds",
        intermediate: "3 sets × 40 seconds",
        advanced: "3 sets × 60 seconds",
      },
      {
        name: "Glute Bridges",
        beginner: "2 sets × 10 reps",
        intermediate: "3 sets × 15 reps",
        advanced: "3 sets × 20 reps",
      },
    ],
    hiit: [
      {
        name: "30-20-10 Intervals",
        beginner: "3 rounds",
        intermediate: "5 rounds",
        advanced: "7 rounds",
        notes: "30s easy, 20s medium, 10s all-out",
      },
      {
        name: "Tabata Protocol",
        beginner: "2 rounds",
        intermediate: "4 rounds",
        advanced: "6 rounds",
        notes: "20s work, 10s rest",
      },
      {
        name: "EMOM (Every Minute On the Minute)",
        beginner: "8 minutes",
        intermediate: "12 minutes",
        advanced: "15 minutes",
      },
    ],
  },
  muscleGain: {
    chest: [
      {
        name: "Push-ups",
        beginner: "3 sets × 8 reps",
        intermediate: "4 sets × 12 reps",
        advanced: "5 sets × 15 reps",
      },
      {
        name: "Dumbbell Bench Press",
        beginner: "3 sets × 8 reps",
        intermediate: "4 sets × 10 reps",
        advanced: "5 sets × 12 reps",
        weight: true,
        weightPercentage: 0.3,
      },
      {
        name: "Dumbbell Flyes",
        beginner: "3 sets × 10 reps",
        intermediate: "3 sets × 12 reps",
        advanced: "4 sets × 15 reps",
        weight: true,
        weightPercentage: 0.15,
      },
    ],
    back: [
      {
        name: "Dumbbell Rows",
        beginner: "3 sets × 8 reps",
        intermediate: "3 sets × 12 reps",
        advanced: "4 sets × 15 reps",
        weight: true,
        weightPercentage: 0.2,
      },
      {
        name: "Lat Pulldowns",
        beginner: "3 sets × 10 reps",
        intermediate: "4 sets × 12 reps",
        advanced: "4 sets × 15 reps",
        weight: true,
        weightPercentage: 0.5,
      },
      {
        name: "Superman Holds",
        beginner: "3 sets × 15 seconds",
        intermediate: "3 sets × 30 seconds",
        advanced: "4 sets × 45 seconds",
      },
    ],
    legs: [
      {
        name: "Squats",
        beginner: "3 sets × 10 reps",
        intermediate: "4 sets × 12 reps",
        advanced: "5 sets × 15 reps",
      },
      {
        name: "Goblet Squats",
        beginner: "3 sets × 8 reps",
        intermediate: "3 sets × 12 reps",
        advanced: "4 sets × 15 reps",
        weight: true,
        weightPercentage: 0.25,
      },
      {
        name: "Lunges",
        beginner: "2 sets × 8 reps each leg",
        intermediate: "3 sets × 10 reps each leg",
        advanced: "4 sets × 12 reps each leg",
      },
      {
        name: "Romanian Deadlifts",
        beginner: "3 sets × 8 reps",
        intermediate: "3 sets × 10 reps",
        advanced: "4 sets × 12 reps",
        weight: true,
        weightPercentage: 0.3,
      },
    ],
    arms: [
      {
        name: "Bicep Curls",
        beginner: "3 sets × 10 reps",
        intermediate: "3 sets × 12 reps",
        advanced: "4 sets × 15 reps",
        weight: true,
        weightPercentage: 0.1,
      },
      {
        name: "Tricep Dips",
        beginner: "3 sets × 8 reps",
        intermediate: "3 sets × 12 reps",
        advanced: "4 sets × 15 reps",
      },
      {
        name: "Hammer Curls",
        beginner: "3 sets × 10 reps",
        intermediate: "3 sets × 12 reps",
        advanced: "4 sets × 15 reps",
        weight: true,
        weightPercentage: 0.1,
      },
      {
        name: "Overhead Tricep Extensions",
        beginner: "3 sets × 10 reps",
        intermediate: "3 sets × 12 reps",
        advanced: "4 sets × 15 reps",
        weight: true,
        weightPercentage: 0.1,
      },
    ],
    shoulders: [
      {
        name: "Lateral Raises",
        beginner: "3 sets × 10 reps",
        intermediate: "3 sets × 12 reps",
        advanced: "4 sets × 15 reps",
        weight: true,
        weightPercentage: 0.05,
      },
      {
        name: "Shoulder Press",
        beginner: "3 sets × 8 reps",
        intermediate: "3 sets × 10 reps",
        advanced: "4 sets × 12 reps",
        weight: true,
        weightPercentage: 0.15,
      },
      {
        name: "Front Raises",
        beginner: "3 sets × 10 reps",
        intermediate: "3 sets × 12 reps",
        advanced: "4 sets × 15 reps",
        weight: true,
        weightPercentage: 0.05,
      },
    ],
    core: [
      {
        name: "Plank",
        beginner: "3 sets × 20 seconds",
        intermediate: "3 sets × 40 seconds",
        advanced: "3 sets × 60 seconds",
      },
      {
        name: "Russian Twists",
        beginner: "2 sets × 10 reps each side",
        intermediate: "3 sets × 15 reps each side",
        advanced: "3 sets × 20 reps each side",
      },
      {
        name: "Bicycle Crunches",
        beginner: "2 sets × 12 reps",
        intermediate: "3 sets × 15 reps",
        advanced: "3 sets × 20 reps",
      },
    ],
  },
  endurance: {
    running: [
      {
        name: "Steady State Run",
        beginner: "15 minutes",
        intermediate: "25 minutes",
        advanced: "40 minutes",
        notes: "Moderate pace",
      },
      {
        name: "Interval Running",
        beginner: "6 × 30s sprints with 90s recovery",
        intermediate: "8 × 45s sprints with 60s recovery",
        advanced: "10 × 60s sprints with 45s recovery",
      },
      {
        name: "Fartlek Training",
        beginner: "15 minutes",
        intermediate: "25 minutes",
        advanced: "35 minutes",
        notes: "Varied pace running",
      },
    ],
    cardio: [
      {
        name: "Cycling",
        beginner: "15 minutes",
        intermediate: "30 minutes",
        advanced: "45 minutes",
        notes: "Moderate resistance",
      },
      {
        name: "Swimming",
        beginner: "15 minutes",
        intermediate: "30 minutes",
        advanced: "45 minutes",
      },
      {
        name: "Rowing",
        beginner: "10 minutes",
        intermediate: "20 minutes",
        advanced: "30 minutes",
      },
    ],
    circuit: [
      {
        name: "Full Body Circuit",
        beginner: "2 rounds",
        intermediate: "3 rounds",
        advanced: "4 rounds",
        notes: "30s work, 15s rest between exercises",
      },
      {
        name: "Tabata Training",
        beginner: "2 rounds",
        intermediate: "4 rounds",
        advanced: "6 rounds",
        notes: "20s work, 10s rest",
      },
      {
        name: "AMRAP Circuit",
        beginner: "10 minutes",
        intermediate: "15 minutes",
        advanced: "20 minutes",
        notes: "As Many Rounds As Possible",
      },
    ],
  },
  general: {
    fullBody: [
      {
        name: "Squats",
        beginner: "2 sets × 10 reps",
        intermediate: "3 sets × 12 reps",
        advanced: "3 sets × 15 reps",
      },
      {
        name: "Push-ups",
        beginner: "2 sets × 8 reps",
        intermediate: "3 sets × 10 reps",
        advanced: "3 sets × 15 reps",
      },
      {
        name: "Lunges",
        beginner: "2 sets × 8 reps each leg",
        intermediate: "3 sets × 10 reps each leg",
        advanced: "3 sets × 12 reps each leg",
      },
      {
        name: "Plank",
        beginner: "2 sets × 20 seconds",
        intermediate: "2 sets × 40 seconds",
        advanced: "3 sets × 60 seconds",
      },
      {
        name: "Dumbbell Rows",
        beginner: "2 sets × 8 reps",
        intermediate: "3 sets × 10 reps",
        advanced: "3 sets × 12 reps",
        weight: true,
        weightPercentage: 0.15,
      },
    ],
    cardio: [
      {
        name: "Brisk Walking",
        beginner: "20 minutes",
        intermediate: "30 minutes",
        advanced: "45 minutes",
      },
      {
        name: "Cycling",
        beginner: "15 minutes",
        intermediate: "25 minutes",
        advanced: "40 minutes",
      },
      {
        name: "Jumping Jacks",
        beginner: "2 sets × 30 seconds",
        intermediate: "3 sets × 45 seconds",
        advanced: "3 sets × 60 seconds",
      },
    ],
    flexibility: [
      {
        name: "Dynamic Stretching Routine",
        beginner: "5 minutes",
        intermediate: "8 minutes",
        advanced: "10 minutes",
      },
      {
        name: "Yoga Flow",
        beginner: "10 minutes",
        intermediate: "20 minutes",
        advanced: "30 minutes",
      },
      {
        name: "Static Stretching",
        beginner: "5 minutes",
        intermediate: "10 minutes",
        advanced: "15 minutes",
        notes: "Hold each stretch for 20-30 seconds",
      },
    ],
  },
};

// Standard warm-ups and cool-downs
const warmups = [
  "5 minutes of light cardio (walking or jogging in place) followed by dynamic stretches",
  "Jump rope for 3-5 minutes followed by arm circles and leg swings",
  "5 minutes on a stationary bike or elliptical at an easy pace",
  "Dynamic stretching routine focusing on major muscle groups",
];

const cooldowns = [
  "5 minutes of walking followed by static stretching of worked muscle groups",
  "Light yoga stretches focusing on the muscles targeted during the workout",
  "Foam rolling major muscle groups for 5-10 minutes",
  "Gentle mobility exercises and deep breathing",
];

// Helper function to add exercises to a day
const addExercisesToDay = (day, goal, category, count, fitnessLevel) => {
  // Get exercises for this category
  const exercises = exerciseDatabase[goal]?.[category] || [];

  if (exercises.length === 0) return;

  // Select random exercises (ensuring no duplicates)
  const selectedIndices = [];
  const maxExercises = Math.min(count, exercises.length);

  while (selectedIndices.length < maxExercises) {
    const index = Math.floor(Math.random() * exercises.length);
    if (!selectedIndices.includes(index)) {
      selectedIndices.push(index);

      const exercise = exercises[index];
      const sets_reps = exercise[fitnessLevel] || exercise.beginner;

      // Parse the sets and reps
      let sets = "3";
      let reps = "10";

      if (sets_reps.includes("×")) {
        const parts = sets_reps.split("×").map((part) => part.trim());
        sets = parts[0];
        reps = parts[1];
      } else {
        // For cardio exercises that don't have sets × reps format
        reps = sets_reps;
        sets = "1";
      }

      day.exercises.push({
        name: exercise.name,
        sets: sets,
        reps: reps,
        weight: exercise.weight || false,
        weightPercentage: exercise.weightPercentage,
        notes: exercise.notes,
      });
    }
  }
};

// Main function to generate workout plan
const generateWorkoutPlan = (
  weight,
  goal,
  fitnessLevel,
  daysPerWeek,
  limitations
) => {
  const daysCount = parseInt(daysPerWeek);
  const days = [];

  // Create summary based on user inputs
  let summary = `Custom ${fitnessLevel} level workout plan focused on ${goalToText(
    goal
  )}, `;
  summary += `designed for ${daysCount} days per week. `;

  if (limitations) {
    summary += `Plan accounts for your ${limitations} limitation. `;
  }

  // Determine workout split based on goal and available days
  let workoutSplit = [];

  if (goal === "weightLoss") {
    if (daysCount <= 3) {
      workoutSplit = Array(daysCount).fill("fullBody");

      // Add HIIT to one or two days
      if (daysCount >= 2) {
        workoutSplit[1] = "hiit";
      }
      if (daysCount >= 3) {
        workoutSplit[2] = "cardio";
      }
    } else {
      // More than 3 days
      workoutSplit = ["fullBody", "hiit", "fullBody", "cardio"];

      // Add additional days if available
      if (daysCount >= 5) {
        workoutSplit.push("hiit");
      }
      if (daysCount >= 6) {
        workoutSplit.push("fullBody");
      }
    }
  } else if (goal === "muscleGain") {
    if (daysCount <= 3) {
      // Basic full body approach for fewer days
      workoutSplit = Array(daysCount).fill("fullBody");
    } else if (daysCount === 4) {
      // Upper/Lower Split
      workoutSplit = ["upper", "lower", "upper", "lower"];
    } else {
      // Push/Pull/Legs for 5-6 days
      workoutSplit = ["push", "pull", "legs", "push", "pull", "legs"].slice(
        0,
        daysCount
      );
    }
  } else if (goal === "endurance") {
    if (daysCount <= 3) {
      // Basic cardio and circuit approach
      workoutSplit = ["cardio", "circuit", "running"].slice(0, daysCount);
    } else {
      // More varied approach for more days
      workoutSplit = [
        "running",
        "cardio",
        "circuit",
        "running",
        "cardio",
        "circuit",
      ].slice(0, daysCount);
    }
  } else {
    // General fitness - mix of everything
    if (daysCount <= 3) {
      workoutSplit = ["fullBody", "cardio", "flexibility"].slice(0, daysCount);
    } else {
      workoutSplit = [
        "fullBody",
        "cardio",
        "flexibility",
        "fullBody",
        "cardio",
        "flexibility",
      ].slice(0, daysCount);
    }
  }

  // Generate each day's workout
  for (let i = 0; i < daysCount; i++) {
    const dayType = workoutSplit[i];
    let day = {
      focus: "",
      warmup: warmups[Math.floor(Math.random() * warmups.length)],
      exercises: [],
      cooldown: cooldowns[Math.floor(Math.random() * cooldowns.length)],
    };

    // Set focus name based on day type
    switch (dayType) {
      case "fullBody":
        day.focus = "Full Body Training";
        break;
      case "hiit":
        day.focus = "High-Intensity Interval Training";
        break;
      case "cardio":
        day.focus = "Cardiovascular Endurance";
        break;
      case "upper":
        day.focus = "Upper Body Strength";
        break;
      case "lower":
        day.focus = "Lower Body Strength";
        break;
      case "push":
        day.focus = "Push Day (Chest, Shoulders, Triceps)";
        break;
      case "pull":
        day.focus = "Pull Day (Back and Biceps)";
        break;
      case "legs":
        day.focus = "Leg Day";
        break;
      case "running":
        day.focus = "Running Endurance";
        break;
      case "circuit":
        day.focus = "Circuit Training";
        break;
      case "flexibility":
        day.focus = "Flexibility and Mobility";
        break;
      default:
        day.focus = "General Workout";
    }

    // Select exercises based on day type and goal
    if (goal === "weightLoss") {
      if (dayType === "fullBody") {
        // Add 3 full body exercises and 2 cardio
        addExercisesToDay(day, goal, "fullBody", 3, fitnessLevel);
        addExercisesToDay(day, goal, "cardio", 2, fitnessLevel);
      } else if (dayType === "hiit") {
        // Add HIIT workouts
        addExercisesToDay(day, goal, "hiit", 2, fitnessLevel);
        addExercisesToDay(day, goal, "cardio", 1, fitnessLevel);
      } else if (dayType === "cardio") {
        // Add cardio exercises
        addExercisesToDay(day, goal, "cardio", 3, fitnessLevel);
        addExercisesToDay(day, goal, "fullBody", 2, fitnessLevel);
      }
    } else if (goal === "muscleGain") {
      if (dayType === "fullBody") {
        // Full body strength day
        addExercisesToDay(day, goal, "chest", 2, fitnessLevel);
        addExercisesToDay(day, goal, "back", 2, fitnessLevel);
        addExercisesToDay(day, goal, "legs", 2, fitnessLevel);
        addExercisesToDay(day, goal, "core", 1, fitnessLevel);
      } else if (dayType === "upper") {
        // Upper body focus
        addExercisesToDay(day, goal, "chest", 2, fitnessLevel);
        addExercisesToDay(day, goal, "back", 2, fitnessLevel);
        addExercisesToDay(day, goal, "arms", 2, fitnessLevel);
        addExercisesToDay(day, goal, "shoulders", 1, fitnessLevel);
      } else if (dayType === "lower") {
        // Lower body focus
        addExercisesToDay(day, goal, "legs", 4, fitnessLevel);
        addExercisesToDay(day, goal, "core", 2, fitnessLevel);
      } else if (dayType === "push") {
        // Push muscles
        addExercisesToDay(day, goal, "chest", 3, fitnessLevel);
        addExercisesToDay(day, goal, "shoulders", 2, fitnessLevel);
        addExercisesToDay(day, goal, "arms", 1, fitnessLevel); // Triceps focus
      } else if (dayType === "pull") {
        // Pull muscles
        addExercisesToDay(day, goal, "back", 3, fitnessLevel);
        addExercisesToDay(day, goal, "arms", 2, fitnessLevel); // Biceps focus
        addExercisesToDay(day, goal, "core", 1, fitnessLevel);
      } else if (dayType === "legs") {
        // Leg day
        addExercisesToDay(day, goal, "legs", 5, fitnessLevel);
        addExercisesToDay(day, goal, "core", 1, fitnessLevel);
      }
    } else if (goal === "endurance") {
      if (dayType === "running") {
        addExercisesToDay(day, goal, "running", 2, fitnessLevel);
      } else if (dayType === "cardio") {
        addExercisesToDay(day, goal, "cardio", 2, fitnessLevel);
      } else if (dayType === "circuit") {
        addExercisesToDay(day, goal, "circuit", 2, fitnessLevel);
      }
    } else {
      // General fitness
      if (dayType === "fullBody") {
        addExercisesToDay(day, goal, "fullBody", 4, fitnessLevel);
      } else if (dayType === "cardio") {
        addExercisesToDay(day, goal, "cardio", 2, fitnessLevel);
      } else if (dayType === "flexibility") {
        addExercisesToDay(day, goal, "flexibility", 3, fitnessLevel);
      }
    }

    // Add the day to our plan
    days.push(day);
  }

  // Format the workout plan to match the API response structure
  return {
    summary,
    workoutDays: days.map((day, index) => {
      const dayNames = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ];
      return {
        day: dayNames[index],
        focus: day.focus,
        warmup: day.warmup,
        exercises: day.exercises.map((exercise) => ({
          name: exercise.name,
          sets: exercise.sets,
          reps: exercise.reps,
          weight: exercise.weight
            ? calculateWeight(weight, exercise.weightPercentage)
            : "bodyweight",
          notes: exercise.notes || "",
        })),
        cooldown: day.cooldown,
      };
    }),
  };
};

// Helper function to calculate weight based on user's weight and percentage
const calculateWeight = (userWeight, percentage) => {
  if (!userWeight || !percentage) return "moderate";

  const weightInLbs = parseFloat(userWeight);
  if (isNaN(weightInLbs)) return "moderate";

  const calculatedWeight = Math.round(weightInLbs * percentage);
  return `${calculatedWeight} lbs`;
};

// Export the generator function
export default generateWorkoutPlan;
