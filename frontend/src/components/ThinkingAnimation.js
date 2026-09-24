import React from "react";

const ThinkingAnimation = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 shadow-xl max-w-md w-full text-center">
        <div className="mb-4">
          <div className="inline-block animate-pulse">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-teal-500 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-teal-500 rounded-full animate-bounce delay-75"></div>
              <div className="w-3 h-3 bg-teal-500 rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Creating Your Workout Plan
        </h3>
        <p className="text-gray-600">
          Our AI is designing a personalized workout plan based on your fitness
          goals and preferences...
        </p>
      </div>
    </div>
  );
};

export default ThinkingAnimation;
