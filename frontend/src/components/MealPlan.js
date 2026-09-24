import React, { useState, useEffect, useRef } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  Badge,
} from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import UserModal from "../components/MealUserModal";
import ThinkingAnimation from "../components/ThinkingAnimation";

const MealPlan = () => {
  const [userData, setUserData] = useState({
    weight: "",
    height: "",
    age: "",
    gender: "",
    dietaryPreference: "",
    allergies: "",
    fitnessGoal: "",
    mealsPerDay: "3",
    calorieTarget: "",
  });

  const [mealPlan, setMealPlan] = useState(null);
  const [currentDate, setCurrentDate] = useState(
    new Date()
      .toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .split("/")
      .reverse()
      .join("-")
  );

  // UI state
  const [loading, setLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Navigation and location hooks
  const navigate = useNavigate();
  const location = useLocation();

  // Get user from Redux store
  const { userInfo } = useSelector((state) => state.auth);

  // Add ref for the results section
  const resultsRef = useRef(null);

  // Check if there's a loaded plan from SavedPlansPage
  useEffect(() => {
    if (location.state?.loadedPlan && location.state?.loadedUserData) {
      setMealPlan(location.state.loadedPlan);
      setUserData(location.state.loadedUserData);
      setIsRevealing(true);
      toast.success("Meal plan loaded successfully!");

      // Clear the state to prevent reloading on subsequent renders
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  // Add effect to scroll to results when meal plan is generated
  useEffect(() => {
    if (mealPlan && !isThinking && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [mealPlan, isThinking]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  // Helper function to safely render food items
  const renderFoodItem = (food, index) => {
    // If food is an object with name, amount, calories, description
    if (typeof food === "object" && food !== null) {
      return (
        <ListGroup.Item key={index} className="px-0">
          <div>
            <strong>{food.name}</strong>
            {food.amount && (
              <span className="text-muted"> - {food.amount}</span>
            )}
          </div>
          {food.description && (
            <small className="text-muted d-block">{food.description}</small>
          )}
          {food.calories && (
            <small className="text-info d-block">
              {food.calories} calories
            </small>
          )}
        </ListGroup.Item>
      );
    }

    // If food is a string (fallback)
    return (
      <ListGroup.Item key={index} className="px-0">
        {String(food)}
      </ListGroup.Item>
    );
  };

  const generateMealPlan = async () => {
    // Validate inputs
    if (
      !userData.weight ||
      !userData.height ||
      !userData.age ||
      !userData.gender ||
      !userData.dietaryPreference ||
      !userData.fitnessGoal ||
      !userData.mealsPerDay
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    // Start thinking phase and API call
    setIsThinking(true);
    setIsGenerating(true);

    const apiPromise = fetch("/api/meals/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...userData, date: currentDate }),
    });

    const timerPromise = new Promise((resolve) => setTimeout(resolve, 5000));

    try {
      const [response] = await Promise.all([apiPromise, timerPromise]);
      const data = await response.json();

      console.log("API Response:", data); // Debug log

      // Ensure the response data has the expected structure
      const planData = data.mealPlan || {};

      // Create a default structure if any part is missing
      const sanitizedPlan = {
        summary:
          planData.summary ||
          `${userData.mealsPerDay}-meal plan for ${userData.fitnessGoal} with ${userData.dietaryPreference} preference`,
        meals: Array.isArray(planData.meals) ? planData.meals : [],
        nutritionSummary: planData.nutritionSummary || {
          calories: "~" + (userData.calorieTarget || "2000"),
          protein: "~150g",
          carbs: "~200g",
          fat: "~70g",
        },
        tips: Array.isArray(planData.tips) ? planData.tips : [],
        planType: "Meal Plan", // Add plan type identifier
        planName: `${
          userData.dietaryPreference.charAt(0).toUpperCase() +
          userData.dietaryPreference.slice(1)
        } ${userData.fitnessGoal
          .replace("_", " ")
          .replace(/\b\w/g, (l) => l.toUpperCase())} Plan`,
      };

      // If meals array is empty, create placeholder meals
      if (sanitizedPlan.meals.length === 0) {
        const mealNames = [
          "Breakfast",
          "Lunch",
          "Dinner",
          "Snack 1",
          "Snack 2",
        ];
        for (let i = 0; i < parseInt(userData.mealsPerDay); i++) {
          sanitizedPlan.meals.push({
            name: mealNames[i] || `Meal ${i + 1}`,
            foods: ["Balanced meal option"],
            calories: Math.round(
              (userData.calorieTarget || 2000) / userData.mealsPerDay
            ),
            protein: "20g",
            carbs: "30g",
            fat: "10g",
          });
        }
      }

      // Sanitize meals to ensure foods array contains proper data
      sanitizedPlan.meals = sanitizedPlan.meals.map((meal) => ({
        ...meal,
        foods: Array.isArray(meal.foods) ? meal.foods : ["No foods specified"],
        calories: meal.calories || "0",
        protein: meal.protein || "0g",
        carbs: meal.carbs || "0g",
        fat: meal.fat || "0g",
      }));

      setMealPlan(sanitizedPlan);
      setIsThinking(false);
      setIsRevealing(true);
      toast.success("Meal plan generated successfully!");
    } catch (error) {
      console.error("Error generating meal plan:", error);
      setIsThinking(false);
      setIsGenerating(false);
      toast.error("Failed to generate meal plan. Please try again.");
    }
  };

  const handleSaveClick = () => {
    if (!userInfo) {
      toast.info("Please login to save your meal plan");
      return;
    }

    if (!mealPlan) {
      toast.error("No meal plan to save");
      return;
    }

    setShowModal(true);
  };

  const handleViewSavedPlans = () => {
    if (!userInfo) {
      toast.info("Please login to view your saved plans");
      return;
    }

    // Navigate to the SavedPlansPage with meal tab active
    navigate("/saved-plans?tab=meal");
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handlePlanSaved = (savedPlan) => {
    // You can update the current meal plan with the saved version if needed
    if (savedPlan && savedPlan.planData) {
      setMealPlan(savedPlan.planData);
    }
  };

  const resetForm = () => {
    setUserData({
      weight: "",
      height: "",
      age: "",
      gender: "",
      dietaryPreference: "",
      allergies: "",
      fitnessGoal: "",
      mealsPerDay: "3",
      calorieTarget: "",
    });
    setMealPlan(null);
    setIsRevealing(false);
    setIsGenerating(false);
  };

  return (
    <>
      <Container className="py-4">
        <Row>
          <Col lg={8} className="mx-auto">
            <Card className="shadow">
              <Card.Header className="bg-primary text-white">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h3 className="mb-0">AI Meal Planner</h3>
                    <small>
                      Generate personalized meal plans based on your goals
                    </small>
                  </div>
                  {userInfo && (
                    <Button
                      variant="outline-light"
                      size="sm"
                      onClick={handleViewSavedPlans}
                    >
                      View Your Saved Plans
                    </Button>
                  )}
                </div>
              </Card.Header>
              <Card.Body>
                <Form>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Weight (kg) *</Form.Label>
                        <Form.Control
                          type="number"
                          name="weight"
                          value={userData.weight}
                          onChange={handleInputChange}
                          placeholder="Enter your weight"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Height (cm) *</Form.Label>
                        <Form.Control
                          type="number"
                          name="height"
                          value={userData.height}
                          onChange={handleInputChange}
                          placeholder="Enter your height"
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Age *</Form.Label>
                        <Form.Control
                          type="number"
                          name="age"
                          value={userData.age}
                          onChange={handleInputChange}
                          placeholder="Enter your age"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Gender *</Form.Label>
                        <Form.Select
                          name="gender"
                          value={userData.gender}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Dietary Preference *</Form.Label>
                        <Form.Select
                          name="dietaryPreference"
                          value={userData.dietaryPreference}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select preference</option>
                          <option value="omnivore">Omnivore</option>
                          <option value="vegetarian">Vegetarian</option>
                          <option value="vegan">Vegan</option>
                          <option value="keto">Keto</option>
                          <option value="paleo">Paleo</option>
                          <option value="mediterranean">Mediterranean</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Fitness Goal *</Form.Label>
                        <Form.Select
                          name="fitnessGoal"
                          value={userData.fitnessGoal}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select goal</option>
                          <option value="weight_loss">Weight Loss</option>
                          <option value="muscle_gain">Muscle Gain</option>
                          <option value="maintenance">Maintenance</option>
                          <option value="endurance">Endurance</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Meals Per Day *</Form.Label>
                        <Form.Select
                          name="mealsPerDay"
                          value={userData.mealsPerDay}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="3">3 meals</option>
                          <option value="4">4 meals</option>
                          <option value="5">5 meals</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Calorie Target (optional)</Form.Label>
                        <Form.Control
                          type="number"
                          name="calorieTarget"
                          value={userData.calorieTarget}
                          onChange={handleInputChange}
                          placeholder="e.g., 2000"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Allergies (optional)</Form.Label>
                    <Form.Control
                      type="text"
                      name="allergies"
                      value={userData.allergies}
                      onChange={handleInputChange}
                      placeholder="e.g., nuts, dairy, gluten"
                    />
                  </Form.Group>

                  <div className="d-flex gap-2">
                    <Button
                      variant="primary"
                      onClick={generateMealPlan}
                      disabled={isGenerating}
                      className="flex-grow-1"
                    >
                      {isGenerating ? "Generating..." : "Generate Meal Plan"}
                    </Button>
                    <Button variant="outline-secondary" onClick={resetForm}>
                      Reset
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>

            {/* Thinking Animation */}
            {isThinking && (
              <div className="text-center my-4">
                <ThinkingAnimation />
              </div>
            )}

            {/* Meal Plan Results */}
            {mealPlan && !isThinking && (
              <Card className="shadow mt-4" ref={resultsRef}>
                <Card.Header className="bg-success text-white d-flex justify-content-between align-items-center">
                  <div>
                    <h4 className="mb-0">
                      {mealPlan.planType}: {mealPlan.planName}
                    </h4>
                    <small>Your Personalized Meal Plan</small>
                  </div>
                  <div className="d-flex gap-2 align-items-center">
                    <Badge bg="light" text="dark">
                      {currentDate}
                    </Badge>
                    <Button
                      variant="outline-light"
                      size="sm"
                      onClick={handleSaveClick}
                    >
                      Save Plan
                    </Button>
                  </div>
                </Card.Header>
                <Card.Body>
                  <p className="lead">{mealPlan.summary}</p>

                  {/* Nutrition Summary */}
                  <Card className="mb-4">
                    <Card.Header>
                      <h5 className="mb-0">Daily Nutrition Summary</h5>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col sm={3}>
                          <div className="text-center">
                            <h6>Calories</h6>
                            <Badge bg="primary" className="fs-6">
                              {mealPlan.nutritionSummary.calories}
                            </Badge>
                          </div>
                        </Col>
                        <Col sm={3}>
                          <div className="text-center">
                            <h6>Protein</h6>
                            <Badge bg="success" className="fs-6">
                              {mealPlan.nutritionSummary.protein}
                            </Badge>
                          </div>
                        </Col>
                        <Col sm={3}>
                          <div className="text-center">
                            <h6>Carbs</h6>
                            <Badge bg="warning" className="fs-6">
                              {mealPlan.nutritionSummary.carbs}
                            </Badge>
                          </div>
                        </Col>
                        <Col sm={3}>
                          <div className="text-center">
                            <h6>Fat</h6>
                            <Badge bg="info" className="fs-6">
                              {mealPlan.nutritionSummary.fat}
                            </Badge>
                          </div>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>

                  {/* Meals */}
                  <Row>
                    {mealPlan.meals.map((meal, index) => (
                      <Col md={6} lg={4} key={index} className="mb-3">
                        <Card className="h-100">
                          <Card.Header>
                            <h6 className="mb-0">{meal.name}</h6>
                          </Card.Header>
                          <Card.Body>
                            <ListGroup variant="flush">
                              {meal.foods.map((food, foodIndex) =>
                                renderFoodItem(food, foodIndex)
                              )}
                            </ListGroup>
                            <div className="mt-2">
                              <small className="text-muted">
                                {meal.calories} cal | {meal.protein} protein |{" "}
                                {meal.carbs} carbs | {meal.fat} fat
                              </small>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>

                  {/* Tips */}
                  {mealPlan.tips && mealPlan.tips.length > 0 && (
                    <Card className="mt-4">
                      <Card.Header>
                        <h5 className="mb-0">Helpful Tips</h5>
                      </Card.Header>
                      <Card.Body>
                        <ListGroup variant="flush">
                          {mealPlan.tips.map((tip, index) => (
                            <ListGroup.Item key={index} className="px-0">
                              <i className="fas fa-lightbulb text-warning me-2"></i>
                              {String(tip)}
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      </Card.Body>
                    </Card>
                  )}

                  {/* Action Buttons */}
                  <div className="text-center mt-4">
                    <Button
                      variant="outline-primary"
                      onClick={generateMealPlan}
                      className="me-2"
                    >
                      Generate New Plan
                    </Button>
                    {userInfo && (
                      <Button variant="info" onClick={handleViewSavedPlans}>
                        View All Saved Plans
                      </Button>
                    )}
                  </div>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>

        {/* User Modal */}
        <UserModal
          show={showModal}
          handleClose={handleModalClose}
          mealPlan={mealPlan}
          userData={userData}
          onSave={handlePlanSaved}
        />

        {/* Toast Container */}
        <ToastContainer position="top-right" autoClose={3000} />
      </Container>
    </>
  );
};

export default MealPlan;
