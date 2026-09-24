import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import Header from "./Header";

const SavedPlansPage = () => {
  const [savedPlans, setSavedPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("workout"); // 'workout' or 'meal'
  const navigate = useNavigate();
  const location = useLocation();

  // Get user from Redux store
  const { userInfo } = useSelector((state) => state.auth);

  // Set active tab based on route or passed prop
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get("tab");
    if (tab === "meal" || tab === "workout") {
      setActiveTab(tab);
    }
  }, [location]);

  // Fetch saved plans when component mounts or tab changes
  useEffect(() => {
    if (userInfo) {
      fetchSavedPlans();
    } else {
      navigate("/login");
    }
  }, [userInfo, activeTab]);

  const fetchSavedPlans = async () => {
    try {
      setLoading(true);
      const endpoint =
        activeTab === "workout" ? "/api/workouts/saved" : "/api/meals/saved";
      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSavedPlans(data.plans || []);
      } else {
        toast.error("Failed to fetch saved plans");
      }
    } catch (error) {
      console.error("Error fetching saved plans:", error);
      toast.error("Error loading saved plans");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlan = async (planId) => {
    if (!window.confirm("Are you sure you want to delete this plan?")) {
      return;
    }

    try {
      const endpoint =
        activeTab === "workout"
          ? `/api/workouts/saved/${planId}`
          : `/api/meals/saved/${planId}`;

      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setSavedPlans(savedPlans.filter((plan) => plan._id !== planId));
        toast.success("Plan deleted successfully");
      } else {
        toast.error("Failed to delete plan");
      }
    } catch (error) {
      console.error("Error deleting plan:", error);
      toast.error("Error deleting plan");
    }
  };

  const handleUsePlan = (plan) => {
    const targetRoute =
      activeTab === "workout" ? "/exercise-planner" : "/meal-planner";
    navigate(targetRoute, {
      state: {
        loadedPlan: plan.planData,
        loadedUserData: plan.userData,
      },
    });
  };

  const renderWorkoutPlan = (plan) => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">{plan.name}</h3>
          <p className="text-gray-600 text-sm">
            Created: {new Date(plan.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handleUsePlan(plan)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Use This Plan
          </button>
          <button
            onClick={() => handleDeletePlan(plan._id)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold text-gray-700 mb-2">Plan Summary</h4>
        <p className="text-gray-600">
          {plan.planData?.summary || "No summary available"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plan.planData?.workoutDays?.map((day, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4">
            <h5 className="font-semibold text-gray-800 mb-2">{day.day}</h5>
            <p className="text-sm text-gray-600 mb-2">{day.focus}</p>
            <p className="text-xs text-gray-500">
              {day.exercises?.length || 0} exercises
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMealPlan = (plan) => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">{plan.name}</h3>
          <p className="text-gray-600 text-sm">
            Created: {new Date(plan.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handleUsePlan(plan)}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
          >
            Use This Plan
          </button>
          <button
            onClick={() => handleDeletePlan(plan._id)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold text-gray-700 mb-2">Plan Summary</h4>
        <p className="text-gray-600">
          {plan.planData?.summary || "No summary available"}
        </p>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold text-gray-700 mb-2">Nutrition Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="bg-blue-100 rounded-lg p-3 text-center">
            <p className="text-sm font-semibold text-blue-800">Calories</p>
            <p className="text-lg text-blue-600">
              {plan.planData?.nutritionSummary?.calories || "N/A"}
            </p>
          </div>
          <div className="bg-green-100 rounded-lg p-3 text-center">
            <p className="text-sm font-semibold text-green-800">Protein</p>
            <p className="text-lg text-green-600">
              {plan.planData?.nutritionSummary?.protein || "N/A"}
            </p>
          </div>
          <div className="bg-yellow-100 rounded-lg p-3 text-center">
            <p className="text-sm font-semibold text-yellow-800">Carbs</p>
            <p className="text-lg text-yellow-600">
              {plan.planData?.nutritionSummary?.carbs || "N/A"}
            </p>
          </div>
          <div className="bg-red-100 rounded-lg p-3 text-center">
            <p className="text-sm font-semibold text-red-800">Fat</p>
            <p className="text-lg text-red-600">
              {plan.planData?.nutritionSummary?.fat || "N/A"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plan.planData?.meals?.map((meal, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4">
            <h5 className="font-semibold text-gray-800 mb-2">{meal.name}</h5>
            <p className="text-sm text-gray-600 mb-2">
              {meal.calories} calories
            </p>
            <p className="text-xs text-gray-500">
              {meal.foods?.length || 0} items
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <ToastContainer position="top-right" autoClose={5000} />

      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-teal-500 text-white py-6 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-1">
                Your Saved Plans
              </h1>
              <p className="text-base md:text-lg opacity-90">
                Manage and reuse your personalized plans
              </p>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition duration-300"
            >
              ← Back
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-md p-1 mb-6">
          <div className="flex">
            <button
              onClick={() => setActiveTab("workout")}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition duration-300 ${
                activeTab === "workout"
                  ? "bg-blue-500 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Workout Plans ({savedPlans.length})
            </button>
            <button
              onClick={() => setActiveTab("meal")}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition duration-300 ${
                activeTab === "meal"
                  ? "bg-green-500 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Meal Plans ({savedPlans.length})
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : savedPlans.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No {activeTab} plans saved yet
            </h3>
            <p className="text-gray-500 mb-4">
              Create and save your first {activeTab} plan to see it here.
            </p>
            <button
              onClick={() =>
                navigate(
                  activeTab === "workout"
                    ? "/exercise-planner"
                    : "/meal-planner"
                )
              }
              className={`px-6 py-3 rounded-lg font-semibold transition duration-300 ${
                activeTab === "workout"
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "bg-green-500 hover:bg-green-600 text-white"
              }`}
            >
              Create {activeTab === "workout" ? "Workout" : "Meal"} Plan
            </button>
          </div>
        ) : (
          <div>
            {savedPlans.map((plan, index) => (
              <div key={plan._id || index}>
                {activeTab === "workout"
                  ? renderWorkoutPlan(plan)
                  : renderMealPlan(plan)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedPlansPage;
