import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-500"></div>
      <p className="mt-4 text-gray-600">
        Generating your personalized workout plan...
      </p>
    </div>
  );
};

export default LoadingSpinner;
