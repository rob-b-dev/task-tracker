# Type Structure

This project uses a simple approach to keep types consistent between backend and frontend.

## Backend Types (`/backend/src/types/index.ts`)

The backend defines TypeScript types that mirror the Prisma schema. These types:

- Match the database structure exactly
- Use `Date` for date fields (as Prisma returns)
- Include API request/response types for documentation

```typescript
export type Task = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};
```

## Frontend Types (`/frontend/src/types/index.ts`)

The frontend has identical types with one key difference:

- Date fields are `string` instead of `Date` (JSON API responses serialize dates as ISO strings)

```typescript
export type Task = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  createdAt: string; // ISO date string from API
  updatedAt: string; // ISO date string from API
};
```

## Why Not Share Types?

While it might seem logical to share a single types file, keeping them separate:

- Avoids importing server-only packages (Prisma) into the frontend
- Makes the date serialization difference explicit
- Keeps frontend and backend truly independent
- Simplifies build and deployment

## Keeping Types in Sync

When you update the Prisma schema:

1. Run `npx prisma generate` in `/backend`
2. Update `/backend/src/types/index.ts` to match
3. Update `/frontend/src/types/index.ts` to match (using `string` for dates)
