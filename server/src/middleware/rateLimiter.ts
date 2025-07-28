// src/middleware/rateLimiter.ts
import { Context, Next } from "hono";

const rateLimitMap = new Map();

export const rateLimiter = async (c: Context, next: Next) => {
  const ip = c.req.header("x-forwarded-for") || "unknown";
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 100;

  const key = `${ip}:${Math.floor(now / windowMs)}`;
  const current = rateLimitMap.get(key) || 0;

  if (current >= maxRequests) {
    return c.json({ error: "Rate limit exceeded" }, 429);
  }

  rateLimitMap.set(key, current + 1);
  await next();
};
