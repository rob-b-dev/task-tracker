import type { Task, Tag } from "../types";

/**
 * Fetch all tasks for the authenticated user
 * @param token - JWT authentication token
 * @returns Promise resolving to array of tasks (reversed for newest first)
 */
export const fetchTasks = async (token: string): Promise<Task[]> => {
  const res = await fetch("http://localhost:3000/api/tasks", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch tasks");
  const data = await res.json();
  return data.slice().reverse();
};

/**
 * Create a new task
 * @param taskData - Task data including title, description, status, and tags
 * @param token - JWT authentication token
 * @returns Promise resolving to the created task
 */
export const createTask = async (
  taskData: Partial<Task> & { tags: Tag[] },
  token: string
): Promise<Task> => {
  const res = await fetch("http://localhost:3000/api/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: taskData.title,
      description: taskData.description || null,
      status: taskData.status,
      tags: taskData.tags?.map((tag) => ({
        name: tag.name,
        color: tag.color ?? "#3b82f6",
      })),
    }),
  });
  if (!res.ok) throw new Error("Failed to create task");
  return res.json();
};

/**
 * Update an existing task
 * @param id - Task ID to update
 * @param taskData - Updated task data
 * @param token - JWT authentication token
 * @returns Promise resolving to the updated task
 */
export const updateTask = async (
  id: string,
  taskData: Partial<Task> & { tags: Tag[] },
  token: string
): Promise<Task> => {
  const res = await fetch(`http://localhost:3000/api/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: taskData.title,
      description: taskData.description || null,
      status: taskData.status,
      tags: taskData.tags?.map((tag) => ({
        name: tag.name,
        color: tag.color ?? "#3b82f6",
      })),
    }),
  });
  if (!res.ok) throw new Error("Failed to update task");
  return res.json();
};

/**
 * Delete a task
 * @param id - Task ID to delete
 * @param token - JWT authentication token
 * @returns Promise resolving when task is deleted
 */
export const deleteTask = async (id: string, token: string): Promise<void> => {
  const res = await fetch(`${"http://localhost:3000/api/tasks"}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to delete task");
};

/**
 * Filter tasks by search query and status
 * @param tasks - Array of tasks to filter
 * @param searchQuery - Search term to filter by (searches title, description, and tags)
 * @param statusFilter - Status to filter by ("all" shows all tasks)
 * @returns Filtered array of tasks
 */
export const filterTasks = (
  tasks: Task[],
  searchQuery: string,
  statusFilter: string
): Task[] => {
  const q = searchQuery.trim().toLowerCase();
  return tasks.filter((t) => {
    // Filter by status first
    if (statusFilter !== "all" && t.status !== statusFilter) return false;
    // If no search query, return true
    if (!q) return true;
    // Search in title, description, and tag names
    return (
      t.title.toLowerCase().includes(q) ||
      t.description?.toLowerCase().includes(q) ||
      t.tags?.some((tag) => tag.name.toLowerCase().includes(q))
    );
  });
};
