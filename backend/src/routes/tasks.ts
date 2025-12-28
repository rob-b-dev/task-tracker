import express from "express";
import { prisma } from "../lib/prisma.js";
import { Request, Response } from "express";
import type {
  CreateTaskRequest,
  UpdateTaskRequest,
} from "../types/task.types.js";
import { authMiddleware } from "../middleware/auth.js";

// Router instance
const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// GET all tasks for the authenticated user - returns Task[]
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: req.userId },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Transform to include tags array
    const tasksWithTags = tasks.map((task: any) => ({
      ...task,
      tags: task.tags.map((tt: any) => tt.tag),
    }));

    res.json(tasksWithTags);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// POST create task - accepts CreateTaskRequest, returns Task
router.post(
  "/",
  async (
    req: Request<{}, {}, CreateTaskRequest>,
    res: Response
  ): Promise<void> => {
    try {
      const { title, description, status, tags } = req.body;

      // Remove duplicate tags by name
      const uniqueTags = tags?.length
        ? Array.from(
            new Map(tags.map((t) => [t.name.toLowerCase(), t])).values()
          )
        : [];

      const task = await prisma.task.create({
        data: {
          title: title.trim(),
          description: description?.trim() || null,
          status: status || "pending",
          userId: req.userId!,
          tags: uniqueTags.length
            ? {
                create: uniqueTags.map((tag) => ({
                  tag: {
                    connectOrCreate: {
                      where: { name: tag.name },
                      create: {
                        name: tag.name,
                        color: tag.color,
                      },
                    },
                  },
                })),
              }
            : undefined,
        },
        include: {
          tags: {
            include: {
              tag: true,
            },
          },
        },
      });

      const taskWithTags = {
        ...task,
        tags: task.tags.map((tt: any) => tt.tag),
      };

      res.status(201).json(taskWithTags);
    } catch (error) {
      console.error("Error creating task:", error);
      res.status(500).json({ error: "Failed to create task" });
    }
  }
);

// PUT update task - accepts UpdateTaskRequest, returns Task
router.put(
  "/:id",
  async (
    req: Request<{ id: string }, {}, UpdateTaskRequest>,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const { title, description, status, tags } = req.body;

      // Validation
      if (!title?.trim()) {
        res.status(400).json({ error: "Title is required" });
        return;
      }

      // Check if task belongs to user
      const existingTask = await prisma.task.findFirst({
        where: { id, userId: req.userId },
      });

      if (!existingTask) {
        res.status(404).json({ error: "Task not found" });
        return;
      }

      // Remove duplicate tags by name
      const uniqueTags = tags?.length
        ? Array.from(
            new Map(tags.map((t) => [t.name.toLowerCase(), t])).values()
          )
        : [];

      // Delete existing task-tag relationships
      await prisma.taskTag.deleteMany({
        where: { taskId: id },
      });

      // Update task with new data and tags
      const task = await prisma.task.update({
        where: { id },
        data: {
          title: title.trim(),
          description: description?.trim() || null,
          status: status,
          tags: uniqueTags.length
            ? {
                create: uniqueTags.map((tag) => ({
                  tag: {
                    connectOrCreate: {
                      where: { name: tag.name },
                      create: {
                        name: tag.name,
                        color: tag.color,
                      },
                    },
                  },
                })),
              }
            : undefined,
        },
        include: {
          tags: {
            include: {
              tag: true,
            },
          },
        },
      });

      const taskWithTags = {
        ...task,
        tags: task.tags.map((tt: any) => tt.tag),
      };

      res.json(taskWithTags);
    } catch (error) {
      console.error("Error updating task:", error);
      res.status(500).json({ error: "Failed to update task" });
    }
  }
);

// DELETE task by ID
router.delete(
  "/:id",
  async (
    req: Request<{ id: string }, {}, {}>,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;

      // Check if task belongs to user
      const existingTask = await prisma.task.findFirst({
        where: { id, userId: req.userId },
      });

      if (!existingTask) {
        res.status(404).json({ error: "Task not found" });
        return;
      }

      await prisma.task.delete({
        where: { id },
      });

      res.json({ message: "Task deleted successfully" });
    } catch (error) {
      console.error("Error deleting task:", error);
      res.status(500).json({ error: "Failed to delete task" });
    }
  }
);

export default router;
