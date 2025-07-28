// src/middleware/errorHandler.ts
import { Context } from "hono";

export const errorHandler = (err: Error, c: Context) => {
  console.error(err);

  if (err.name === "ValidationError") {
    return c.json({ error: "Validation error", details: err.message }, 400);
  }

  if (err.name === "UnauthorizedError") {
    return c.json({ error: "Unauthorized" }, 401);
  }

  return c.json({ error: "Internal server error" }, 500);
};
