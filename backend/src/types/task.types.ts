// Task types

export type CreateTaskRequest = {
  title: string;
  description?: string;
  status?: string;
  tags?: Array<{ name: string; color: string }>;
};

export type UpdateTaskRequest = {
  title?: string;
  description?: string;
  status?: string;
  tags?: Array<{ name: string; color: string }>;
};
