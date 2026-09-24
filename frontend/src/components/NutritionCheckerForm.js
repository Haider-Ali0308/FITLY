import React, { useState } from "react";
import axios from "axios";

const NutritionCheckerForm = () => {
  const [foodItem, setFoodItem] = useState("");
  const [nutritionResult, setNutritionResult] = useState(null);

  const handleSearchNutrition = async (e) => {
    try {
      const response = await axios.get(
        `https://api.calorieninjas.com/v1/nutrition?query=${encodeURIComponent(
          foodItem
        )}`,
        {
          headers: {
            "X-Api-Key": "WOO23cTA4ww2yrQ+otISmw==Z3Q2fFBcCTeE3OWj",
          },
        }
      );

      const data = response.data;

      if (data.items.length > 0) {
        setNutritionResult(data.items[0]);
      } else {
        alert("No nutrition information found for that food item");
      }
    } catch (error) {
      console.error("Error fetching nutrition information:", error);
    }
  };

  return (
    <div className="container mx-auto my-12 px-4 text-white">
      <div className="flex justify-center">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-white text-center">
            Nutrition Information Search
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearchNutrition();
            }}
            className="flex flex-col"
          >
            <input
              type="text"
              value={foodItem}
              onChange={(e) => setFoodItem(e.target.value)}
              placeholder="Enter food item"
              className="px-4 py-2 rounded mb-3 text-gray-800"
            />
            <button
              type="button"
              className="bg-transparent hover:bg-green-500 text-green-500 hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded mb-6"
              onClick={handleSearchNutrition}
            >
              Get Nutrition
            </button>
          </form>
        </div>
      </div>

      {nutritionResult && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4 text-white">
            Nutrition Results
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white bg-opacity-10 border border-gray-600 rounded-lg">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Serving Size</th>
                  <th className="px-4 py-2 text-left">Calories</th>
                  <th className="px-4 py-2 text-left">Total Fat</th>
                  <th className="px-4 py-2 text-left">Saturated Fat</th>
                  <th className="px-4 py-2 text-left">Cholesterol</th>
                  <th className="px-4 py-2 text-left">Sodium</th>
                  <th className="px-4 py-2 text-left">Carbohydrates</th>
                  <th className="px-4 py-2 text-left">Fiber</th>
                  <th className="px-4 py-2 text-left">Sugar</th>
                  <th className="px-4 py-2 text-left">Protein</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-700">
                  <td className="px-4 py-2 border-b border-gray-600">
                    {nutritionResult.name}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-600">100g</td>
                  <td className="px-4 py-2 border-b border-gray-600">
                    {nutritionResult.calories}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-600">
                    {nutritionResult.fat_total_g}g
                  </td>
                  <td className="px-4 py-2 border-b border-gray-600">
                    {nutritionResult.fat_saturated_g}g
                  </td>
                  <td className="px-4 py-2 border-b border-gray-600">
                    {nutritionResult.cholesterol_mg}mg
                  </td>
                  <td className="px-4 py-2 border-b border-gray-600">
                    {nutritionResult.sodium_mg}mg
                  </td>
                  <td className="px-4 py-2 border-b border-gray-600">
                    {nutritionResult.carbohydrates_total_g}g
                  </td>
                  <td className="px-4 py-2 border-b border-gray-600">
                    {nutritionResult.fiber_g}g
                  </td>
                  <td className="px-4 py-2 border-b border-gray-600">
                    {nutritionResult.sugar_g}g
                  </td>
                  <td className="px-4 py-2 border-b border-gray-600">
                    {nutritionResult.protein_g}g
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default NutritionCheckerForm;
