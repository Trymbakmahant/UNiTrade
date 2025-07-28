// src/controllers/authController.ts
import { Context } from "hono";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const loginSchema = z.object({
  walletAddress: z.string().min(42).max(42), // Ethereum address length
  signature: z.string(),
});

const registerSchema = z.object({
  walletAddress: z.string().min(42).max(42),
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  avatar: z.string().optional(),
});

export const register = async (c: Context) => {
  try {
    const body = await c.req.json();
    const { walletAddress, name, email, avatar } = registerSchema.parse(body);

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { walletAddress },
    });

    if (existingUser) {
      return c.json({ error: "Wallet already registered" }, 400);
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        walletAddress,
        name,
        email,
        avatar,
      },
      select: {
        id: true,
        walletAddress: true,
        name: true,
        email: true,
        avatar: true,
        joinDate: true,
      },
    });

    // Create portfolio
    await prisma.portfolio.create({
      data: {
        userId: user.id,
      },
    });

    // Generate JWT
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    return c.json({
      message: "User registered successfully",
      user,
      token,
    });
  } catch (error) {
    return c.json({ error: "Registration failed" }, 500);
  }
};

export const login = async (c: Context) => {
  try {
    const body = await c.req.json();
    const { walletAddress, signature } = loginSchema.parse(body);

    // Find user by wallet address
    const user = await prisma.user.findUnique({
      where: { walletAddress },
    });

    if (!user) {
      return c.json({ error: "Wallet not registered" }, 401);
    }

    // In a real app, you would verify the signature here
    // For now, we'll just check if the wallet exists
    // TODO: Implement signature verification

    // Generate JWT
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    return c.json({
      message: "Login successful",
      user: {
        id: user.id,
        walletAddress: user.walletAddress,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        joinDate: user.joinDate,
      },
      token,
    });
  } catch (error) {
    return c.json({ error: "Login failed" }, 500);
  }
};

export const logout = async (c: Context) => {
  // In a real app, you might want to blacklist the token
  return c.json({ message: "Logged out successfully" });
};
