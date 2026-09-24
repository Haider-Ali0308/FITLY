import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import Header from "../components/Header";
import ThinkingAnimation from "../components/ThinkingAnimation";

const SavedPlans = () => {
  const [savedPlans, setSavedPlans] = useState([]);
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
            // Default status is 'notStarted'
            dayStatuses[index] = plan.progress?.[index] || "notStarted";
          });
          initialStatuses[plan._id] = dayStatuses;
        }
      });

      setWorkoutStatuses(initialStatuses);
      setSavedPlans(plans);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching saved plans:", error);
      toast.error("Failed to load your saved plans");
      setLoading(false);
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

  const handleStartWorkout = async (planId, dayIndex) => {
    try {
      // Update local state first for immediate UI feedback
      setWorkoutStatuses((prev) => ({
        ...prev,
        [planId]: {
          ...prev[planId],
          [dayIndex]: "inProgress",
        },
      }));

      // Then update on the server
      await axios.post(`/api/workouts/${planId}/start`, { dayIndex });
      toast.success("Workout started!");

      // You could navigate to a workout view page here
      // navigate(`/workout/${planId}/${dayIndex}`);
    } catch (error) {
      console.error("Error starting workout:", error);
      toast.error("Failed to start workout");

      // Revert state on error
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
      // Update local state first for immediate UI feedback
      setWorkoutStatuses((prev) => ({
        ...prev,
        [planId]: {
          ...prev[planId],
          [dayIndex]: "skipped",
        },
      }));

      // Then update on the server
      await axios.post(`/api/workouts/${planId}/skip`, { dayIndex });
      toast.info("Workout skipped");
    } catch (error) {
      console.error("Error skipping workout:", error);
      toast.error("Failed to skip workout");

      // Revert state on error
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

      // Then update on the server
      await axios.post(`/api/workouts/${planId}/complete`, { dayIndex });
      toast.success("Great job! Workout completed!");
    } catch (error) {
      console.error("Error completing workout:", error);
      toast.error("Failed to mark workout as complete");

      // Revert state on error
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
      <Header />
      <ToastContainer position="top-right" autoClose={5000} />

      {/* Thinking Animation for deletion */}
      {isDeleting && <ThinkingAnimation />}

      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-teal-500 text-white py-6 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-2xl md:text-3xl font-bold mb-1">
            Your Saved Workout Plans
          </h1>
          <p className="text-base md:text-lg opacity-90">
            View, manage, and continue your fitness journey
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 max-w-4xl">
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

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {savedPlans.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <h3 className="text-xl mb-4">
                  You don't have any saved plans yet
                </h3>
                <p className="mb-6 text-gray-600">
                  Create your first fitness plan to get started on your journey
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
      </div>
    </div>
  );
};

export default SavedPlans;
