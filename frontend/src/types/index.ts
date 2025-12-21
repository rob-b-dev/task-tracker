// Frontend types matching backend schema
// Dates come as strings from JSON API responses

export type UserId = string;

export type User = {
  id: UserId;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
};

export type AuthResponse = {
  user: User;
  token: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: string;
  tags?: Tag[];
  createdAt: string;
  updatedAt: string;
};

export type Tag = {
  id: string;
  name: string;
  color?: string;
  createdAt: string;
};
