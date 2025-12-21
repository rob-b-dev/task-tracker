import express from "express";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcryptjs";

// Typing
import { Request, Response } from "express";
import type {
  UserId,
  RegisterRequest,
  UserResponse,
} from "../types/auth.types.ts";

// Router instance
const router = express.Router();

// GET - Check if email is available
router.get(
  "/check-email",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.query;

      if (!email || typeof email !== "string") {
        res.status(400).json({ error: "Email is required" });
        return;
      }

      // Check if email exists
      const existingUser = await prisma.user.findUnique({
        where: { email: email.trim().toLowerCase() },
      });

      if (existingUser) {
        res
          .status(409)
          .json({ error: "Email already exists", available: false });
        return;
      }

      res.status(200).json({ available: true });
    } catch (error) {
      console.error("Error checking email:", error);
      res.status(500).json({ error: "Failed to check email" });
    }
  }
);

// POST - Register new user - accepts RegisterRequest, returns UserResponse
router.post("/register", async (req: Request, res: Response): Promise<void> => {
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

    // Respond with non-sensitive user data
    res.status(201).json({
      user: { id: user.id, name: user.name, email: user.email } as UserResponse,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
});

export default router;
