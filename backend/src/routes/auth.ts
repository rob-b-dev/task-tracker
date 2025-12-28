import express from "express";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import type { RegisterRequest, LoginRequest } from "../types/auth.types.js";
import { authMiddleware } from "../middleware/auth.js";

// Router instance
const router = express.Router();

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

// GET - Check if email is available
router.get("/check-email", async (req: Request, res: Response) => {
  try {
    const { email } = req.query;

    if (!email || typeof email !== "string") {
      res.status(400).json({ error: "Email is required" });
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (existingUser) {
      res.status(409).json({ error: "Email already exists", available: false });
      return;
    }

    res.status(200).json({ available: true });
  } catch (error) {
    console.error("Error checking email:", error);
    res.status(500).json({ error: "Failed to check email" });
  }
});

// POST - Register new user - accepts RegisterRequest, returns UserResponse
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body as RegisterRequest;

    // Validation
    if (!name || !email || !password) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (existingUser) {
      res.status(409).json({ error: "User already exists" });
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: hashedPassword,
      },
    });

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
});

// POST - Login user - accepts LoginRequest, returns AuthResponse
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as LoginRequest;

    // Validation
    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Failed to login" });
  }
});

// GET - Get current user info (protected route)
router.get("/me", authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// POST - Logout user (clear cookie)
router.post("/logout", (_req: Request, res: Response) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
});

// DELETE - Delete user account (protected route)
router.delete("/me", authMiddleware, async (req: Request, res: Response) => {
  try {
    // Delete user (tasks will cascade delete due to schema)
    await prisma.user.delete({
      where: { id: req.userId },
    });

    // Clear cookie after deleting account
    res.clearCookie("token");
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete account" });
  }
});

export default router;
