// src/routes/users.ts
import { Hono } from "hono";
import {
  getProfile,
  updateProfile,
  getDashboard,
} from "../controllers/userController";
import { authMiddleware } from "../middleware/auth";

const users = new Hono();

users.use("*", authMiddleware);
users.get("/profile", getProfile);
users.put("/profile", updateProfile);
users.get("/dashboard", getDashboard);

export default users;
