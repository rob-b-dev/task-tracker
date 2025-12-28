import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { UserId } from "../types/auth.types.js";

/**
 * JWT payload interface for proper typing
 */
interface JwtPayload {
  userId: UserId;
  iat?: number;
  exp?: number;
}

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

if (JWT_SECRET === "your-secret-key-change-in-production") {
  console.warn(
    "⚠️  Warning: Using default JWT_SECRET. Set JWT_SECRET in .env file for production!"
  );
}

/**
 * Authentication middleware
 * Verifies JWT token from cookie and attaches userId to request
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
    // Get token from cookie
    const token = req.cookies.token;

    // Check if token exists
    if (!token) {
      res.status(401).json({ error: "No token provided" });
      return;
    }

    // Verify token and extract userId with proper typing
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    // Validate that userId exists in the decoded payload
    if (!decoded.userId) {
      res.status(401).json({ error: "Invalid token payload" });
      return;
    }

    req.userId = decoded.userId;

    // Proceed to next middleware/route handler
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};
