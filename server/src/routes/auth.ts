// src/routes/auth.ts
import { Hono } from "hono";
import { register, login, logout } from "../controllers/authController";

const auth = new Hono();

auth.post("/register", register);
auth.post("/login", login);
auth.post("/logout", logout);

export default auth;
