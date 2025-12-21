import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Context
import { AuthProvider } from "./context/AuthContext";

// Styles
import "./styles/index.css";
import "./styles/app.css";

// Components
import Home from "./components/pages/Home";
import Nav from "./components/layout/Nav";
import TaskView from "./components/tasks/TaskView";
import Footer from "./components/layout/Footer";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Profile from "./components/pages/Profile";
import ProtectedRoute from "./components/auth/ProtectedRoute";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      {/* App shell */}
      <main className="flex flex-col h-screen">
        <BrowserRouter>
          {/* Fixed nav */}
          <Nav />

          {/* Content area - child inherits vh and prevent parent scrolling */}
          <div className="main-container h-full overflow-hidden">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/tasks"
                element={
                  <ProtectedRoute>
                    <TaskView />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </BrowserRouter>

        {/* Footer outside height calculation to  */}
        <Footer />
      </main>

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
