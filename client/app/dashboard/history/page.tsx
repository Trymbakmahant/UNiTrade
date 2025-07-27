"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Filter,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Search,
} from "lucide-react";

// Mock history data
const historyData = [
  {
    id: "1",
    date: "2023-08-15",
    time: "14:30:25",
    pair: "ETH/USDT",
    type: "Buy",
    price: "$1,850.25",
    amount: "2.5 ETH",
    total: "$4,625.63",
    fee: "$2.31",
    status: "Completed",
    txHash: "0x1234...5678",
  },
  {
    id: "2",
    date: "2023-08-14",
    time: "09:15:42",
    pair: "BTC/USDT",
    type: "Sell",
    price: "$29,500.00",
    amount: "0.1 BTC",
    total: "$2,950.00",
    fee: "$1.48",
    status: "Completed",
    txHash: "0x8765...4321",
  },
  {
    id: "3",
    date: "2023-08-13",
    time: "16:45:18",
    pair: "SOL/USDT",
    type: "Buy",
    price: "$95.20",
    amount: "50 SOL",
    total: "$4,760.00",
    fee: "$2.38",
    status: "Completed",
    txHash: "0xabcd...efgh",
  },
  {
    id: "4",
    date: "2023-08-12",
    time: "11:22:33",
    pair: "ADA/USDT",
    type: "Sell",
    price: "$0.60",
    amount: "1000 ADA",
    total: "$600.00",
    fee: "$0.30",
    status: "Completed",
    txHash: "0x9876...5432",
  },
  {
    id: "5",
    date: "2023-08-11",
    time: "13:05:47",
    pair: "ETH/USDT",
    type: "Buy",
    price: "$1,800.00",
    amount: "1 ETH",
    total: "$1,800.00",
    fee: "$0.90",
    status: "Completed",
    txHash: "0x1111...2222",
  },
  {
    id: "6",
    date: "2023-08-10",
    time: "08:30:15",
    pair: "BTC/USDT",
    type: "Sell",
    price: "$30,000.00",
    amount: "0.05 BTC",
    total: "$1,500.00",
    fee: "$0.75",
    status: "Completed",
    txHash: "0x3333...4444",
  },
];

const filterOptions = {
  status: ["All", "Completed", "Pending", "Cancelled"],
  type: ["All", "Buy", "Sell"],
  pair: ["All", "ETH/USDT", "BTC/USDT", "SOL/USDT", "ADA/USDT"],
  timeRange: ["All Time", "Last 7 Days", "Last 30 Days", "Last 90 Days"],
};

export default function HistoryPage() {
  const [filters, setFilters] = useState({
    status: "All",
    type: "All",
    pair: "All",
    timeRange: "All Time",
  });

  const filteredData = historyData.filter((item) => {
    if (filters.status !== "All" && item.status !== filters.status)
      return false;
    if (filters.type !== "All" && item.type !== filters.type) return false;
    if (filters.pair !== "All" && item.pair !== filters.pair) return false;
    return true;
  });

  const totalTrades = filteredData.length;
  const totalVolume = filteredData.reduce((sum, item) => {
    return sum + parseFloat(item.total.replace("$", "").replace(",", ""));
  }, 0);

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Trading History</h1>
          <p className="text-gray-400">View and manage your trading activity</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Trades</p>
                  <p className="text-2xl font-bold">{totalTrades}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Volume</p>
                  <p className="text-2xl font-bold">
                    ${totalVolume.toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <ArrowUpRight className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Success Rate</p>
                  <p className="text-2xl font-bold">98.5%</p>
                </div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <ArrowDownRight className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Filters</CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-gray-300"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-gray-300"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm text-gray-300 mb-2 block">
                  Status
                </label>
                <Select
                  value={filters.status}
                  onValueChange={(value) =>
                    setFilters({ ...filters, status: value })
                  }
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {filterOptions.status.map((status) => (
                      <SelectItem
                        key={status}
                        value={status}
                        className="text-white hover:bg-gray-700"
                      >
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm text-gray-300 mb-2 block">Type</label>
                <Select
                  value={filters.type}
                  onValueChange={(value) =>
                    setFilters({ ...filters, type: value })
                  }
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {filterOptions.type.map((type) => (
                      <SelectItem
                        key={type}
                        value={type}
                        className="text-white hover:bg-gray-700"
                      >
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm text-gray-300 mb-2 block">Pair</label>
                <Select
                  value={filters.pair}
                  onValueChange={(value) =>
                    setFilters({ ...filters, pair: value })
                  }
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {filterOptions.pair.map((pair) => (
                      <SelectItem
                        key={pair}
                        value={pair}
                        className="text-white hover:bg-gray-700"
                      >
                        {pair}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm text-gray-300 mb-2 block">
                  Time Range
                </label>
                <Select
                  value={filters.timeRange}
                  onValueChange={(value) =>
                    setFilters({ ...filters, timeRange: value })
                  }
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {filterOptions.timeRange.map((range) => (
                      <SelectItem
                        key={range}
                        value={range}
                        className="text-white hover:bg-gray-700"
                      >
                        {range}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* History Table */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700 hover:bg-gray-700/50">
                    <TableHead className="text-gray-300">Date & Time</TableHead>
                    <TableHead className="text-gray-300">Pair</TableHead>
                    <TableHead className="text-gray-300">Type</TableHead>
                    <TableHead className="text-gray-300">Price</TableHead>
                    <TableHead className="text-gray-300">Amount</TableHead>
                    <TableHead className="text-gray-300">Total</TableHead>
                    <TableHead className="text-gray-300">Fee</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">Transaction</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item) => (
                    <TableRow
                      key={item.id}
                      className="border-gray-700 hover:bg-gray-700/50"
                    >
                      <TableCell className="text-gray-300">
                        <div>
                          <p className="font-medium">{item.date}</p>
                          <p className="text-sm text-gray-400">{item.time}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300 font-medium">
                        {item.pair}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${
                            item.type === "Buy"
                              ? "bg-green-500 text-white"
                              : "bg-red-500 text-white"
                          }`}
                        >
                          {item.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-300 font-mono">
                        {item.price}
                      </TableCell>
                      <TableCell className="text-gray-300 font-mono">
                        {item.amount}
                      </TableCell>
                      <TableCell className="text-gray-300 font-mono">
                        {item.total}
                      </TableCell>
                      <TableCell className="text-gray-300 font-mono">
                        {item.fee}
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-500 text-white">
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-400 hover:text-blue-300"
                        >
                          {item.txHash}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
