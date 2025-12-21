import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { UserId } from "../types/index.js";

/**
 * Extend Express Request interface to include userId property
 * This allows us to attach the authenticated user's ID to the request object
 */
declare global {
  namespace Express {
    interface Request {
      userId?: UserId;
    }
  }
}

// JWT secret key - should be set in .env file for production
const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

/**
 * Authentication middleware
 * Verifies JWT token from Authorization header and attaches userId to request
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    // Check if Authorization header exists and has Bearer token
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "No token provided" });
      return;
    }

    // Extract token (remove "Bearer " prefix)
    const token = authHeader.substring(7);

    // Verify token and extract userId
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: UserId };
    req.userId = decoded.userId;

    // Proceed to next middleware/route handler
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};
