// Frontend types matching backend schema
// Dates come as strings from JSON API responses

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
