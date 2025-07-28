"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Activity,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import PriceChart from "@/components/PriceChart";

// Mock dashboard data
const dashboardData = {
  totalBalance: "$45,230.50",
  totalPL: "+$2,340.25",
  totalPLPercentage: "+5.4%",
  activeOrders: 3,
  completedTrades: 127,
  portfolioValue: "$42,890.25",
  portfolioChange: "+$1,890.25",
  portfolioChangePercentage: "+4.6%",
  recentActivity: [
    {
      type: "Buy",
      pair: "ETH/USDT",
      amount: "2.5 ETH",
      price: "$1,850",
      time: "2 min ago",
      status: "Completed",
    },
    {
      type: "Sell",
      pair: "BTC/USDT",
      amount: "0.1 BTC",
      price: "$29,500",
      time: "15 min ago",
      status: "Completed",
    },
    {
      type: "Buy",
      pair: "SOL/USDT",
      amount: "50 SOL",
      price: "$95.20",
      time: "1 hour ago",
      status: "Completed",
    },
  ],
  topHoldings: [
    { symbol: "ETH", amount: "5.2", value: "$9,620", change: "+2.4%" },
    { symbol: "BTC", amount: "0.3", value: "$8,850", change: "+1.8%" },
    { symbol: "SOL", amount: "120", value: "$11,424", change: "+5.2%" },
    { symbol: "ADA", amount: "2000", value: "$1,200", change: "-0.8%" },
  ],
};

export default function DashboardPage() {
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-400">
            Welcome back! Here&apos;s your trading overview.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Balance</p>
                  <p className="text-2xl font-bold">
                    {dashboardData.totalBalance}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-sm">
                      {dashboardData.totalPLPercentage}
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Portfolio Value</p>
                  <p className="text-2xl font-bold">
                    {dashboardData.portfolioValue}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <ArrowUpRight className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-sm">
                      {dashboardData.portfolioChangePercentage}
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Orders</p>
                  <p className="text-2xl font-bold">
                    {dashboardData.activeOrders}
                  </p>
                  <p className="text-gray-400 text-sm mt-2">Pending trades</p>
                </div>
                <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Completed Trades</p>
                  <p className="text-2xl font-bold">
                    {dashboardData.completedTrades}
                  </p>
                  <p className="text-gray-400 text-sm mt-2">Total trades</p>
                </div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Data */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">
                  Portfolio Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PriceChart
                  baseCurrency="ethereum"
                  quoteCurrency="usdt"
                  title="ETH/USDT"
                  days={7}
                  interval="1d"
                  height="h-80"
                  showPriceBadge={true}
                />
              </CardContent>
            </Card>
          </div>

          {/* Top Holdings */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Top Holdings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.topHoldings.map((holding, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-white">
                          {holding.symbol}
                        </p>
                        <p className="text-sm text-gray-400">
                          {holding.amount} {holding.symbol}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-white">
                          {holding.value}
                        </p>
                        <div className="flex items-center gap-1">
                          {holding.change.startsWith("+") ? (
                            <ArrowUpRight className="w-3 h-3 text-green-400" />
                          ) : (
                            <ArrowDownRight className="w-3 h-3 text-red-400" />
                          )}
                          <span
                            className={`text-sm ${
                              holding.change.startsWith("+")
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            {holding.change}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          activity.type === "Buy"
                            ? "bg-green-500/20"
                            : "bg-red-500/20"
                        }`}
                      >
                        {activity.type === "Buy" ? (
                          <ArrowUpRight className="w-5 h-5 text-green-400" />
                        ) : (
                          <ArrowDownRight className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-white">
                          {activity.pair}
                        </p>
                        <p className="text-sm text-gray-400">
                          {activity.amount} • {activity.price}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        className={`${
                          activity.type === "Buy"
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {activity.type}
                      </Badge>
                      <p className="text-sm text-gray-400 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
