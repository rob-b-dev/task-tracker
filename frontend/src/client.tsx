import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Styles
import "./styles/app.css";
import "./styles/home.css";
import "./styles/nav.css";
import "./styles/tasks.css";

// Components
import Home from "./components/Home.tsx";
import Nav from "./components/Nav.tsx";
import CreateTask from "./components/CreateTask.tsx";
import ViewTasks from "./components/ViewTasks.tsx";
import Footer from "./components/Footer.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* Apply col layout and height to app for footer presentation */}
    <main className="flex flex-col min-h-screen">
      <ToastContainer position="top-left" autoClose={2000} />
      <BrowserRouter>
        <Nav />
        {/* Establish global width/padding on main content */}
        <div className="main-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreateTask />} />
            <Route path="/tasks" element={<ViewTasks />} />
          </Routes>
        </div>
      </BrowserRouter>
      {/* Push footer to bottom after establishing app height and col layout */}
      <div className="mt-auto">
        <Footer />
      </div>
    </main>
  </StrictMode>
);
