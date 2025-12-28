import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Context
import { AuthProvider } from "./context/AuthContext";

// Styles
import "./styles/reset.css";
import "./styles/index.css";
import "./styles/app.css";

// Components
import Home from "./components/pages/Home";
import Layout from "./components/layout/Layout";
import TaskView from "./components/tasks/TaskView";
import Login from "./components/auth/components/Login";
import Register from "./components/auth/components/Register";
import Profile from "./components/pages/Profile";
import NotFound from "./components/pages/NotFound";
// Route Guards
import ProtectedRoute from "./components/auth/routes/ProtectedRoute";
import UnauthenticatedRoute from "./components/auth/routes/UnauthenticatedRoute";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Routes with predefined layout */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route
              path="/tasks"
              element={
                <ProtectedRoute>
                  <TaskView />
                </ProtectedRoute>
              }
            />
            <Route
              path="/login"
              element={
                <UnauthenticatedRoute>
                  <Login />
                </UnauthenticatedRoute>
              }
            />
            <Route
              path="/register"
              element={
                <UnauthenticatedRoute>
                  <Register />
                </UnauthenticatedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* 404 route without layout */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        draggable
        pauseOnHover
        limit={1}
      />
    </AuthProvider>
  </StrictMode>
);
