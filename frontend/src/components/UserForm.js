import React from "react";

const UserForm = ({
  userData,
  handleInputChange,
  generateWorkoutPlan,
  isGenerating,
  handleDaySelect,
}) => {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <form>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Weight *
          </label>
          <div className="relative">
            <input
              type="text"
              name="weight"
              value={userData.weight}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              placeholder="70 kg / 155 lbs"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Height *
          </label>
          <div className="relative">
            <input
              type="text"
              name="height"
              value={userData.height}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Fitness Goal *
        </label>
        <select
          name="goal"
          value={userData.goal}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="">Select a goal</option>
          <option value="Weight Loss">Weight Loss</option>
          <option value="Muscle Gain">Muscle Gain</option>
          <option value="Strength Training">Strength Training</option>
          <option value="General Fitness">General Fitness</option>
          <option value="Endurance">Endurance</option>
        </select>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Fitness Level *
        </label>
        <select
          name="fitnessLevel"
          value={userData.fitnessLevel}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="">Select your level</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select Workout Days *
        </label>
        <div className="flex flex-wrap gap-2">
          {days.map((day) => (
            <div key={day} className="flex items-center">
              <input
                type="checkbox"
                id={day}
                name={day}
                checked={userData.selectedDays?.includes(day)}
                onChange={(e) => handleDaySelect(day, e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor={day} className="ml-2 text-sm text-gray-700">
                {day}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Limitations or Injuries
        </label>
        <textarea
          name="limitations"
          value={userData.limitations}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
          placeholder="Any physical limitations or injuries (leave blank if none)"
          rows="2"
        ></textarea>
      </div>

      <div className="mt-5">
        <button
          type="button"
          onClick={generateWorkoutPlan}
          disabled={isGenerating}
          className="w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-teal-500 text-white font-medium rounded-lg hover:from-blue-700 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300"
        >
          {isGenerating ? "Generating Plan..." : "Generate Your Workout Plan"}
        </button>
      </div>
    </form>
  );
};

export default UserForm;
