import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HealthWellness from "./components/HealthWellness";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import PrivateRoute from "./components/PrivateRoute"; // Component for protected routes
import "./index.css";
import GardeningTips from "./components/GardeningTips"; // Import the Gardening Tips component
import CommunityForum from "./components/Community";
import MyHerbs from "./pages/MyHerbs";
import AdminPanel from "./components/AdminPanel";
import Home from "./pages/Home"
const App = () => {
  return (
    
      <div>
        {/* Define your routes */}
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />}/>
          
          <Route path="/health-wellness" element={<HealthWellness />} />
          <Route path="/gardening-tips" element={<GardeningTips />} />
          <Route path="/myherbs" element={<MyHerbs />} />
          {/* Authentication routes */}
          <Route path="/login" element={<Login />} /> {/* Login Page */}
          <Route path="/register" element={<Register />} />{" "}
          {/* Register Page */}
          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                {" "}
                {/* Only accessible if logged in */}
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/community"
            element={
              <PrivateRoute>
                {" "}
                {/* Only accessible if logged in */}
                <CommunityForum />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                {" "}
                {/* Only accessible if logged in */}
                <AdminPanel />
              </PrivateRoute>
            }
          />
        </Routes>
        
      </div>

  );
};

export default App;



