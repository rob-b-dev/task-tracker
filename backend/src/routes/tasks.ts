import express from "express";
import { prisma } from "../lib/prisma.js";
import type { CreateTaskRequest, UpdateTaskRequest } from "../types/index.js";
import { Request, Response } from "express";

const router = express.Router();

// GET all tasks - returns Task[]
router.get("/", async (req: Request, res: Response) => {
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
router.post("/", async (req: Request, res: Response) => {
  try {
    const { title, description, status, tags } = req.body as CreateTaskRequest;

    if (!title?.trim()) {
      return res.status(400).json({ error: "Title is required" });
    }

    // Remove duplicate tags by name
    const uniqueTags = tags?.length
      ? Array.from(new Map(tags.map((t) => [t.name.toLowerCase(), t])).values())
      : [];

    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        status: status || "pending",
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
});

// PUT update task - accepts UpdateTaskRequest, returns Task
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, status, tags } = req.body as UpdateTaskRequest;

    // First, delete existing tag relations if tags are being updated
    if (tags !== undefined) {
      await prisma.taskTag.deleteMany({
        where: { taskId: id },
      });
    }

    // Remove duplicate tags by name
    const uniqueTags = tags?.length
      ? Array.from(new Map(tags.map((t) => [t.name.toLowerCase(), t])).values())
      : [];

    const task = await prisma.task.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(description !== undefined && {
          description: description?.trim() || null,
        }),
        ...(status !== undefined && { status }),
        ...(uniqueTags.length > 0 && {
          tags: {
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
          },
        }),
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
});

// DELETE task by ID
router.delete(
  "/:id",
  async (req: Request<{ id: string }, {}, {}>, res: Response) => {
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
  }
);

export default router;
