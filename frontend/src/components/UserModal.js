import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const UserModal = ({
  show,
  handleClose,
  workoutPlan,
  userData,
  onSave,
  planTypeFilter,
}) => {
  const [planName, setPlanName] = useState("");
  const [savedPlans, setSavedPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [deletingPlan, setDeletingPlan] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);

  // Fetch saved plans when modal opens
  useEffect(() => {
    if (show && userInfo) {
      fetchSavedPlans();
    }
  }, [show, userInfo]);

  const fetchSavedPlans = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/workouts/saved", {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });

      // Filter plans based on planTypeFilter if provided
      let filteredPlans = response.data;
      if (planTypeFilter) {
        filteredPlans = response.data.filter(
          (plan) => plan.planData && plan.planData.planType === planTypeFilter
        );
      }

      setSavedPlans(filteredPlans);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching saved plans:", error);
      toast.error("Failed to load saved plans");
      setLoading(false);
    }
  };

  const handleSavePlan = async () => {
    if (!planName.trim()) {
      toast.error("Please enter a plan name");
      return;
    }

    // Check if userInfo is properly available
    if (!userInfo) {
      toast.error("User information not available. Please log in again.");
      return;
    }

    // Get the user ID from the correct location in userInfo
    // The structure might be userInfo._id or userInfo.id directly instead of userInfo.user._id
    const userId = userInfo._id || (userInfo.user && userInfo.user._id);

    if (!userId) {
      toast.error("User ID not found. Please log in again.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "/api/workouts/save",
        {
          userId: userId,
          planName: planName.trim(),
          planData: workoutPlan,
          userInputs: userData,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      toast.success("Workout plan saved successfully!");
      setLoading(false);
      onSave(response.data);
      handleClose();
      setPlanName("");
    } catch (error) {
      console.error("Error saving workout plan:", error);
      toast.error("Failed to save workout plan");
      setLoading(false);
    }
  };

  const handleDeletePlan = async (planId) => {
    try {
      setDeletingPlan(true);
      // Using the correct endpoint that matches your routes file
      await axios.delete(`/api/workouts/${planId}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });

      // Remove the deleted plan from the state
      setSavedPlans(savedPlans.filter((plan) => plan._id !== planId));

      // Reset selected plan if it was deleted
      if (selectedPlan && selectedPlan._id === planId) {
        setSelectedPlan(null);
      }

      toast.success("Workout plan deleted successfully!");
      setDeletingPlan(false);
    } catch (error) {
      console.error("Error deleting workout plan:", error);
      toast.error("Failed to delete workout plan");
      setDeletingPlan(false);
    }
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const toggleViewMode = () => {
    setViewMode(!viewMode);
    setSelectedPlan(null);
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {viewMode
            ? `Your Saved ${
                planTypeFilter ? planTypeFilter + "s" : "Workout Plans"
              }`
            : "Save Your Workout Plan"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {viewMode ? (
          <div className="saved-plans-container">
            {loading ? (
              <p className="text-center">Loading your saved plans...</p>
            ) : savedPlans.length === 0 ? (
              <p className="text-center">
                {planTypeFilter
                  ? `You don't have any saved ${planTypeFilter}s yet.`
                  : "You don't have any saved plans yet."}
              </p>
            ) : (
              <div>
                <div className="plan-list mb-4">
                  {savedPlans.map((plan) => (
                    <div
                      key={plan._id}
                      className={`plan-item p-3 mb-2 border rounded ${
                        selectedPlan && selectedPlan._id === plan._id
                          ? "bg-light border-primary"
                          : ""
                      }`}
                      onClick={() => handlePlanSelect(plan)}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-1">{plan.planName}</h5>
                        <small>{formatDate(plan.createdAt)}</small>
                      </div>
                      {plan.planData && plan.planData.planType && (
                        <p className="mb-1 text-primary">
                          <small>
                            <strong>Type:</strong> {plan.planData.planType}
                          </small>
                        </p>
                      )}
                      <p className="mb-1">Goal: {plan.userInputs.goal}</p>
                      <p className="mb-0 text-muted">
                        Fitness Level: {plan.userInputs.fitnessLevel}
                      </p>
                    </div>
                  ))}
                </div>

                {selectedPlan && (
                  <div className="selected-plan-details border p-3 rounded">
                    <h4 className="mb-3">{selectedPlan.planName}</h4>
                    <div className="workout-summary">
                      <h5>Workout Summary:</h5>
                      {selectedPlan.planData &&
                        selectedPlan.planData.planType && (
                          <p>
                            <strong>Type:</strong>{" "}
                            {selectedPlan.planData.planType}
                          </p>
                        )}
                      <p>
                        <strong>Goal:</strong> {selectedPlan.userInputs.goal}
                      </p>
                      <p>
                        <strong>Fitness Level:</strong>{" "}
                        {selectedPlan.userInputs.fitnessLevel}
                      </p>
                      <p>
                        <strong>Days Per Week:</strong>{" "}
                        {selectedPlan.userInputs.daysPerWeek}
                      </p>
                      <p>
                        <strong>Created:</strong>{" "}
                        {formatDate(selectedPlan.createdAt)}
                      </p>
                      {/* Add delete button here, just below the time */}
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeletePlan(selectedPlan._id)}
                        disabled={deletingPlan}
                        className="mt-2 mb-3"
                      >
                        {deletingPlan ? "Deleting..." : "Delete Plan"}
                      </Button>

                      <div className="workout-details mt-3">
                        <h5>Workout Plan:</h5>
                        {selectedPlan.planData.workoutDays &&
                          selectedPlan.planData.workoutDays.map(
                            (day, index) => (
                              <div key={index} className="day-plan mb-3">
                                <h6 className="bg-light p-2">{day.day}</h6>
                                <ul className="list-unstyled">
                                  {day.exercises &&
                                    day.exercises.map((exercise, idx) => (
                                      <li key={idx} className="mb-2">
                                        <strong>{exercise.name}</strong>:{" "}
                                        {exercise.sets} sets × {exercise.reps}{" "}
                                        reps
                                        {exercise.weight && (
                                          <span> ({exercise.weight})</span>
                                        )}
                                      </li>
                                    ))}
                                </ul>
                              </div>
                            )
                          )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Plan Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter a name for your workout plan"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
              />
              <Form.Text className="text-muted">
                Give your workout plan a descriptive name to easily find it
                later.
              </Form.Text>
            </Form.Group>

            <div className="plan-summary p-3 bg-light rounded mb-3">
              <h5>Plan Summary</h5>
              {workoutPlan && workoutPlan.planType && (
                <p>
                  <strong>Type:</strong> {workoutPlan.planType}
                </p>
              )}
              <p>
                <strong>Goal:</strong> {userData.goal}
              </p>
              <p>
                <strong>Fitness Level:</strong> {userData.fitnessLevel}
              </p>
              <p>
                <strong>Days Per Week:</strong> {userData.daysPerWeek}
              </p>
              <p>
                <strong>Weight:</strong> {userData.weight} kg/lbs
              </p>
              {userData.limitations && (
                <p>
                  <strong>Limitations:</strong> {userData.limitations}
                </p>
              )}
            </div>
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="info" onClick={toggleViewMode}>
          {viewMode ? "Save New Plan" : "View Saved Plans"}
        </Button>
        {!viewMode && (
          <Button
            variant="primary"
            onClick={handleSavePlan}
            disabled={loading || !planName.trim()}
          >
            {loading ? "Saving..." : "Save Plan"}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default UserModal;
