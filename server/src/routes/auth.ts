// src/routes/auth.ts
import { OpenAPIHono } from "@hono/zod-openapi";
import { register, login, logout } from "../controllers/authController";
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  SuccessResponse,
  ErrorResponse,
} from "../schemas/openapi";

const auth = new OpenAPIHono();

// Register route
const registerRoute = auth.openapi(
  {
    method: "post",
    path: "/register",
    request: {
      body: {
        content: {
          "application/json": {
            schema: RegisterRequest,
          },
        },
      },
    },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: AuthResponse,
          },
        },
        description: "User registered successfully",
      },
      400: {
        content: {
          "application/json": {
            schema: ErrorResponse,
          },
        },
        description: "Bad request - wallet already registered",
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
    tags: ["Authentication"],
    summary: "Register a new user",
    description:
      "Register a new user with wallet address and optional profile information",
  },
  register
);

// Login route
const loginRoute = auth.openapi(
  {
    method: "post",
    path: "/login",
    request: {
      body: {
        content: {
          "application/json": {
            schema: LoginRequest,
          },
        },
      },
    },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: AuthResponse,
          },
        },
        description: "Login successful",
      },
      401: {
        content: {
          "application/json": {
            schema: ErrorResponse,
          },
        },
        description: "Unauthorized - wallet not registered",
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
    tags: ["Authentication"],
    summary: "Login user",
    description: "Authenticate user with wallet address and signature",
  },
  login
);

// Logout route
const logoutRoute = auth.openapi(
  {
    method: "post",
    path: "/logout",
    responses: {
      200: {
        content: {
          "application/json": {
            schema: SuccessResponse,
          },
        },
        description: "Logout successful",
      },
    },
    tags: ["Authentication"],
    summary: "Logout user",
    description: "Logout the current user session",
  },
  logout
);

export default auth;
