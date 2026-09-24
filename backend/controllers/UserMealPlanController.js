import asyncHandler from "express-async-handler";
import MealPlan from "../models/UserMealPlanModel.js";
import User from "../models/userModel.js";
import { generateContent } from "../utils/geminiService.js";

// @desc    Generate a meal plan using Gemini AI
// @route   POST /api/meals/generate
// @access  Public
const generateMealPlan = asyncHandler(async (req, res) => {
  const {
    weight,
    height,
    age,
    gender,
    dietaryPreference,
    allergies,
    fitnessGoal,
    mealsPerDay,
    calorieTarget,
  } = req.body;

  try {
    // Calculate BMR (Basal Metabolic Rate) using the Harris-Benedict equation
    let bmr;
    if (gender === "male") {
      bmr =
        88.362 +
        13.397 * parseInt(weight) +
        4.799 * parseInt(height) -
        5.677 * parseInt(age);
    } else {
      bmr =
        447.593 +
        9.247 * parseInt(weight) +
        3.098 * parseInt(height) -
        4.33 * parseInt(age);
    }

    // Adjust calories based on fitness goal
    let calculatedCalories;
    switch (fitnessGoal) {
      case "weight-loss":
        calculatedCalories = Math.round(bmr * 0.8);
        break;
      case "muscle-gain":
        calculatedCalories = Math.round(bmr * 1.15);
        break;
      case "maintenance":
        calculatedCalories = Math.round(bmr);
        break;
      case "athletic-performance":
        calculatedCalories = Math.round(bmr * 1.2);
        break;
      default:
        calculatedCalories = Math.round(bmr);
    }

    // Use user-provided calorie target if specified
    const targetCalories = calorieTarget
      ? parseInt(calorieTarget)
      : calculatedCalories;

    // Construct prompt for Gemini
    const prompt = `Generate a detailed meal plan with ${mealsPerDay} meals for a ${gender} who weighs ${weight}kg, is ${height}cm tall, ${age} years old, following a ${dietaryPreference} diet with a fitness goal of ${fitnessGoal}. ${
      allergies ? `They have allergies or restrictions for: ${allergies}.` : ""
    } The daily calorie target is approximately ${targetCalories} calories.

    Please structure the response in JSON format with the following structure:
    {
      "summary": "A brief overview of the meal plan",
      "nutritionSummary": {
        "calories": "total daily calories",
        "protein": "total daily protein in grams",
        "carbs": "total daily carbs in grams",
        "fat": "total daily fat in grams"
      },
      "meals": [
        {
          "name": "Meal name (e.g., Breakfast)",
          "foods": [
            {
              "name": "Food item name",
              "amount": "Portion size",
              "calories": "Calories for this item",
              "description": "Brief preparation instructions or notes"
            }
          ],
          "calories": "Total calories for this meal",
          "protein": "Protein in grams for this meal",
          "carbs": "Carbs in grams for this meal",
          "fat": "Fat in grams for this meal"
        }
      ],
      "tips": [
        "Nutritional tip 1",
        "Meal prep tip 2",
        "etc."
      ]
    }

    Make sure all meals align with the dietary preference and avoid any allergens mentioned. Focus on whole foods that are accessible.`;

    // Call Gemini API
    const aiResponse = await generateContent(prompt);

    // Parse response - handle possible formatting issues
    let mealPlanData;
    try {
      mealPlanData = JSON.parse(aiResponse);
    } catch (parseError) {
      // If JSON parsing fails, try to extract JSON from text response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        mealPlanData = JSON.parse(jsonMatch[0]);
      } else {
        // If still failing, use fallback data
        mealPlanData = createFallbackMealPlan(
          mealsPerDay,
          dietaryPreference,
          fitnessGoal,
          targetCalories
        );
      }
    }

    res.json({ mealPlan: mealPlanData });
  } catch (error) {
    console.error("Error generating meal plan with AI:", error);
    res.status(500);
    throw new Error("Failed to generate meal plan");
  }
});

