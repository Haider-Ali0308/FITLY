import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import Header from "../components/Header";

const ViewPlan = () => {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exerciseProgress, setExerciseProgress] = useState({});
  const [currentDay, setCurrentDay] = useState("");
  const [exerciseTimers, setExerciseTimers] = useState({});
  const [completedSets, setCompletedSets] = useState({});
  const { planId } = useParams();
  const navigate = useNavigate();

  // Minimum time required for one set (in seconds)
  const MIN_SET_TIME = 25; // 25 seconds per set

  // Get user from Redux store
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    // Redirect if not logged in
    if (!userInfo) {
      navigate("/pages/login");
      return;
    }

    // Set current day of the week
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const today = new Date().getDay();
    setCurrentDay(days[today]);

    fetchPlanDetails();
    fetchExerciseProgress();
  }, [userInfo, planId, navigate]);

  // Handle plan deletion and day skipping
  useEffect(() => {
    if (!plan || !plan.createdAt) return;

    const checkPlanExpirationAndDaySkipping = async () => {
      const createdDate = new Date(plan.createdAt);
      const now = new Date();
      const daysSinceCreation = Math.floor(
        (now - createdDate) / (1000 * 60 * 60 * 24)
      );

      // Check if plan was created on Monday and week has ended
      if (createdDate.getDay() === 1 && daysSinceCreation >= 7) {
        try {
          await axios.delete(`/api/workouts/${planId}`);
          toast.info("Workout plan has expired and was deleted");
          navigate("/saved-plans");
        } catch (error) {
          console.error("Error deleting expired plan:", error);
          toast.error("Failed to delete expired plan");
        }
        return;
      }

      // Check for missed days (only previous day)
      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const currentDayIndex = now.getDay();
      const currentTime = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

      // Only check previous day after midnight
      if (currentTime >= 0) {
        const prevDayIndex = (currentDayIndex - 1 + 7) % 7;
        const prevDayName = days[prevDayIndex];
        const workoutDayIndex = plan.planData?.workoutDays?.findIndex(
          (day) => day.day === prevDayName
        );

        if (workoutDayIndex >= 0) {
          const workoutDay = plan.planData?.workoutDays[workoutDayIndex];
          if (workoutDay && workoutDay.exercises.length > 0) {
            const allExercisesSkippedOrCompleted = workoutDay.exercises.every(
              (_, exIndex) => {
                const status = exerciseProgress[`${workoutDayIndex}-${exIndex}`];
                return status === "completed" || status === "skipped";
              }
            );

            if (!allExercisesSkippedOrCompleted) {
              try {
                for (let exIndex = 0; exIndex < workoutDay.exercises.length; exIndex++) {
                  const exerciseId = `${workoutDayIndex}-${exIndex}`;
                  if (!exerciseProgress[exerciseId]) {
                    await axios.post("/api/progress/update", {
                      workoutPlanId: planId,
                      dayIndex: workoutDayIndex,
                      exerciseIndex: exIndex,
                      status: "skipped",
                    });
                    setExerciseProgress((prev) => ({
                      ...prev,
                      [exerciseId]: "skipped",
                    }));
                  }
                }
                toast.info(`${prevDayName} exercises marked as skipped`);
              } catch (error) {
                console.error("Error marking day as skipped:", error);
                toast.error("Failed to update missed day status");
              }
            }
          }
        }
      }
    };

    // Run check every minute
    const interval = setInterval(checkPlanExpirationAndDaySkipping, 60000);
    return () => clearInterval(interval);
  }, [plan, planId, navigate, exerciseProgress]);

  // Update exercise timers
  useEffect(() => {
    const interval = setInterval(() => {
      setExerciseTimers((prev) => {
        const updatedTimers = { ...prev };
        Object.keys(updatedTimers).forEach((key) => {
          if (updatedTimers[key].startTime) {
            const elapsed = Math.floor(
              (Date.now() - updatedTimers[key].startTime) / 1000
            );
            updatedTimers[key].elapsedTime = elapsed;
          }
        });
        return updatedTimers;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const fetchPlanDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/workouts/${planId}`);
      setPlan(response.data);
    } catch (error) {
      console.error("Error fetching plan details:", error);
      toast.error("Failed to load the workout plan");
    } finally {
      setLoading(false);
    }
  };

  const fetchExerciseProgress = async () => {
    try {
      const response = await axios.get(`/api/progress/${planId}`);

      if (response.data && Array.isArray(response.data)) {
        const progressMap = {};
        response.data.forEach((item) => {
          progressMap[`${item.dayIndex}-${item.exerciseIndex}`] = item.status;
        });
        setExerciseProgress(progressMap);
      }
    } catch (error) {
      console.error("Error fetching exercise progress:", error);
      if (error.response && error.response.status === 404) {
        console.log("No progress tracking started for this plan");
        setExerciseProgress({});
      } else {
        toast.error("Failed to load your progress");
      }
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

  // Calculate total number of exercises in the plan
  const getTotalExercisesCount = () => {
    if (!plan || !plan.planData || !plan.planData.workoutDays) return 0;
    return plan.planData.workoutDays.reduce((count, day) => {
      return count + day.exercises.length;
    }, 0);
  };

  // Calculate total possible points
  const getTotalPossiblePoints = () => {
    return getTotalExercisesCount() * 5; // Each exercise is worth 5 points
  };

  // Calculate total earned points
  const calculateEarnedPoints = () => {
    let points = 0;
    Object.values(exerciseProgress).forEach((status) => {
      if (status === "completed") points += 5; 
      if (status === "skipped") points -= 2;
    });
    return Math.max(0, points); 
  };

  // Calculate points progress percentage for display
  const calculatePointsProgressPercentage = () => {
    const totalPoints = getTotalPossiblePoints();
    if (totalPoints === 0) return 0;
    return Math.round((calculateEarnedPoints() / totalPoints) * 100);
  };

  // Check if the day is the current day of the week
  const isCurrentDay = (dayName) => {
    return dayName === currentDay;
  };

  // Start exercise set timer
  const handleStartSet = (dayIndex, exIndex) => {
    const exerciseId = `${dayIndex}-${exIndex}`;
    setExerciseTimers((prev) => ({
      ...prev,
      [exerciseId]: {
        startTime: Date.now(),
        elapsedTime: 0,
      },
    }));
  };

  // Mark set as completed
  const handleCompleteSet = (dayIndex, exerciseIndex, totalSets) => {
    const exerciseId = `${dayIndex}-${exerciseIndex}`;
    const timer = exerciseTimers[exerciseId];

    if (!timer || timer.elapsedTime < MIN_SET_TIME) {
      toast.error(
        `Please wait ${MIN_SET_TIME - (timer?.elapsedTime || 0)} more seconds to complete this set`
      );
      return;
    }

    setCompletedSets((prev) => {
      const currentSets = prev[exerciseId] || 0;
      if (currentSets < totalSets) {
        toast.success(`Set ${currentSets + 1} completed`);
        return {
          ...prev,
          [exerciseId]: currentSets + 1,
        };
      }
      return prev;
    });

    // Reset timer for the next set
    setExerciseTimers((prev) => ({
      ...prev,
      [exerciseId]: {
        startTime: Date.now(),
        elapsedTime: 0,
      },
    }));
  };

  // Handle completing an entire exercise
  const handleCompleteExercise = async (dayIndex, exerciseIndex, totalSets) => {
    const exerciseId = `${dayIndex}-${exerciseIndex}`;
    if (exerciseProgress[exerciseId] === "completed") return;

    const completed = completedSets[exerciseId] || 0;
    if (completed < totalSets) {
      toast.error(`Please complete all ${totalSets} sets before marking as completed`);
      return;
    }

    try {
      await axios.post("/api/progress/update", {
        workoutPlanId: planId,
        dayIndex,
        exerciseIndex,
        status: "completed",
      });

      setExerciseProgress((prev) => ({
        ...prev,
        [exerciseId]: "completed",
      }));

      // Reset timer and completed sets
      setExerciseTimers((prev) => {
        const updatedTimers = { ...prev };
        delete updatedTimers[exerciseId];
        return updatedTimers;
      });
      setCompletedSets((prev) => {
        const updatedSets = { ...prev };
        delete updatedSets[exerciseId];
        return updatedSets;
      });

      toast.success("Exercise completed! +5 points");
    } catch (error) {
      console.error("Error updating exercise status:", error);
      toast.error("Failed to update exercise status");
    }
  };

  // Handle skipping an exercise
  const handleSkipExercise = async (dayIndex, exerciseIndex) => {
    const exerciseId = `${dayIndex}-${exerciseIndex}`;

    if (exerciseProgress[exerciseId] === "skipped") return;

    try {
      await axios.post("/api/progress/update", {
        workoutPlanId: planId,
        dayIndex,
        exerciseIndex,
        status: "skipped",
      });

      setExerciseProgress((prev) => ({
        ...prev,
        [exerciseId]: "skipped",
      }));

      // Reset timer and completed sets if exist
      setExerciseTimers((prev) => {
        const updatedTimers = { ...prev };
        delete updatedTimers[exerciseId];
        return updatedTimers;
      });
      setCompletedSets((prev) => {
        const updatedSets = { ...prev };
        delete updatedSets[exerciseId];
        return updatedSets;
      });

      toast.info("Exercise skipped (-2 points)");
    } catch (error) {
      console.error("Error updating exercise status:", error);
      toast.error("Failed to update exercise status");
    }
  };

  // Check if an exercise is completed
  const isExerciseCompleted = (dayIndex, exerciseIndex) => {
    return exerciseProgress[`${dayIndex}-${exerciseIndex}`] === "completed";
  };

  // Check if an exercise is skipped
  const isExerciseSkipped = (dayIndex, exerciseIndex) => {
    return exerciseProgress[`${dayIndex}-${exerciseIndex}`] === "skipped";
  };

  // Format elapsed time for display
  const formatElapsedTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  // Calculate points per day
  const calculateDayPoints = (dayIndex) => {
    if (!plan || !plan.planData || !plan.planData.workoutDays) return 0;

    const day = plan.planData.workoutDays[dayIndex];
    if (!day || day.exercises.length === 0) return 0;

    let points = 0;
    day.exercises.forEach((_, exerciseIndex) => {
      if (isExerciseCompleted(dayIndex, exerciseIndex)) {
        points += 5; // 5 points per completed exercise
      } else if (isExerciseSkipped(dayIndex, exerciseIndex)) {
        points -= 2; // Deduct 2 points per skipped exercise
      }
    });
    return Math.max(0, points); // Ensure points don't go negative
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <ToastContainer position="top-right" autoClose={5000} />

      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-teal-500 text-white py-6 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-2xl md:text-3xl font-bold mb-1">
            Workout Plan Details
          </h1>
          <p className="text-base md:text-lg opacity-90">
            View your complete workout plan
          </p>
          <p className="text-base mt-2 bg-black bg-opacity-20 inline-block px-3 py-1 rounded">
            Today is {currentDay}
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <Link
            to="/saved-plans"
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
            Back to Saved Plans
          </Link>

          <Link
            to="/pages/dashboard"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            View Dashboard
            <svg
              className="w-5 h-5 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : plan ? (
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300">
            {/* Plan Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="flex items-center">
                    <h2 className="text-2xl font-bold">
                      {plan.planName || `${plan.userData?.goal} Plan`}
                    </h2>
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
                <div className="text-sm text-gray-500">
                  Created: {formatDate(plan.createdAt)}
                </div>
              </div>

              {/* Points Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    Total Points
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    {calculateEarnedPoints()} / {getTotalPossiblePoints()} Points
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${calculatePointsProgressPercentage()}%` }}
                  ></div>
                </div>
              </div>

              {plan.userData?.limitations && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 text-sm">
                  <div className="font-semibold">
                    Limitations/Considerations:
                  </div>
                  <div>{plan.userData.limitations}</div>
                </div>
              )}
            </div>

            {/* Workout Days */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-xl font-semibold mb-4">Workout Schedule</h3>

              <div className="grid grid-cols-1 gap-6">
                {plan.planData?.workoutDays?.map((day, dayIndex) => {
                  const isDayToday = isCurrentDay(day.day);

                  return (
                    <div
                      key={dayIndex}
                      className={`border ${
                        isDayToday
                          ? "border-blue-300 shadow-md"
                          : "border-gray-200"
                      } rounded-lg overflow-hidden`}
                    >
                      <div
                        className={`${
                          isDayToday ? "bg-blue-50" : "bg-gray-50"
                        } px-4 py-3 border-b border-gray-200`}
                      >
                        <div className="flex justify-between items-center">
                          <h4
                            className={`text-lg font-semibold ${
                              isDayToday ? "text-blue-700" : ""
                            }`}
                          >
                            {day.day}
                            {isDayToday && (
                              <span className="ml-2 bg-blue-500 text-white px-2 py-0.5 text-xs rounded-full">
                                Today
                              </span>
                            )}
                          </h4>
                          <div className="flex items-center gap-3">
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                              {day.focus}
                            </span>
                            {day.exercises.length > 0 && (
                              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                {calculateDayPoints(dayIndex)} / {day.exercises.length * 5} Points
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {day.exercises.length > 0 ? (
                        <div className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {day.exercises.map((exercise, exIndex) => {
                              const exerciseId = `${dayIndex}-${exIndex}`;
                              const isCompleted = isExerciseCompleted(dayIndex, exIndex);
                              const isSkipped = isExerciseSkipped(dayIndex, exIndex);
                              const timer = exerciseTimers[exerciseId];
                              const completed = completedSets[exerciseId] || 0;
                              const canCompleteSet = timer && timer.elapsedTime >= MIN_SET_TIME;
                              const canCompleteExercise = completed >= exercise.sets;

                              return (
                                <div
                                  key={exIndex}
                                  className={`${
                                    isCompleted
                                      ? "bg-green-50 border-green-200"
                                      : isSkipped
                                      ? "bg-gray-50 border-gray-200 opacity-70"
                                      : "bg-white border-gray-200"
                                  } border rounded-md p-3 hover:shadow-sm transition-shadow`}
                                >
                                  <div className="flex justify-between items-start mb-2">
                                    <h5
                                      className={`font-semibold ${
                                        isCompleted
                                          ? "text-green-800"
                                          : "text-gray-800"
                                      } mb-2`}
                                    >
                                      {exercise.name}
                                      {isSkipped && (
                                        <span className="text-xs text-gray-500 ml-2">
                                          (Skipped)
                                        </span>
                                      )}
                                    </h5>

                                    {/* Status indicators */}
                                    {isCompleted && (
                                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        <svg
                                          className="w-3 h-3 mr-1"
                                          fill="currentColor"
                                          viewBox="0 0 20 20"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                          ></path>
                                        </svg>
                                        Completed (+5 Points)
                                      </span>
                                    )}
                                    {isSkipped && (
                                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                        Skipped (-2 Points)
                                      </span>
                                    )}
                                  </div>

                                  <div className="grid grid-cols-3 gap-2 text-sm">
                                    <div className="bg-gray-50 p-2 rounded text-center">
                                      <div className="text-gray-500">Sets</div>
                                      <div className="font-medium">
                                        {exercise.sets}
                                      </div>
                                    </div>
                                    <div className="bg-gray-50 p-2 rounded text-center">
                                      <div className="text-gray-500">Reps</div>
                                      <div className="font-medium">
                                        {exercise.reps}
                                      </div>
                                    </div>
                                    {exercise.weight && (
                                      <div className="bg-gray-50 p-2 rounded text-center">
                                        <div className="text-gray-500">
                                          Weight
                                        </div>
                                        <div className="font-medium">
                                          {exercise.weight}
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  {/* Sets progress */}
                                  {!isCompleted && !isSkipped && (
                                    <div className="mt-2 text-sm text-gray-600">
                                      Sets Completed: {completed}/{exercise.sets}
                                    </div>
                                  )}

                                  {/* Timer display */}
                                  {timer && !isCompleted && !isSkipped && isDayToday && (
                                    <div className="mt-2 text-sm text-gray-600">
                                      Set Time: {formatElapsedTime(timer.elapsedTime)}
                                    </div>
                                  )}

                                  {/* Action buttons - Only shown for current day */}
                                  {!isCompleted && !isSkipped && isDayToday && (
                                    <div className="mt-3 flex gap-2 flex-wrap">
                                      {!timer && completed < exercise.sets && (
                                        <button
                                          onClick={() =>
                                            handleStartSet(dayIndex, exIndex)
                                          }
                                          className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition duration-300 flex items-center"
                                        >
                                          <svg
                                            className="w-4 h-4 mr-1"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth="2"
                                              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                            ></path>
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth="2"
                                              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            ></path>
                                          </svg>
                                          Start Set
                                        </button>
                                      )}
                                      {canCompleteSet && completed < exercise.sets && (
                                        <button
                                          onClick={() =>
                                            handleCompleteSet(dayIndex, exIndex, exercise.sets)
                                          }
                                          className="px-3 py-1 bg-teal-500 text-white text-sm rounded hover:bg-teal-600 transition duration-300 flex items-center"
                                        >
                                          <svg
                                            className="w-4 h-4 mr-1"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth="2"
                                              d="M5 13l4 4L19 7"
                                            ></path>
                                          </svg>
                                          Complete Set
                                        </button>
                                      )}
                                      {canCompleteExercise && (
                                        <button
                                          onClick={() =>
                                            handleCompleteExercise(dayIndex, exIndex, exercise.sets)
                                          }
                                          className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition duration-300 flex items-center"
                                        >
                                          <svg
                                            className="w-4 h-4 mr-1"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth="2"
                                              d="M5 13l4 4L19 7"
                                            ></path>
                                          </svg>
                                          Complete Exercise (+5)
                                        </button>
                                      )}
                                      <button
                                        onClick={() =>
                                          handleSkipExercise(dayIndex, exIndex)
                                        }
                                        className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400 transition duration-300 flex items-center"
                                      >
                                        <svg
                                          className="w-4 h-4 mr-1"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M13 5l7 7-7 7M5 5l7 7-7 7"
                                          ></path>
                                        </svg>
                                        Skip (-2)
                                      </button>
                                    </div>
                                  )}

                                  {/* Message for non-current days */}
                                  {!isCompleted &&
                                    !isSkipped &&
                                    !isDayToday && (
                                      <div className="mt-3 text-xs text-gray-500 italic">
                                        Exercise tracking available only on{" "}
                                        {day.day}
                                      </div>
                                    )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 text-center text-gray-500">
                          Rest day - No exercises scheduled
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tips Section */}
            {plan.planData?.tips && plan.planData.tips.length > 0 && (
              <div className="mt-8 border-t border-gray-200 pt-6">
                <h3 className="text-xl font-semibold mb-4">Training Tips</h3>
                <div className="bg-teal-50 rounded-lg p-4">
                  <ul className="space-y-3">
                    {plan.planData.tips.map((tip, index) => (
                      <li key={index} className="flex">
                        <div className="text-teal-500 mr-2">
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </div>
                        <span className="text-gray-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Nutrition Section */}
            {plan.planData?.nutrition && (
              <div className="mt-8 border-t border-gray-200 pt-6">
                <h3 className="text-xl font-semibold mb-4">
                  Nutrition Guidance
                </h3>
                <div className="bg-indigo-50 rounded-lg p-4">
                  <div className="prose max-w-none text-gray-700">
                    {typeof plan.planData.nutrition === "string" ? (
                      <p>{plan.planData.nutrition}</p>
                    ) : (
                      <>
                        {plan.planData.nutrition.overview && (
                          <div className="mb-4">
                            <h4 className="font-medium text-indigo-700 mb-2">
                              Overview
                            </h4>
                            <p>{plan.planData.nutrition.overview}</p>
                          </div>
                        )}

                        {plan.planData.nutrition.meals && (
                          <div className="mb-4">
                            <h4 className="font-medium text-indigo-700 mb-2">
                              Meal Recommendations
                            </h4>
                            <ul className="space-y-2">
                              {Object.entries(
                                plan.planData.nutrition.meals
                              ).map(([meal, details]) => (
                                <li
                                  key={meal}
                                  className="bg-white p-3 rounded shadow-sm"
                                >
                                  <div className="font-medium capitalize mb-1">
                                    {meal}
                                  </div>
                                  <div className="text-sm">{details}</div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {plan.planData.nutrition.tips &&
                          plan.planData.nutrition.tips.length > 0 && (
                            <div>
                              <h4 className="font-medium text-indigo-700 mb-2">
                                Nutrition Tips
                              </h4>
                              <ul className="space-y-1">
                                {plan.planData.nutrition.tips.map(
                                  (tip, index) => (
                                    <li
                                      key={index}
                                      className="flex items-start"
                                    >
                                      <span className="text-indigo-500 mr-2 mt-0.5">
                                        •
                                      </span>
                                      <span>{tip}</span>
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <div className="text-5xl text-gray-300 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700">
              Workout Plan Not Found
            </h3>
            <p className="text-gray-500 mt-2 max-w-md mx-auto">
              We couldn't find the workout plan you're looking for. It may have
              been deleted or is unavailable.
            </p>
            <div className="mt-6">
              <Link
                to="/saved-plans"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
              >
                View Your Saved Plans
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewPlan;