import axios from "axios";

// Enhanced error interface
interface EnhancedError extends Error {
  response?: {
    data?: { error?: string };
    status?: number;
  };
}

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear both session data and auth token
      localStorage.removeItem("sessionData");
      localStorage.removeItem("authToken");
      window.location.href = "/";
    }

    // Extract error message from response
    const errorMessage =
      error.response?.data?.error || error.message || "An error occurred";
    const enhancedError = new Error(errorMessage) as EnhancedError;
    enhancedError.response = error.response;

    return Promise.reject(enhancedError);
  }
);

// Types
export interface User {
  id: string;
  email: string;
  username: string;
  walletAddress?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
  walletAddress?: string;
}

export interface Order {
  id: string;
  userId: string;
  pair: string;
  type: "BUY" | "SELL";
  amount: number;
  price: number;
  total: number;
  status: "PENDING" | "COMPLETED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  pair: string;
  type: "BUY" | "SELL";
  amount: number;
  price: number;
}

export interface DashboardStats {
  totalBalance: number;
  totalPL: number;
  totalPLPercentage: number;
  activeOrders: number;
  completedTrades: number;
  portfolioValue: number;
  portfolioChange: number;
  portfolioChangePercentage: number;
}

export interface TradeHistory {
  id: string;
  pair: string;
  type: "BUY" | "SELL";
  amount: number;
  price: number;
  total: number;
  status: "COMPLETED";
  createdAt: string;
}

export interface PortfolioHolding {
  symbol: string;
  amount: number;
  value: number;
  change: number;
  changePercentage: number;
}

// Auth API
export const authAPI = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post("/api/auth/login", data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post("/api/auth/register", data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post("/api/auth/logout");
    localStorage.removeItem("authToken");
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get("/api/users/me");
    return response.data;
  },
};

// Trading API
export const tradingAPI = {
  createOrder: async (data: CreateOrderRequest): Promise<Order> => {
    const response = await api.post("/api/trading/orders", data);
    return response.data;
  },

  getOrders: async (): Promise<Order[]> => {
    const response = await api.get("/api/trading/orders");
    return response.data;
  },

  cancelOrder: async (orderId: string): Promise<void> => {
    await api.delete(`/api/trading/orders/${orderId}`);
  },
};

// User API
export const userAPI = {
  getProfile: async (): Promise<User> => {
    const response = await api.get("/api/users/profile");
    return response.data;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await api.put("/api/users/profile", data);
    return response.data;
  },

  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await api.get("/api/users/dashboard/stats");
    return response.data;
  },

  getTradeHistory: async (): Promise<TradeHistory[]> => {
    const response = await api.get("/api/users/trades");
    return response.data;
  },

  getPortfolioHoldings: async (): Promise<PortfolioHolding[]> => {
    const response = await api.get("/api/users/portfolio");
    return response.data;
  },
};

export default api;
