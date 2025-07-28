"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Mail, CreditCard, ExternalLink, TrendingUp } from "lucide-react";

// Mock user data
const userData = {
  name: "Alex Turner",
  email: "alex.turner@email.com",
  address: "0x123...456",
  avatar:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  joinDate: "2021",
  monthlyPL: "+12.5%",
  tradingHistory: [
    {
      date: "2023-08-15",
      pair: "ETH/USD",
      type: "Buy",
      price: "$1,800",
      amount: "1 ETH",
      status: "Filled",
    },
    {
      date: "2023-08-10",
      pair: "BTC/USD",
      type: "Sell",
      price: "$29,000",
      amount: "0.1 BTC",
      status: "Filled",
    },
    {
      date: "2023-08-05",
      pair: "ETH/USD",
      type: "Buy",
      price: "$1,750",
      amount: "0.5 ETH",
      status: "Filled",
    },
    {
      date: "2023-07-28",
      pair: "BTC/USD",
      type: "Sell",
      price: "$30,000",
      amount: "0.2 BTC",
      status: "Filled",
    },
    {
      date: "2023-07-20",
      pair: "ETH/USD",
      type: "Buy",
      price: "$1,700",
      amount: "1 ETH",
      status: "Filled",
    },
  ],
};

export default function ProfilePage() {
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Profile Section */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="relative inline-block mb-4">
                    <img
                      src={userData.avatar}
                      alt={userData.name}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                      <Badge
                        variant="secondary"
                        className="bg-green-500 text-white"
                      >
                        NATURAL
                      </Badge>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold mb-1">{userData.name}</h2>
                  <p className="text-gray-400 text-sm mb-2">alex.turner.com</p>
                  <p className="text-gray-400 text-sm">
                    Joined in {userData.joinDate}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Account Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Section */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Account</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-white font-medium">Email</p>
                    <p className="text-gray-400">{userData.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-white font-medium">Address</p>
                    <p className="text-gray-400">{userData.address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trading History */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Trading History</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Monthly P/L */}
                <div className="border border-green-500 rounded-lg p-4 bg-green-500/10">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">Monthly P/L</span>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-400" />
                      <span className="text-2xl font-bold text-green-400">
                        {userData.monthlyPL}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Trading Table */}
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-700 hover:bg-gray-700/50">
                        <TableHead className="text-gray-300">Date</TableHead>
                        <TableHead className="text-gray-300">Pair</TableHead>
                        <TableHead className="text-gray-300">Type</TableHead>
                        <TableHead className="text-gray-300">Price</TableHead>
                        <TableHead className="text-gray-300">Amount</TableHead>
                        <TableHead className="text-gray-300">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userData.tradingHistory.map((trade, index) => (
                        <TableRow
                          key={index}
                          className="border-gray-700 hover:bg-gray-700/50"
                        >
                          <TableCell className="text-gray-300">
                            {trade.date}
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {trade.pair}
                          </TableCell>
                          <TableCell className="text-gray-300">
                            <Badge
                              variant={
                                trade.type === "Buy" ? "default" : "secondary"
                              }
                              className={
                                trade.type === "Buy"
                                  ? "bg-green-500 text-white"
                                  : "bg-red-500 text-white"
                              }
                            >
                              {trade.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-300 font-mono">
                            {trade.price}
                          </TableCell>
                          <TableCell className="text-gray-300 font-mono">
                            {trade.amount}
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-green-500 text-white">
                              {trade.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Transaction Links */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Transaction Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-4 border border-gray-600 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer">
                  <ExternalLink className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-white font-medium">Etherscan</p>
                    <p className="text-gray-400 text-sm">
                      View your transaction history on Etherscan
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 border border-gray-600 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer">
                  <ExternalLink className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-white font-medium">Block Explorer</p>
                    <p className="text-gray-400 text-sm">
                      View your transaction history on Block Explorer
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
