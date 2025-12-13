import express from "express";
import { prisma } from "../lib/prisma.js";
import type { CreateTaskRequest } from "../types/index.js";

const router = express.Router();

// GET all tasks - returns Task[]
router.get("/", async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
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
router.post("/", async (req, res) => {
  try {
    const { title, description, status, tags } =
      req.body as CreateTaskRequest & {
        status?: string;
        tags?: Array<{ name: string; color: string }>;
      };

    if (!title?.trim()) {
      return res.status(400).json({ error: "Title is required" });
    }

    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        status: status || "pending",
        tags: tags?.length
          ? {
              create: tags.map((tag) => ({
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

    const taskWithTags: any = {
      ...task,
      tags: task.tags.map((tt: any) => tt.tag),
    };

    res.status(201).json(taskWithTags);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ error: "Failed to create task" });
  }
});

// DELETE task by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.task.delete({
      where: { id },
    });

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

export default router;
