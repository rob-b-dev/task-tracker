import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

// Create adapter for Prisma with the database URL
const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || "file:./prisma/dev.db",
});

// Initialize and export Prisma Client
export const prisma = new PrismaClient({ adapter });
