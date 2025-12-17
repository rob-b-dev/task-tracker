import type { Task, Tag } from "../types";

const API_URL = `${import.meta.env.VITE_SERVER_API}/api/tasks`;

export const fetchTasks = async (): Promise<Task[]> => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Failed to fetch tasks");
  const data = await res.json();
  return data.slice().reverse();
};

export const createTask = async (
  taskData: Partial<Task> & { tags: Tag[] }
): Promise<Task> => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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

export const updateTask = async (
  id: string,
  taskData: Partial<Task> & { tags: Tag[] }
): Promise<Task> => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
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

export const deleteTask = async (id: string): Promise<void> => {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete task");
};

export const filterTasks = (
  tasks: Task[],
  searchQuery: string,
  statusFilter: string
): Task[] => {
  const q = searchQuery.trim().toLowerCase();
  return tasks.filter((t) => {
    if (statusFilter !== "all" && t.status !== statusFilter) return false;
    if (!q) return true;
    return (
      t.title.toLowerCase().includes(q) ||
      t.description?.toLowerCase().includes(q) ||
      t.tags?.some((tag) => tag.name.toLowerCase().includes(q))
    );
  });
};
