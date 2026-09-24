import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const MealUserModal = ({ show, handleClose, mealPlan, userData, onSave }) => {
  const [planName, setPlanName] = useState("");
  const [savedPlans, setSavedPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [deletingPlan, setDeletingPlan] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);
  const safeUserData = userData || {
    fitnessGoal: "Not specified",
    dietaryPreference: "Not specified",
    mealsPerDay: "3",
    weight: "N/A",
    allergies: "None",
  };

  // Provide default values for mealPlan to prevent undefined errors
  const safeMealPlan = mealPlan || {
    summary: "No summary available",
    meals: [],
    nutritionSummary: {
      calories: "N/A",
      protein: "N/A",
      carbs: "N/A",
      fat: "N/A",
    },
    tips: [],
  };

  // Fetch saved plans when modal opens
  useEffect(() => {
    if (show && userInfo) {
      fetchSavedPlans();
    }
  }, [show, userInfo]);

  const fetchSavedPlans = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/meals/saved", {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      setSavedPlans(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching saved meal plans:", error);
      toast.error("Failed to load saved meal plans");
      setLoading(false);
    }
  };

  const handleSavePlan = async () => {
    if (!planName.trim()) {
      toast.error("Please enter a plan name");
      return;
    }

    if (!userInfo) {
      toast.error("User information not available. Please log in again.");
      return;
    }

    const userId = userInfo._id || (userInfo.user && userInfo.user._id);

    if (!userId) {
      toast.error("User ID not found. Please log in again.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "/api/meals/save",
        {
          userId: userId,
          planName: planName.trim(),
          planData: safeMealPlan,
          userInputs: safeUserData,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      toast.success("Meal plan saved successfully!");
      setLoading(false);
      onSave(response.data);
      handleClose();
      setPlanName("");
    } catch (error) {
      console.error("Error saving meal plan:", error);
      toast.error("Failed to save meal plan");
      setLoading(false);
    }
  };

  const handleDeletePlan = async (planId) => {
    try {
      setDeletingPlan(true);
      await axios.delete(`/api/meals/${planId}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });

      setSavedPlans(savedPlans.filter((plan) => plan._id !== planId));

      if (selectedPlan && selectedPlan._id === planId) {
        setSelectedPlan(null);
      }

      toast.success("Meal plan deleted successfully!");
      setDeletingPlan(false);
    } catch (error) {
      console.error("Error deleting meal plan:", error);
      toast.error("Failed to delete meal plan");
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
          {viewMode ? "Your Saved Meal Plans" : "Save Your Meal Plan"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {viewMode ? (
          <div className="saved-plans-container">
            {loading ? (
              <p className="text-center">Loading your saved meal plans...</p>
            ) : savedPlans.length === 0 ? (
              <p className="text-center">
                You don't have any saved meal plans yet.
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
                      <p className="mb-1">
                        Goal: {plan.userData?.fitnessGoal || "Not specified"}
                      </p>
                      <p className="mb-0 text-muted">
                        Dietary Preference:{" "}
                        {plan.userData?.dietaryPreference || "Not specified"}
                      </p>
                    </div>
                  ))}
                </div>

                {selectedPlan && (
                  <div className="selected-plan-details border p-3 rounded">
                    <h4 className="mb-3">{selectedPlan.planName}</h4>
                    <div className="meal-plan-summary">
                      <h5>Meal Plan Summary:</h5>
                      <p>
                        <strong>Fitness Goal:</strong>{" "}
                        {selectedPlan.userData?.fitnessGoal || "Not specified"}
                      </p>
                      <p>
                        <strong>Dietary Preference:</strong>{" "}
                        {selectedPlan.userData?.dietaryPreference ||
                          "Not specified"}
                      </p>
                      <p>
                        <strong>Meals Per Day:</strong>{" "}
                        {selectedPlan.userData?.mealsPerDay || "Not specified"}
                      </p>
                      <p>
                        <strong>Created:</strong>{" "}
                        {formatDate(selectedPlan.createdAt)}
                      </p>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeletePlan(selectedPlan._id)}
                        disabled={deletingPlan}
                        className="mt-2 mb-3"
                      >
                        {deletingPlan ? "Deleting..." : "Delete Plan"}
                      </Button>

                      <div className="meal-details mt-3">
                        <h5>Detailed Meal Plan:</h5>
                        {selectedPlan.planData?.meals?.map((meal, index) => (
                          <div key={index} className="meal-day mb-3">
                            <h6 className="bg-light p-2">{meal.name}</h6>
                            <ul className="list-unstyled">
                              {meal.foods?.map((food, idx) => (
                                <li key={idx} className="mb-2">
                                  <strong>{food.name}</strong>{" "}
                                  {food.amount && `(${food.amount})`}
                                  {food.calories && ` - ${food.calories} cal`}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
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
                placeholder="Enter a name for your meal plan"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
              />
              <Form.Text className="text-muted">
                Give your meal plan a descriptive name to easily find it later.
              </Form.Text>
            </Form.Group>

            <div className="plan-summary p-3 bg-light rounded mb-3">
              <h5>Plan Summary</h5>
              <p>
                <strong>Fitness Goal:</strong> {safeUserData.fitnessGoal}
              </p>
              <p>
                <strong>Dietary Preference:</strong>{" "}
                {safeUserData.dietaryPreference}
              </p>
              <p>
                <strong>Meals Per Day:</strong> {safeUserData.mealsPerDay}
              </p>
              <p>
                <strong>Weight:</strong> {safeUserData.weight} kg
              </p>
              {safeUserData.allergies && (
                <p>
                  <strong>Allergies:</strong> {safeUserData.allergies}
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

export default MealUserModal;
