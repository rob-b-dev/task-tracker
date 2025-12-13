// Frontend types matching backend schema
// Dates come as strings from JSON API responses

export type Task = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  tags?: Tag[];
  createdAt: string; // ISO date string from API
  updatedAt: string; // ISO date string from API
};

export type Tag = {
  id: string;
  name: string;
  color: string | null;
  createdAt: string; // ISO date string from API
};

export type TaskTag = {
  taskId: string;
  tagId: string;
};

// Extended types for API responses
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
