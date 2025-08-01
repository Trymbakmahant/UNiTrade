// src/routes/trading.ts
import { Hono } from "hono";
import {
  createOrder,
  getOrders,
  cancelOrder,
} from "../controllers/tradingController";
import { authMiddleware } from "../middleware/auth";

const trading = new Hono();

trading.use("*", authMiddleware);
trading.post("/orders", createOrder);
trading.get("/orders", getOrders);
trading.delete("/orders/:id", cancelOrder);

export default trading;
