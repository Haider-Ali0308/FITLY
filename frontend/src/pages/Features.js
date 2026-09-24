import React from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";

// Import icons from react-icons
import {
  FaUtensils,
  FaDumbbell,
  FaRobot,
  FaWater,
  FaCalculator,
  FaDatabase,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";

// Feature card component updated to use Tailwind with new color scheme
const FeatureCard = ({ title, description, link, icon }) => {
  return (
    <div className="h-full mb-4 text-center bg-[#1a1d2d] rounded-xl border border-[#7e57c2] shadow-lg transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-xl">
      <div className="p-4 flex flex-col h-full">
        {icon && (
          <div className="text-center mb-3">
            {React.cloneElement(icon, {
              size: 56,
              className: "mb-4 text-[#9c27b0] mx-auto filter drop-shadow-lg",
            })}
          </div>
        )}
        <div className="h-[3px] w-10 bg-[#9c27b0] mx-auto mb-5 rounded"></div>
        <h3 className="mt-2 mb-3 text-white font-semibold text-xl">{title}</h3>
        <p className="text-[#b4a9d6] flex-1 text-sm mb-5">{description}</p>
        <Link
          to={link}
          className="inline-block mt-auto bg-[#7e57c2] border-none rounded-lg px-5 py-2.5 font-medium text-white transition-all duration-300 uppercase text-xs tracking-wider hover:bg-[#9c27b0] hover:scale-105"
        >
          Learn More
        </Link>
      </div>
    </div>
  );
};

const FeaturesPage = () => {
  // Rearranged features with Dashboard first and Create Account removed
  const features = [
    {
      title: "Dashboard",
      description:
        "Access all your fitness metrics, progress tracking, and personalized recommendations in one centralized dashboard.",
      link: "/pages/dashboard",
      icon: <MdDashboard />,
    },
    {
      title: "Exercise Planner",
      description:
        "Let our AI plan exercises tailored to your weight and fitness goals. Create customized workout plans that suit you.",
      link: "/pages/exercise-planner",
      icon: <FaDumbbell />,
    },
     {
      title: "Meal Planner",
      description:
        "The Meal Planner helps you plan your meals for the day—a great way to save time, money, and eat healthier!",
      link: "/pages/profile/meal-plan",
      icon: <FaUtensils />,
    },
    {
      title: "Workout Database",
      description:
        "Our workout database is a comprehensive resource for anyone looking to improve their fitness. Find the perfect routine to target your specific goals.",
      link: "/pages/workouts",
      icon: <FaDatabase />,
    },
    {
      title: "Nutrition Checker",
      description:
        "With Nutrition Checker, you can quickly and easily see the nutritional value of any food, including calories, fat, protein, carbohydrates.",
      link: "/pages/nutrition-checker",
      icon: <FaCalculator />,
    },
    {
      title: "BMR Calculator",
      description:
        "Calculate your Basal Metabolic Rate (BMR) to determine your daily calorie needs. Get insights into your metabolism.",
      link: "/pages/bmr-calculator",
      icon: <FaCalculator />,
    },
   
    
    
    {
      title: "AI ChatBot",
      description:
        "Get instant fitness advice, workout tips, and nutrition guidance from our smart AI assistant, customized for your journey.",
      link: "/pages/Ai",
      icon: <FaRobot />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0f111d] text-white bg-[radial-gradient(circle_at_50%_50%,#1a1d2d_0%,#0f111d_100%)]">
      <Header />
      <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 inline-block relative drop-shadow-lg">
            FITNESS HYPER
            <span className="text-[#9c27b0] relative drop-shadow-xl">
              {" "}
              FEATURES
            </span>
          </h1>
          <p className="text-[#b4a9d6] max-w-2xl mx-auto">
            Transform your fitness journey with our powerful tools designed to
            help you achieve your goals.
          </p>
          <div className="h-1 w-20 bg-gradient-to-r from-[#7e57c2] to-[#9c27b0] mx-auto my-6 rounded shadow-md"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
          {features.map((feature, index) => (
            <div key={index}>
              <FeatureCard
                title={feature.title}
                description={feature.description}
                link={feature.link}
                icon={feature.icon}
              />
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FeaturesPage;