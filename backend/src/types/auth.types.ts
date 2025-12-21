// Auth types

// User ID type alias for better documentation and refactoring
export type UserId = string;

// Auth types
export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type AuthResponse = {
  user: {
    id: UserId;
    name: string;
    email: string;
  };
  token: string;
};

export type UserResponse = {
  id: UserId;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};