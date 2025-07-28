// src/routes/trading.ts
import { OpenAPIHono } from "@hono/zod-openapi";
import {
  createOrder,
  getOrders,
  cancelOrder,
} from "../controllers/tradingController";
import { authMiddleware } from "../middleware/auth";
import {
  OrderRequest,
  OrderResponse,
  ErrorResponse,
  SuccessResponse,
} from "../schemas/openapi";
import { z } from "zod";

const trading = new OpenAPIHono();

// Apply auth middleware to all routes
trading.use("*", authMiddleware);

// Create order request schema (updated to match controller)
const CreateOrderRequest = z.object({
  pair: z.string().openapi({
    description: "Trading pair (e.g., ETH/USDT)",
    example: "ETH/USDT",
  }),
  type: z.enum(["MARKET", "LIMIT", "STOP_LOSS", "TAKE_PROFIT"]).openapi({
    description: "Order type",
    example: "MARKET",
  }),
  side: z.enum(["BUY", "SELL"]).openapi({
    description: "Order side",
    example: "BUY",
  }),
  amount: z.number().positive().openapi({
    description: "Order amount",
    example: 1.5,
  }),
  price: z.number().positive().optional().openapi({
    description: "Order price (required for limit orders)",
    example: 2500.0,
  }),
  total: z.number().positive().openapi({
    description: "Total order value",
    example: 3750.0,
  }),
});

// Order response with trades
const OrderWithTradesResponse = z.object({
  id: z.string(),
  userId: z.string(),
  pair: z.string(),
  type: z.enum(["MARKET", "LIMIT", "STOP_LOSS", "TAKE_PROFIT"]),
  side: z.enum(["BUY", "SELL"]),
  amount: z.number(),
  price: z.number().nullable(),
  total: z.number(),
  status: z.enum(["PENDING", "FILLED", "CANCELLED"]),
  createdAt: z.date(),
  trades: z.array(
    z.object({
      id: z.string(),
      orderId: z.string(),
      userId: z.string(),
      pair: z.string(),
      type: z.enum(["BUY", "SELL"]),
      amount: z.number(),
      price: z.number(),
      total: z.number(),
      fee: z.number(),
      txHash: z.string(),
      executedAt: z.date(),
    })
  ),
});

// Orders list response
const OrdersListResponse = z.object({
  orders: z.array(OrderWithTradesResponse),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    pages: z.number(),
  }),
});

// Create order route
const createOrderRoute = trading.openapi(
  {
    method: "post",
    path: "/orders",
    request: {
      body: {
        content: {
          "application/json": {
            schema: CreateOrderRequest,
          },
        },
      },
    },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: z.object({
              message: z.string(),
              order: OrderWithTradesResponse,
              trade: z
                .object({
                  id: z.string(),
                  orderId: z.string(),
                  userId: z.string(),
                  pair: z.string(),
                  type: z.enum(["BUY", "SELL"]),
                  amount: z.number(),
                  price: z.number(),
                  total: z.number(),
                  fee: z.number(),
                  txHash: z.string(),
                  executedAt: z.date(),
                })
                .optional(),
            }),
          },
        },
        description: "Order created/executed successfully",
      },
      400: {
        content: {
          "application/json": {
            schema: ErrorResponse,
          },
        },
        description: "Bad request - insufficient balance or invalid order",
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
    tags: ["Trading"],
    summary: "Create trading order",
    description:
      "Create a new trading order (market, limit, stop-loss, or take-profit)",
  },
  createOrder
);

// Get orders route
const getOrdersRoute = trading.openapi(
  {
    method: "get",
    path: "/orders",
    request: {
      query: z.object({
        status: z.string().optional().openapi({
          description:
            "Filter by order status (all, PENDING, FILLED, CANCELLED)",
          example: "PENDING",
        }),
        page: z.string().optional().openapi({
          description: "Page number for pagination",
          example: "1",
        }),
        limit: z.string().optional().openapi({
          description: "Number of orders per page",
          example: "20",
        }),
      }),
    },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: OrdersListResponse,
          },
        },
        description: "Orders retrieved successfully",
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
    tags: ["Trading"],
    summary: "Get user orders",
    description: "Retrieve user orders with optional filtering and pagination",
  },
  getOrders
);

// Cancel order route
const cancelOrderRoute = trading.openapi(
  {
    method: "delete",
    path: "/orders/{id}",
    request: {
      params: z.object({
        id: z.string().openapi({
          description: "Order ID to cancel",
          example: "1",
        }),
      }),
    },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: SuccessResponse,
          },
        },
        description: "Order cancelled successfully",
      },
      400: {
        content: {
          "application/json": {
            schema: ErrorResponse,
          },
        },
        description: "Bad request - order cannot be cancelled",
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
        description: "Order not found",
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
    tags: ["Trading"],
    summary: "Cancel order",
    description: "Cancel a pending order by ID",
  },
  cancelOrder
);

export default trading;
