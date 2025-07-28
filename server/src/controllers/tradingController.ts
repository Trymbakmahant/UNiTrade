// src/controllers/tradingController.ts
import { Context } from "hono";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const createOrderSchema = z.object({
  pair: z.string(),
  type: z.enum(["MARKET", "LIMIT", "STOP_LOSS", "TAKE_PROFIT"]),
  side: z.enum(["BUY", "SELL"]),
  amount: z.number().positive(),
  price: z.number().positive().optional(),
  total: z.number().positive(),
});

export const createOrder = async (c: Context) => {
  try {
    const userId = c.get("userId");
    const body = await c.req.json();
    const { pair, type, side, amount, price, total } =
      createOrderSchema.parse(body);

    // Check if user has sufficient balance for buy orders
    if (side === "BUY") {
      const portfolio = await prisma.portfolio.findUnique({
        where: { userId },
      });

      if (!portfolio || portfolio.balance.toNumber() < total) {
        return c.json({ error: "Insufficient balance" }, 400);
      }
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        userId,
        pair,
        type,
        side,
        amount,
        price,
        total,
        status: "PENDING",
      },
    });

    // For market orders, execute immediately
    if (type === "MARKET") {
      // Simulate trade execution
      const trade = await prisma.trade.create({
        data: {
          orderId: order.id,
          userId,
          pair,
          type: side,
          amount,
          price: price || 0,
          total,
          fee: total * 0.001, // 0.1% fee
          txHash: `tx_${Date.now()}`,
        },
      });

      // Update order status
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "FILLED" },
      });

      // Update portfolio
      await prisma.portfolio.update({
        where: { userId },
        data: {
          balance: side === "BUY" ? { decrement: total } : { increment: total },
          totalPL: { increment: side === "SELL" ? total * 0.001 : 0 },
        },
      });

      return c.json({
        message: "Order executed successfully",
        order,
        trade,
      });
    }

    return c.json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    return c.json({ error: "Failed to create order" }, 500);
  }
};

export const getOrders = async (c: Context) => {
  try {
    const userId = c.get("userId");
    const status = c.req.query("status");
    const page = parseInt(c.req.query("page") || "1");
    const limit = parseInt(c.req.query("limit") || "20");
    const offset = (page - 1) * limit;

    const where: any = { userId };
    if (status && status !== "all") {
      where.status = status;
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: offset,
      take: limit,
      include: {
        trades: true,
      },
    });

    const total = await prisma.order.count({ where });

    return c.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return c.json({ error: "Failed to get orders" }, 500);
  }
};

export const cancelOrder = async (c: Context) => {
  try {
    const userId = c.get("userId");
    const orderId = c.req.param("id");

    const order = await prisma.order.findFirst({
      where: { id: orderId, userId },
    });

    if (!order) {
      return c.json({ error: "Order not found" }, 404);
    }

    if (order.status !== "PENDING") {
      return c.json({ error: "Order cannot be cancelled" }, 400);
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status: "CANCELLED" },
    });

    return c.json({ message: "Order cancelled successfully" });
  } catch (error) {
    return c.json({ error: "Failed to cancel order" }, 500);
  }
};
