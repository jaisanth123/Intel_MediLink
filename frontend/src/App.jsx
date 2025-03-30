// File: src/App.jsx
import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import LoginPage from "./components/auth/LoginPage";
import SignupPage from "./components/auth/SignupPage";
import Dashboard from "./components/Dashboard";
import FoodAnalyzer from "./components/FoodAnalyzer";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfilePage from "./components/profile/ProfilePage";
import HealthInsights from "./components/food-analyzer/HealthInsights.jsx";
import SentimentAnalysis from "./components/food-analyzer/SentimentAnalysis.jsx";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication status on mount
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const token = localStorage.getItem("token");
    const tokenExpiration = localStorage.getItem("tokenExpiration");

    if (token && tokenExpiration) {
      // Check if token is expired
      if (new Date().getTime() > parseInt(tokenExpiration)) {
        handleLogout();
      } else {
        setIsAuthenticated(true);
      }
    } else {
      setIsAuthenticated(false);
    }
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiration");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <LoginPage onLogin={handleLogin} />
          )
        }
      />
      <Route path="/signup" element={<SignupPage />} />
      <Route
        element={
          <Layout onLogout={handleLogout} isAuthenticated={isAuthenticated} />
        }
      >
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/food-analyzer"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <FoodAnalyzer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/health-insights"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <HealthInsights />
            </ProtectedRoute>
          }
        />

        <Route
          path="/sentiment-analysis"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <SentimentAnalysis />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