// @desc    Save a meal plan
// @route   POST /api/meals/save
// @access  Private
const saveMealPlan = asyncHandler(async (req, res) => {
  const { 
    userId, 
    planName, 
    planData, 
    userInputs,
    date = new Date().toISOString().split('T')[0] // Default to current date if not provided
  } = req.body;

  // Verify user exists
  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Check if a meal plan for this plan name already exists
  const existingPlan = await MealPlan.findOne({
    user: userId,
    planName: planName,
  });

  if (existingPlan) {
    // Update existing plan
    existingPlan.planData = planData;
    existingPlan.userData = userInputs;
    existingPlan.planName = planName;

    const updatedPlan = await existingPlan.save();
    res.json(updatedPlan);
  } else {
    // Create and save new meal plan
    const mealPlan = new MealPlan({
      user: userId,
      planName: planName,
      date: date,
      planData,
      userData: userInputs,
    });

    const savedPlan = await mealPlan.save();
    res.status(201).json(savedPlan);
  }
});

// @desc    Get all saved meal plans for a user
// @route   GET /api/meals/saved
// @access  Private
const getSavedMealPlans = asyncHandler(async (req, res) => {
  const mealPlans = await MealPlan.find({ user: req.user._id }).sort({
    date: -1,
  });

  res.json(mealPlans);
});

// @desc    Get a specific meal plan by date
// @route   GET /api/meals/:date
// @access  Private
const getMealPlanByDate = asyncHandler(async (req, res) => {
  const mealPlan = await MealPlan.findOne({
    user: req.user._id,
    date: req.params.date,
  });

  if (mealPlan) {
    res.json(mealPlan);
  } else {
    res.status(404);
    throw new Error("Meal plan not found");
  }
});

// @desc    Delete a meal plan
// @route   DELETE /api/meals/:id
// @access  Private
const deleteMealPlan = asyncHandler(async (req, res) => {
  const mealPlan = await MealPlan.findById(req.params.id);

  if (mealPlan && mealPlan.user.toString() === req.user._id.toString()) {
    await mealPlan.deleteOne();
    res.json({ message: "Meal plan removed" });
  } else {
    res.status(404);
    throw new Error("Meal plan not found");
  }
});

// Helper function to create fallback meal plan if AI parsing fails
function createFallbackMealPlan(
  mealsPerDay,
  dietaryPreference,
  fitnessGoal,
  calories
) {
  const mealNames = [
    "Breakfast",
    "Lunch",
    "Dinner",
    "Snack 1",
    "Snack 2",
    "Snack 3",
  ];

  // Create basic meals structure
  const meals = [];
  for (let i = 0; i < parseInt(mealsPerDay); i++) {
    meals.push({
      name: mealNames[i],
      foods: [
        {
          name: "Placeholder food item",
          amount: "1 serving",
          calories: Math.round(calories / parseInt(mealsPerDay)),
          description: "See nutrition details below.",
        },
      ],
      calories: Math.round(calories / parseInt(mealsPerDay)),
      protein: Math.round((calories * 0.3) / 4 / parseInt(mealsPerDay)),
      carbs: Math.round((calories * 0.4) / 4 / parseInt(mealsPerDay)),
      fat: Math.round((calories * 0.3) / 9 / parseInt(mealsPerDay)),
    });
  }

  // Calculate default macros
  let protein, carbs, fat;
  switch (fitnessGoal) {
    case "weight-loss":
      protein = Math.round((calories * 0.35) / 4);
      carbs = Math.round((calories * 0.4) / 4);
      fat = Math.round((calories * 0.25) / 9);
      break;
    case "muscle-gain":
      protein = Math.round((calories * 0.3) / 4);
      carbs = Math.round((calories * 0.5) / 4);
      fat = Math.round((calories * 0.2) / 9);
      break;
    default:
      protein = Math.round((calories * 0.25) / 4);
      carbs = Math.round((calories * 0.5) / 4);
      fat = Math.round((calories * 0.25) / 9);
  }

  return {
    summary: `${mealsPerDay}-meal plan for ${fitnessGoal} with ${dietaryPreference} preference`,
    nutritionSummary: {
      calories: `${calories} kcal`,
      protein: `${protein}g`,
      carbs: `${carbs}g`,
      fat: `${fat}g`,
    },
    meals: meals,
    tips: [
      "Stay well hydrated by drinking at least 8 glasses of water daily.",
      "Try to eat at consistent times each day to regulate hunger.",
      "Prepare meals in advance to help stick to your plan.",
      "Focus on whole foods rather than processed options.",
    ],
  };
}

export {
  generateMealPlan,
  saveMealPlan,
  getSavedMealPlans,
  getMealPlanByDate,
  deleteMealPlan,
};
