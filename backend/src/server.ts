import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import tasksRouter from "./routes/tasks.js";
import authRouter from "./routes/auth.js";

// Load environment variables from .env file
dotenv.config();

// Create Express application
const app = express();
const PORT = process.env.PORT || 3000;

/**
 * Middleware Configuration
 */
// Enable CORS (Cross-Origin Resource Sharing) so our frontend can make requests
app.use(cors());

// Parse JSON request bodies - this allows us to read req.body
app.use(express.json());

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
