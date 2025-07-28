// src/types/index.ts
export interface User {
  id: string;
  walletAddress: string;
  email?: string;
  name?: string;
  avatar?: string;
  joinDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  pair: string;
  type: "MARKET" | "LIMIT" | "STOP_LOSS" | "TAKE_PROFIT";
  side: "BUY" | "SELL";
  amount: number;
  price?: number;
  total: number;
  status: "PENDING" | "FILLED" | "CANCELLED" | "REJECTED";
  orderType: "MARKET" | "LIMIT" | "STOP_LOSS" | "TAKE_PROFIT";
  createdAt: Date;
  updatedAt: Date;
}

export interface Trade {
  id: string;
  orderId: string;
  userId: string;
  pair: string;
  type: "BUY" | "SELL";
  amount: number;
  price: number;
  total: number;
  fee: number;
  txHash?: string;
  executedAt: Date;
}

export interface Portfolio {
  id: string;
  userId: string;
  balance: number;
  totalPL: number;
  updatedAt: Date;
}

export interface JwtPayload {
  userId: string;
  iat: number;
  exp: number;
}
