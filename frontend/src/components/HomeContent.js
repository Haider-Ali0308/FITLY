import React from "react";
import Footer from "./Footer";

const HomeContent = () => {
  return (
    <div className="mx-auto p-3 md:p-5">
      {/* Header Section */}
      <div className="mb-4 text-center">
        <h1 className="text-white text-3xl font-bold">
          The Tools for Your Goals
        </h1>
        <p className="text-white mt-2">
          Trying to lose weight, tone up, lower your BMI, or invest in your
          overall health? We give you the right features to get there.
        </p>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded shadow p-4">
          <h2 className="text-white text-xl font-semibold mb-2">
            Learn. Track. Improve.
          </h2>
          <p className="text-white">
            Keeping a food diary helps you understand your habits and to hit
            your goals.
          </p>
        </div>
        <div className="bg-gray-800 rounded shadow p-4">
          <h2 className="text-white text-xl font-semibold mb-2">
            Logging Simplified.
          </h2>
          <p className="text-white">
            Save meals and use Quick Tools for fast and easy food tracking.
          </p>
        </div>
        <div className="bg-gray-800 rounded shadow p-4">
          <h2 className="text-white text-xl font-semibold mb-2">
            Stay Motivated.
          </h2>
          <p className="text-white">
            Join the World's Largest Fitness Community for advice, tips, and
            support 24/7.
          </p>
        </div>
      </div>

      {/* Final Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-4 mt-8">
        <div>
          <h1 className="text-white text-3xl font-bold">
            Start your fitness journey today!
          </h1>
          <p className="text-white mt-2">
            Sign up for Shape Up and get started on your path to a healthier
            lifestyle.
          </p>
        </div>
        <div>
          <img
            src="https://landkit.goodthemes.co/assets/img/illustrations/illustration-2.png"
            alt="Banner"
            className="w-full h-auto"
          />
        </div>
      </div>
      <div className="mt-5">
        <Footer />
      </div>
    </div>
  );
};

export default HomeContent;
