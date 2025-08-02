// src/controllers/authController.ts
import { Context } from "hono";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

// Wallet-based authentication schemas
const walletLoginSchema = z.object({
  walletAddress: z.string().min(42).max(42), // Ethereum address length
  signature: z.string(),
});

const walletRegisterSchema = z.object({
  walletAddress: z.string().min(42).max(42),
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  avatar: z.string().optional(),
});

// Email/password authentication schemas
const emailLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const emailRegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  username: z.string().min(2),
  walletAddress: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (val === undefined || val === "") return true;
        return val.length === 42 && val.startsWith("0x");
      },
      {
        message:
          "Wallet address must be a valid 42-character Ethereum address starting with 0x",
      }
    ),
});

export const register = async (c: Context) => {
  try {
    const body = await c.req.json();

    // Try email/password registration first
    try {
      const { email, password, username, walletAddress } =
        emailRegisterSchema.parse(body);

      // Check if user exists by email
      const existingUser = await prisma.user.findFirst({
        where: { email },
      });

      if (existingUser) {
        console.log("Email already registered");
        return c.json({ error: "Email already registered" }, 400);
      }

      // Hash password (you'll need to add bcrypt)
      const bcrypt = require("bcryptjs");
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          name: username,
          ...(walletAddress && { walletAddress }),
          password: hashedPassword,
        } as any,
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
        expiresIn: "5d",
      });

      return c.json({
        message: "User registered successfully",
        user,
        token,
      });
    } catch (emailError) {
      // If email registration fails, try wallet registration
      const { walletAddress, name, email, avatar } =
        walletRegisterSchema.parse(body);

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
        expiresIn: "5d",
      });

      return c.json({
        message: "User registered successfully",
        user,
        token,
      });
    }
  } catch (error) {
    console.log(error);
    return c.json({ error: "Registration failed" }, 500);
  }
};

export const login = async (c: Context) => {
  try {
    const body = await c.req.json();

    // Try email/password login first
    try {
      const { email, password } = emailLoginSchema.parse(body);

      // Find user by email
      const user = await prisma.user.findFirst({
        where: { email },
      });

      console.log(user);

      if (!user) {
        return c.json({ error: "Invalid credentials" }, 401);
      }

      // Verify password
      const bcrypt = require("bcryptjs");
      if (!user.password) {
        return c.json({ error: "Invalid credentials" }, 401);
      }
      const isValidPassword = await bcrypt.compare(password, user.password);
      console.log(isValidPassword);
      if (!isValidPassword) {
        console.log("Invalid Password");
        return c.json({ error: "Invalid Password" }, 401);
      }

      // Generate JWT
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
        expiresIn: "5d",
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
    } catch (emailError) {
      // If email login fails, try wallet login
      console.log(emailError);
      const { walletAddress, signature } = walletLoginSchema.parse(body);

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
        expiresIn: "5d",
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
    }
  } catch (error) {
    return c.json({ error: "Login failed" }, 500);
  }
};

export const logout = async (c: Context) => {
  // In a real app, you might want to blacklist the token
  return c.json({ message: "Logged out successfully" });
};
