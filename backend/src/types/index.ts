// Shared types that can be used by both backend and frontend
// These match the Prisma schema but don't require Prisma imports

export type Task = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Tag = {
  id: string;
  name: string;
  color: string | null;
  createdAt: Date;
};

export type TaskTag = {
  taskId: string;
  tagId: string;
};

// API response types for frontend consumption
export type TaskWithTags = Task & {
  tags?: Tag[];
};

export type TagWithTasks = Tag & {
  tasks?: Task[];
};

// API request types
export type CreateTaskRequest = {
  title: string;
  description?: string;
};

export type CreateTagRequest = {
  name: string;
  color?: string;
};
