import React, { useState, useEffect, createContext } from "react";
import { Route, Routes } from "react-router-dom";
import { Box } from "@mui/material";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import Home from "./pages/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Features from "./pages/Features";
import Workouts from "./pages/Workouts";
import BMRCalculator from "./pages/BMRCalculator";
import NutritionChecker from "./pages/NutritionChecker";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import ExercisePlanner from "./pages/ExercisePlanner";
import Dashboard from "./pages/Dashboard";
import Ai from "./pages/Ai";
import Contactus from "./pages/Contactus";
import SavedPlans from "./pages/SavedPlans";
import ViewPlan from "./pages/ViewPlan"; // Import the new component

// Create authentication context
export const AuthContext = createContext();

const App = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await axios.get("/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.data && response.data._id) {
            setUser(response.data);
            setIsAuthenticated(true);
          } else {
            // Invalid response
            localStorage.removeItem("token");
            setUser(null);
            setIsAuthenticated(false);
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Authentication error:", error);
        localStorage.removeItem("token");
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function to update auth context
  const login = (userData, token) => {
    localStorage.setItem("token", token);
    setUser(userData);
    setIsAuthenticated(true);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
  };

  // Authentication context value
  const authContextValue = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      <ToastContainer />
      <Box width="400px" sx={{ width: { x1: "1488px" } }} m="auto">
        {/* Only render Header when authenticated */}
        {isAuthenticated && <Header />}
        {!loading && (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/features" element={<Features />} />
            <Route path="/pages/workouts" element={<Workouts />} />
            <Route path="/contact" element={<Contactus />} />
            <Route path="/pages/about" element={<About />} />
            <Route
              path="/pages/exercise-planner"
              element={<ExercisePlanner />}
            />
            <Route path="/pages/bmr-calculator" element={<BMRCalculator />} />
            <Route
              path="/pages/nutrition-checker"
              element={<NutritionChecker />}
            />
            <Route path="/pages/dashboard" element={<Dashboard />} />
            <Route path="/saved-plans" element={<SavedPlans />} />
            <Route path="/plan/:planId" element={<ViewPlan />} />{" "}
            {/* New route for viewing a single plan */}
            <Route path="/pages/Ai" element={<Ai />} />
            {/* Public Route */}
            <Route path="" element={<PublicRoute />}>
              <Route path="/pages/register" element={<Register />} />
              <Route path="/pages/login" element={<Login />} />
            </Route>
            {/* Private Route */}
            <Route path="" element={<PrivateRoute />}>
              <Route path="/pages/profile/*" element={<Profile />} />
            </Route>
            {/* 404 Page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        )}
      </Box>
      {/* Only render Footer when authenticated */}
      {isAuthenticated && <Footer />}
    </AuthContext.Provider>
  );
};

export default App;
