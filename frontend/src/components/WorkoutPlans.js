import React, { useState, useEffect } from "react";

const WorkoutPlan = ({ plan, userWeight, isRevealing }) => {
  const [revealIndex, setRevealIndex] = useState(0);
  const [fullyRevealed, setFullyRevealed] = useState(false);

  // For the reveal animation effect
  useEffect(() => {
    if (!isRevealing) {
      setFullyRevealed(true);
      return;
    }

    // Check if plan and workoutDays exist before accessing length
    if (plan && plan.workoutDays && revealIndex < plan.workoutDays.length) {
      const timer = setTimeout(() => {
        setRevealIndex(revealIndex + 1);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setFullyRevealed(true);
    }
  }, [revealIndex, plan, isRevealing]);

  // Early return if plan or workoutDays is undefined
  if (!plan || !plan.workoutDays) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">
          Workout plan data is incomplete or not available.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Plan Summary */}
      <div className="mb-6 pb-4 border-b border-gray-200">
        <h3 className="text-xl font-semibold mb-2 text-gray-800">
          {plan.summary || "Workout Plan"}
        </h3>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            {userWeight}
          </span>
        </div>
      </div>

      {/* Workout Days */}
      <div className="space-y-6">
        {plan.workoutDays.map((day, index) => (
          <div
            key={index}
            className={`bg-white rounded-lg p-5 border-l-4 transform transition-all duration-300 ${
              index < revealIndex || fullyRevealed
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            } ${
              day.focus && day.focus.toLowerCase().includes("upper")
                ? "border-blue-500"
                : day.focus && day.focus.toLowerCase().includes("lower")
                ? "border-green-500"
                : day.focus && day.focus.toLowerCase().includes("full")
                ? "border-purple-500"
                : day.focus && day.focus.toLowerCase().includes("cardio")
                ? "border-red-500"
                : day.focus && day.focus.toLowerCase().includes("core")
                ? "border-yellow-500"
                : day.focus && day.focus.toLowerCase().includes("rest")
                ? "border-gray-500"
                : "border-indigo-500"
            }`}
          >
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {day.day || `Day ${index + 1}`}
              </h3>
              <span className="inline-block px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                {day.focus || "Workout"}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Exercise
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sets
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reps
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Weight
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* Check if exercises array exists before mapping */}
                  {day.exercises && day.exercises.length > 0 ? (
                    day.exercises.map((exercise, idx) => (
                      <tr key={idx}>
                        <td className="px-3 py-3 text-sm font-medium text-gray-900">
                          {exercise.name || "Exercise"}
                        </td>
                        <td className="px-3 py-3 text-sm text-gray-700">
                          {exercise.sets || "-"}
                        </td>
                        <td className="px-3 py-3 text-sm text-gray-700">
                          {exercise.reps || "-"}
                        </td>
                        <td className="px-3 py-3 text-sm text-gray-700">
                          {exercise.weight || "-"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-3 py-3 text-sm text-center text-gray-500"
                      >
                        No exercises specified
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkoutPlan;
