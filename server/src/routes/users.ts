// src/routes/users.ts
import { OpenAPIHono } from "@hono/zod-openapi";
import {
  getProfile,
  updateProfile,
  getDashboard,
} from "../controllers/userController";
import { authMiddleware } from "../middleware/auth";
import {
  UserResponse,
  ErrorResponse,
  SuccessResponse,
} from "../schemas/openapi";
import { z } from "zod";

const users = new OpenAPIHono();

// Apply auth middleware to all routes
users.use("*", authMiddleware);

// Update profile request schema
const UpdateProfileRequest = z.object({
  name: z.string().min(2).optional().openapi({
    description: "User display name",
    example: "John Doe",
  }),
  avatar: z.string().optional().openapi({
    description: "User avatar URL",
    example: "https://example.com/avatar.jpg",
  }),
  walletAddress: z.string().min(42).max(42).optional().openapi({
    description: "Ethereum wallet address",
    example: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
  }),
});

// Dashboard response schema
const DashboardResponse = z.object({
  portfolio: z
    .object({
      id: z.string(),
      userId: z.string(),
      totalValue: z.number(),
      lastUpdated: z.date(),
    })
    .nullable(),
  recentTrades: z.array(
    z.object({
      id: z.string(),
      pairId: z.string(),
      type: z.enum(["BUY", "SELL"]),
      amount: z.number(),
      price: z.number(),
      total: z.number(),
      executedAt: z.date(),
    })
  ),
  activeOrders: z.array(
    z.object({
      id: z.string(),
      pairId: z.string(),
      type: z.enum(["BUY", "SELL"]),
      amount: z.number(),
      price: z.number(),
      orderType: z.enum(["MARKET", "LIMIT"]),
      status: z.enum(["PENDING", "COMPLETED", "CANCELLED"]),
      createdAt: z.date(),
    })
  ),
  stats: z.object({
    totalTrades: z.number(),
    totalVolume: z.number(),
  }),
});

// Get profile route
const getProfileRoute = users.openapi(
  {
    method: "get",
    path: "/profile",
    responses: {
      200: {
        content: {
          "application/json": {
            schema: z.object({
              user: UserResponse,
            }),
          },
        },
        description: "User profile retrieved successfully",
      },
      401: {
        content: {
          "application/json": {
            schema: ErrorResponse,
          },
        },
        description: "Unauthorized - invalid or missing token",
      },
      404: {
        content: {
          "application/json": {
            schema: ErrorResponse,
          },
        },
        description: "User not found",
      },
      500: {
        content: {
          "application/json": {
            schema: ErrorResponse,
          },
        },
        description: "Internal server error",
      },
    },
    tags: ["Users"],
    summary: "Get user profile",
    description: "Retrieve the current user profile information",
  },
  getProfile
);

// Update profile route
const updateProfileRoute = users.openapi(
  {
    method: "put",
    path: "/profile",
    request: {
      body: {
        content: {
          "application/json": {
            schema: UpdateProfileRequest,
          },
        },
      },
    },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: z.object({
              user: UserResponse,
            }),
          },
        },
        description: "Profile updated successfully",
      },
      401: {
        content: {
          "application/json": {
            schema: ErrorResponse,
          },
        },
        description: "Unauthorized - invalid or missing token",
      },
      500: {
        content: {
          "application/json": {
            schema: ErrorResponse,
          },
        },
        description: "Internal server error",
      },
    },
    tags: ["Users"],
    summary: "Update user profile",
    description: "Update the current user profile information",
  },
  updateProfile
);

// Get dashboard route
const getDashboardRoute = users.openapi(
  {
    method: "get",
    path: "/dashboard",
    responses: {
      200: {
        content: {
          "application/json": {
            schema: DashboardResponse,
          },
        },
        description: "Dashboard data retrieved successfully",
      },
      401: {
        content: {
          "application/json": {
            schema: ErrorResponse,
          },
        },
        description: "Unauthorized - invalid or missing token",
      },
      500: {
        content: {
          "application/json": {
            schema: ErrorResponse,
          },
        },
        description: "Internal server error",
      },
    },
    tags: ["Users"],
    summary: "Get user dashboard",
    description:
      "Retrieve user dashboard data including portfolio, recent trades, and statistics",
  },
  getDashboard
);

export default users;
