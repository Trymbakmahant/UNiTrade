import { z } from "zod";
import { createRoute, OpenAPIHono } from "@hono/zod-openapi";

// Base schemas
export const ErrorResponse = z.object({
  error: z.string(),
});

export const SuccessResponse = z.object({
  message: z.string(),
});

// Auth schemas
export const LoginRequest = z.object({
  walletAddress: z.string().min(42).max(42).openapi({
    description: "Ethereum wallet address",
    example: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
  }),
  signature: z.string().openapi({
    description: "Wallet signature for authentication",
    example: "0x1234567890abcdef...",
  }),
});

export const RegisterRequest = z.object({
  walletAddress: z.string().min(42).max(42).openapi({
    description: "Ethereum wallet address",
    example: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
  }),
  name: z.string().min(2).optional().openapi({
    description: "User display name",
    example: "John Doe",
  }),
  email: z.string().email().optional().openapi({
    description: "User email address",
    example: "john@example.com",
  }),
  avatar: z.string().optional().openapi({
    description: "User avatar URL",
    example: "https://example.com/avatar.jpg",
  }),
});

export const UserResponse = z.object({
  id: z.string().openapi({ example: "1" }),
  walletAddress: z.string().openapi({
    example: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
  }),
  name: z.string().nullable().openapi({ example: "John Doe" }),
  email: z.string().nullable().openapi({ example: "john@example.com" }),
  avatar: z
    .string()
    .nullable()
    .openapi({ example: "https://example.com/avatar.jpg" }),
  joinDate: z.date().openapi({ example: "2024-01-01T00:00:00.000Z" }),
});

export const AuthResponse = z.object({
  message: z.string().openapi({ example: "Login successful" }),
  user: UserResponse,
  token: z.string().openapi({
    description: "JWT authentication token",
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  }),
});

// Trading schemas
export const TradingPair = z.object({
  id: z.string().openapi({ example: "1" }),
  baseAsset: z.string().openapi({ example: "ETH" }),
  quoteAsset: z.string().openapi({ example: "USDT" }),
  currentPrice: z.number().openapi({ example: 2500.5 }),
  volume24h: z.number().openapi({ example: 1000000 }),
  priceChange24h: z.number().openapi({ example: 2.5 }),
});

export const OrderRequest = z.object({
  pairId: z.string().openapi({
    description: "Trading pair ID",
    example: "1",
  }),
  type: z.enum(["BUY", "SELL"]).openapi({
    description: "Order type",
    example: "BUY",
  }),
  amount: z.number().positive().openapi({
    description: "Order amount",
    example: 1.5,
  }),
  price: z.number().positive().openapi({
    description: "Order price (for limit orders)",
    example: 2500.0,
  }),
  orderType: z.enum(["MARKET", "LIMIT"]).openapi({
    description: "Order type",
    example: "MARKET",
  }),
});

export const OrderResponse = z.object({
  id: z.string().openapi({ example: "1" }),
  pairId: z.string().openapi({ example: "1" }),
  userId: z.string().openapi({ example: "1" }),
  type: z.enum(["BUY", "SELL"]).openapi({ example: "BUY" }),
  amount: z.number().openapi({ example: 1.5 }),
  price: z.number().openapi({ example: 2500.0 }),
  orderType: z.enum(["MARKET", "LIMIT"]).openapi({ example: "MARKET" }),
  status: z
    .enum(["PENDING", "COMPLETED", "CANCELLED"])
    .openapi({ example: "PENDING" }),
  createdAt: z.date().openapi({ example: "2024-01-01T00:00:00.000Z" }),
});

// Portfolio schemas
export const PortfolioAsset = z.object({
  asset: z.string().openapi({ example: "ETH" }),
  amount: z.number().openapi({ example: 10.5 }),
  value: z.number().openapi({ example: 26250.0 }),
});

export const PortfolioResponse = z.object({
  id: z.string().openapi({ example: "1" }),
  userId: z.string().openapi({ example: "1" }),
  totalValue: z.number().openapi({ example: 50000.0 }),
  assets: z.array(PortfolioAsset),
  lastUpdated: z.date().openapi({ example: "2024-01-01T00:00:00.000Z" }),
});
