import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import Header from "../components/Header";
import ThinkingAnimation from "../components/ThinkingAnimation";

const SavedPlans = () => {
  const [activeTab, setActiveTab] = useState("exercise"); // Default tab
  const [savedPlans, setSavedPlans] = useState([]);
  const [savedMeals, setSavedMeals] = useState([]); // State for meal plans
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [workoutStatuses, setWorkoutStatuses] = useState({});
  const navigate = useNavigate();

  // Get user from Redux store
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    // Redirect if not logged in
    if (!userInfo) {
      navigate("/pages/login");
      return;
    }

    fetchSavedPlans();
    fetchSavedMeals(); // Fetch meal plans
  }, [userInfo, navigate]);

  const fetchSavedPlans = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/workouts/saved");
      const plans = response.data;

      // Initialize workout statuses
      const initialStatuses = {};
      plans.forEach((plan) => {
        if (plan.planData?.workoutDays) {
          const dayStatuses = {};
          plan.planData.workoutDays.forEach((day, index) => {
            dayStatuses[index] = plan.progress?.[index] || "notStarted";
          });
          initialStatuses[plan._id] = dayStatuses;
        }
      });

      setWorkoutStatuses(initialStatuses);
      setSavedPlans(plans);
    } catch (error) {
      console.error("Error fetching saved plans:", error);
      toast.error("Failed to load your saved plans");
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedMeals = async () => {
    try {
      const response = await axios.get("/api/meals/saved");
      setSavedMeals(response.data);
    } catch (error) {
      console.error("Error fetching saved meals:", error);
      toast.error("Failed to load your saved meals");
    }
  };

  const handleDeletePlan = async (planId) => {
    if (window.confirm("Are you sure you want to delete this plan?")) {
      setIsDeleting(true);
      try {
        await axios.delete(`/api/workouts/${planId}`);
        setSavedPlans(savedPlans.filter((plan) => plan._id !== planId));
        toast.success("Plan deleted successfully");
        setIsDeleting(false);
      } catch (error) {
        console.error("Error deleting plan:", error);
        toast.error("Failed to delete plan");
        setIsDeleting(false);
      }
    }
  };

  const handleDeleteMeal = async (mealId) => {
    if (window.confirm("Are you sure you want to delete this meal plan?")) {
      setIsDeleting(true);
      try {
        await axios.delete(`/api/meals/${mealId}`);
        setSavedMeals(savedMeals.filter((meal) => meal._id !== mealId));
        toast.success("Meal plan deleted successfully");
        setIsDeleting(false);
      } catch (error) {
        console.error("Error deleting meal plan:", error);
        toast.error("Failed to delete meal plan");
        setIsDeleting(false);
      }
    }
  };

  const handleStartWorkout = async (planId, dayIndex) => {
    try {
      setWorkoutStatuses((prev) => ({
        ...prev,
        [planId]: {
          ...prev[planId],
          [dayIndex]: "inProgress",
        },
      }));
      await axios.post(`/api/workouts/${planId}/start`, { dayIndex });
      toast.success("Workout started!");
    } catch (error) {
      console.error("Error starting workout:", error);
      toast.error("Failed to start workout");
      setWorkoutStatuses((prev) => ({
        ...prev,
        [planId]: {
          ...prev[planId],
          [dayIndex]: "notStarted",
        },
      }));
    }
  };

  const handleSkipWorkout = async (planId, dayIndex) => {
    try {
      setWorkoutStatuses((prev) => ({
        ...prev,
        [planId]: {
          ...prev[planId],
          [dayIndex]: "skipped",
        },
      }));
      await axios.post(`/api/workouts/${planId}/skip`, { dayIndex });
      toast.info("Workout skipped");
    } catch (error) {
      console.error("Error skipping workout:", error);
      toast.error("Failed to skip workout");
      setWorkoutStatuses((prev) => ({
        ...prev,
        [planId]: {
          ...prev[planId],
          [dayIndex]: "notStarted",
        },
      }));
    }
  };

  const handleCompleteWorkout = async (planId, dayIndex) => {
    try {
      setWorkoutStatuses((prev) => ({
        ...prev,
        [planId]: {
          ...prev[planId],
          [dayIndex]: "completed",
        },
      }));
      await axios.post(`/api/workouts/${planId}/complete`, { dayIndex });
      toast.success("Great job! Workout completed!");
    } catch (error) {
      console.error("Error completing workout:", error);
      toast.error("Failed to mark workout as complete");
      setWorkoutStatuses((prev) => ({
        ...prev,
        [planId]: {
          ...prev[planId],
          [dayIndex]: "inProgress",
        },
      }));
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getDifficultyColor = (level) => {
    switch (level?.toLowerCase()) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-blue-100 text-blue-800";
      case "advanced":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* <Header /> */}
      <ToastContainer position="top-right" autoClose={5000} />

      {/* Thinking Animation for deletion */}
      {isDeleting && <ThinkingAnimation />}

      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-teal-500 text-white py-6 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-2xl md:text-3xl font-bold mb-1">
            Your Saved Plans
          </h1>
          <p className="text-base md:text-lg opacity-90">
            View, manage, and continue your fitness and meal journey
          </p>
        </div>
      </header>

      {/* Tabs */}
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="flex border-b mb-6">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "exercise"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("exercise")}
          >
            Exercise Plans
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "meal"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("meal")}
          >
            Meal Plans
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {activeTab === "exercise" && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <Link
                      to="/pages/dashboard"
                      className="inline-flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <svg
                        className="w-5 h-5 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M10 19l-7-7m0 0l7-7m-7 7h18"
                        ></path>
                      </svg>
                      Back to Dashboard
                    </Link>
                  </div>
                  <Link to="/pages/exercise-planner">
                    <button className="px-4 py-1.5 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition duration-300">
                      Create New Plan
                    </button>
                  </Link>
                </div>
                {savedPlans.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <h3 className="text-xl mb-4">
                      You don't have any saved exercise plans yet
                    </h3>
                    <p className="mb-6 text-gray-600">
                      Create your first fitness plan to get started on your
                      journey
                    </p>
                    <Link to="/pages/exercise-planner">
                      <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300">
                        Create Your First Plan
                      </button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {savedPlans.map((plan) => (
                      <div
                        key={plan._id}
                        className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="flex items-center">
                              <h3 className="text-xl font-semibold">
                                {plan.planName || `${plan.userData?.goal} Plan`}
                              </h3>
                              <span
                                className={`ml-3 px-2 py-1 text-xs rounded-full ${getDifficultyColor(
                                  plan.userData?.fitnessLevel
                                )}`}
                              >
                                {plan.userData?.fitnessLevel || "Custom"}
                              </span>
                            </div>
                            <p className="text-gray-600 mt-1">
                              {plan.planData?.summary || "Custom workout plan"}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Link to={`/plan/${plan._id}`}>
                              <button className="text-white bg-blue-500 px-3 py-1 rounded text-sm hover:bg-blue-600 transition">
                                View
                              </button>
                            </Link>
                            <button
                              className="text-white bg-red-500 px-3 py-1 rounded text-sm hover:bg-red-600 transition"
                              onClick={() => handleDeletePlan(plan._id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === "meal" && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <Link
                      to="/pages/dashboard"
                      className="inline-flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <svg
                        className="w-5 h-5 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M10 19l-7-7m0 0l7-7m-7 7h18"
                        ></path>
                      </svg>
                      Back to Dashboard
                    </Link>
                  </div>
                  <Link to="/components/Meal-plan">
                    <button className="px-4 py-1.5 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition duration-300">
                      Create New Meal Plan
                    </button>
                  </Link>
                </div>
                {savedMeals.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <h3 className="text-xl mb-4">
                      You don't have any saved meal plans yet
                    </h3>
                    <p className="mb-6 text-gray-600">
                      Create your first meal plan to get started on your healthy
                      eating journey
                    </p>
                    <Link to="/components/Meal-plan">
                      <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300">
                        Create Your First Meal Plan
                      </button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {savedMeals.map((meal) => (
                      <div
                        key={meal._id}
                        className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="flex items-center">
                              <h3 className="text-xl font-semibold">
                                {meal.planName || "Custom Meal Plan"}
                              </h3>
                              <span className="ml-3 px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                                {meal.dietType || "Custom"}
                              </span>
                            </div>
                            <p className="text-gray-600 mt-1">
                              {meal.planData?.summary ||
                                "Custom meal plan for your diet"}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Link to={`/meal/${meal._id}`}>
                              <button
                                className="text-white bg-blue-500 px-3 py-1 rounded text-sm hover:bg-blue-600 transition"
                                onClick={() =>
                                  console.log(
                                    "Navigating to:",
                                    `/meal/${meal._id}`
                                  )
                                }
                              >
                                View
                              </button>
                            </Link>
                            <button
                              className="text-white bg-red-500 px-3 py-1 rounded text-sm hover:bg-red-600 transition"
                              onClick={() => handleDeleteMeal(meal._id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SavedPlans;
