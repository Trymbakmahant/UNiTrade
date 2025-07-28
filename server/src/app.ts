// src/app.ts
import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { serve } from "@hono/node-server";
import { swaggerUI } from "@hono/swagger-ui";
import { apiReference } from "@scalar/hono-api-reference";
import dotenv from "dotenv";

// Import routes
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import tradingRoutes from "./routes/trading";

// Import middleware
import { errorHandler } from "./middleware/errorHandler";
import { rateLimiter } from "./middleware/rateLimiter";

dotenv.config();

const app = new OpenAPIHono();

// Middleware
app.use("*", logger());
app.use(
  "*",
  cors({
    origin: ["http://localhost:3000", "https://your-frontend-domain.com"],
    credentials: true,
  })
);

// OpenAPI configuration
app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    title: "UniFi Trading API",
    version: "1.0.0",
    description: "A comprehensive API for the UniFi trading platform",
    contact: {
      name: "UniFi Team",
      email: "support@unifi.com",
    },
  },
  servers: [
    {
      url: "http://localhost:3001",
      description: "Development server",
    },
    {
      url: "https://api.unifi.com",
      description: "Production server",
    },
  ],
  tags: [
    {
      name: "Authentication",
      description: "User authentication and authorization endpoints",
    },
    {
      name: "Users",
      description: "User profile and dashboard management",
    },
    {
      name: "Trading",
      description: "Trading operations and order management",
    },
  ],
});

// Health check
app.get("/", (c) => c.json({ message: "UniFi Trading API", version: "1.0.0" }));

// API Documentation routes
app.get("/docs", swaggerUI({ url: "/doc" }));
app.get(
  "/reference",
  apiReference({
    spec: {
      url: "/doc",
    },
  })
);

// Routes
app.route("/api/auth", authRoutes);
app.route("/api/users", userRoutes);
app.route("/api/trading", tradingRoutes);

// Error handling
app.onError(errorHandler);

const port = parseInt(process.env.PORT || "3001");

console.log(`🚀 Server is running on port ${port}`);
console.log(`📚 API Documentation available at:`);
console.log(`   - Swagger UI: http://localhost:${port}/docs`);
console.log(`   - Scalar Reference: http://localhost:${port}/reference`);
console.log(`   - OpenAPI JSON: http://localhost:${port}/doc`);

serve({
  fetch: app.fetch,
  port,
});
