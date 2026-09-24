import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import UserForm from "../components/UserForm";
import WorkoutPlan from "../components/WorkoutPlans";
import Tips from "../components/Tips";
import ThinkingAnimation from "../components/ThinkingAnimation";
import Header from "../components/Header";
import UserModal from "../components/UserModal";

const ExercisePlanner = () => {
  const [userData, setUserData] = useState({
    weight: "",
    height: "",
    goal: "",
    fitnessLevel: "",
    selectedDays: [],
    limitations: "",
  });

  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const { userInfo } = useSelector((state) => state.auth);

  const resultsRef = useRef(null);

  useEffect(() => {
    if (location.state?.loadedPlan && location.state?.loadedUserData) {
      setWorkoutPlan(location.state.loadedPlan);
      setUserData(location.state.loadedUserData);
      setIsRevealing(true);
      toast.success("Exercise plan loaded successfully!");

      // Clear the state to prevent reloading on subsequent renders
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  // Add effect to scroll to results when workout plan is generated
  useEffect(() => {
    if (workoutPlan && !isThinking && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [workoutPlan, isThinking]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  // New function to handle day selection
  const handleDaySelect = (day, isSelected) => {
    if (isSelected) {
      setUserData({
        ...userData,
        selectedDays: [...userData.selectedDays, day],
      });
    } else {
      setUserData({
        ...userData,
        selectedDays: userData.selectedDays.filter((d) => d !== day),
      });
    }
  };

  const generateWorkoutPlan = async () => {
    // Validate inputs
    if (
      !userData.weight ||
      !userData.height ||
      !userData.goal ||
      !userData.fitnessLevel ||
      userData.selectedDays.length === 0 // Check if any days are selected
    ) {
      toast.error(
        "Please fill all required fields and select at least one day"
      );
      return;
    }

    // Start thinking phase and API call
    setIsThinking(true);
    setIsGenerating(true);

    // Sort days according to natural week order
    const weekOrder = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    const sortedSelectedDays = userData.selectedDays.sort(
      (a, b) => weekOrder.indexOf(a) - weekOrder.indexOf(b)
    );

    // Create payload with sorted selected days
    const payload = {
      ...userData,
      daysPerWeek: userData.selectedDays.length,
      selectedDays: sortedSelectedDays,
    };

    const apiPromise = axios.post("/api/workouts/generate", payload);
    const timerPromise = new Promise((resolve) => setTimeout(resolve, 5000));

    try {
      const [response] = await Promise.all([apiPromise, timerPromise]);

      // Ensure the response data has the expected structure
      const planData = response.data;

      // Create a default structure if any part is missing
      const sanitizedPlan = {
        summary:
          planData.summary ||
          `${userData.selectedDays.length} day ${userData.goal} plan`,
        workoutDays: Array.isArray(planData.workoutDays)
          ? planData.workoutDays
          : [],
        tips: Array.isArray(planData.tips) ? planData.tips : [],
        planType: "Exercise Plan", // Add plan type identifier
        planName: `${userData.selectedDays.length}-Day ${userData.goal
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase())} ${
          userData.fitnessLevel.charAt(0).toUpperCase() +
          userData.fitnessLevel.slice(1)
        } Plan`,
      };

      // If workoutDays is empty, create placeholder days
      if (sanitizedPlan.workoutDays.length === 0) {
        for (let i = 0; i < userData.selectedDays.length; i++) {
          sanitizedPlan.workoutDays.push({
            day: userData.selectedDays[i],
            focus: "General Workout",
            exercises: [],
          });
        }
      }

      setWorkoutPlan(sanitizedPlan);
      setIsThinking(false);
      setIsRevealing(true);
      setIsGenerating(false);

      toast.success("Workout plan generated successfully!");
    } catch (error) {
      console.error("Error generating workout plan:", error);
      toast.error("Failed to generate workout plan. Please try again.");
      setIsThinking(false);
      setIsGenerating(false);
    }
  };

  const handleSaveClick = () => {
    if (!userInfo) {
      toast.info("Please login to save your workout plan");
      return;
    }

    if (!workoutPlan) {
      toast.error("No workout plan to save");
      return;
    }

    setShowModal(true);
  };

  const handleViewSavedPlans = () => {
    if (!userInfo) {
      toast.info("Please login to view your saved plans");
      return;
    }

    // Navigate to the SavedPlansPage with workout tab active and filter for Exercise Plans only
    navigate("/saved-plans?tab=workout&planType=Exercise Plan");
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handlePlanSaved = (savedPlan) => {
    // You can update the current workout plan with the saved version if needed
    if (savedPlan && savedPlan.planData) {
      setWorkoutPlan(savedPlan.planData);
    }
  };

  return (
    <div className="bg-gray-50">
      <Header />
      <ToastContainer position="top-right" autoClose={5000} />

      {/* Thinking Animation Overlay */}
      {isThinking && <ThinkingAnimation />}

      {/* User Modal for Saving and Viewing Plans */}
      <UserModal
        show={showModal}
        handleClose={handleModalClose}
        workoutPlan={workoutPlan}
        userData={userData}
        onSave={handlePlanSaved}
        planTypeFilter="Exercise Plan" // Pass the plan type filter
      />

      {/* Header - Reduced padding */}
      <header className="bg-gradient-to-r from-blue-600 to-teal-500 text-white py-6 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-2xl md:text-3xl font-bold mb-1">
            AI Exercise Planner
          </h1>
          <p className="text-base md:text-lg opacity-90">
            Customized workout plans powered by AI
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* User Input Form - Made more compact */}
        <div className="bg-white rounded-lg shadow-md p-5 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-3 md:mb-0">
              Create Your Personalized Workout Plan
            </h2>
            {userInfo && (
              <button
                onClick={handleViewSavedPlans}
                className="px-4 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
              >
                View Your Saved Plans
              </button>
            )}
          </div>
          <UserForm
            userData={userData}
            handleInputChange={handleInputChange}
            generateWorkoutPlan={generateWorkoutPlan}
            isGenerating={isGenerating}
            handleDaySelect={handleDaySelect}
          />
        </div>

        {/* Results Section - With ref for scrolling */}
        {workoutPlan && !isThinking && (
          <div ref={resultsRef}>
            <div className="bg-white rounded-lg shadow-md p-5 mb-6">
              <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                <div className="mb-3 md:mb-0">
                  <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                    {workoutPlan.planType}: {workoutPlan.planName}
                  </h2>
                  <p className="text-sm text-gray-600">
                    Your AI-Generated Workout Plan
                  </p>
                </div>
                <button
                  onClick={handleSaveClick}
                  className="px-4 py-1.5 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition duration-300"
                >
                  Save Plan
                </button>
              </div>
              <WorkoutPlan
                plan={workoutPlan}
                userWeight={userData.weight}
                isRevealing={isRevealing}
              />
            </div>

            <div className="bg-teal-50 border-l-4 border-teal-500 rounded-lg shadow-md p-5">
              <h2 className="text-lg md:text-xl font-semibold text-teal-600 mb-3">
                AI-Recommended Tips For Success
              </h2>
              <Tips tips={workoutPlan.tips || []} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExercisePlanner;
