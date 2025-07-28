// src/controllers/userController.ts
import { Context } from "hono";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getProfile = async (c: Context) => {
  try {
    const userId = c.get("userId");

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        walletAddress: true,
        avatar: true,
        joinDate: true,
        portfolio: true,
      },
    });

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json({ user });
  } catch (error) {
    return c.json({ error: "Failed to get profile" }, 500);
  }
};

export const updateProfile = async (c: Context) => {
  try {
    const userId = c.get("userId");
    const body = await c.req.json();

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name: body.name,
        avatar: body.avatar,
        walletAddress: body.walletAddress,
      },
      select: {
        id: true,
        email: true,
        name: true,
        walletAddress: true,
        avatar: true,
        joinDate: true,
      },
    });

    return c.json({ user });
  } catch (error) {
    return c.json({ error: "Failed to update profile" }, 500);
  }
};

export const getDashboard = async (c: Context) => {
  try {
    const userId = c.get("userId");

    // Get user portfolio
    const portfolio = await prisma.portfolio.findUnique({
      where: { userId },
    });

    // Get recent trades
    const recentTrades = await prisma.trade.findMany({
      where: { userId },
      orderBy: { executedAt: "desc" },
      take: 10,
    });

    // Get active orders
    const activeOrders = await prisma.order.findMany({
      where: {
        userId,
        status: "PENDING",
      },
      orderBy: { createdAt: "desc" },
    });

    // Get trading statistics
    const totalTrades = await prisma.trade.count({
      where: { userId },
    });

    const totalVolume = await prisma.trade.aggregate({
      where: { userId },
      _sum: { total: true },
    });

    return c.json({
      portfolio,
      recentTrades,
      activeOrders,
      stats: {
        totalTrades,
        totalVolume: totalVolume._sum.total || 0,
      },
    });
  } catch (error) {
    return c.json({ error: "Failed to get dashboard data" }, 500);
  }
};
