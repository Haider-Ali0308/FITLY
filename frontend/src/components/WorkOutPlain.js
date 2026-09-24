import React from "react";

const WorkoutPlan = ({ plan, userWeight, isRevealing }) => {
  return (
    <div className={isRevealing ? "reveal" : ""}>
      {plan.days.map((day, index) => (
        <div
          key={index}
          className="day mb-4"
          style={{ animationDelay: `${index * 0.5}s` }}
        >
          <h3 className="text-lg md:text-xl font-semibold text-teal-600 mb-2">
            {day.name}
          </h3>
          <ul className="list-disc pl-5 text-gray-700">
            {day.exercises.map((exercise, exIndex) => (
              <li key={exIndex} className="mb-1">
                {exercise}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default WorkoutPlan;
