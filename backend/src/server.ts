import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import tasksRouter from "./routes/tasks.js";
import authRouter from "./routes/auth.js";

// Load environment variables from .env file
import "dotenv/config";

// Create Express application
const app = express();
const PORT = process.env.PORT || 3000;

/**
 * Middleware Configuration
 */
// Enable CORS (Cross-Origin Resource Sharing) so our frontend can make requests
// Include credentials to allow cookies to be sent/received
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Parse JSON request bodies - this allows us to read req.body
app.use(express.json());

// Parse cookies from requests
app.use(cookieParser());

// API Routes
app.use("/api/tasks", tasksRouter);

app.use("/api/auth", authRouter);

/**
 * Health check endpoint
 * Useful for monitoring if the server is running
 */
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

/**
 * 404 handler for undefined routes
 */
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

/**
 * Start the server
 */
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
