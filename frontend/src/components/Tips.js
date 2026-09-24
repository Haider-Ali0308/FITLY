import React from "react";

const Tips = ({ tips }) => {
  const defaultTips = [
    "Stay consistent with your routine for best results.",
    "Focus on proper form rather than lifting heavier weights.",
    "Ensure adequate rest between workout days to allow for recovery.",
  ];

  const tipsToDisplay = tips && tips.length > 0 ? tips : defaultTips;

  return (
    <div className="space-y-3">
      {tipsToDisplay.map((tip, index) => (
        <div key={index} className="flex items-start">
          <div className="flex-shrink-0 mt-1">
            <svg
              className="h-5 w-5 text-teal-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <p className="ml-3 text-gray-700">{tip}</p>
        </div>
      ))}
    </div>
  );
};

export default Tips;
