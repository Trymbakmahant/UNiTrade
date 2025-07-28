"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

import { Separator } from "@/components/ui/separator";
import { ChevronRight } from "lucide-react";
import PriceChart from "@/components/PriceChart";

// Mock data for order book and trades (keeping these as they're not available via API)
const mockOrderBook = [
  { price: 1850.2, amount: 0.5, total: 925.1 },
  { price: 1850.15, amount: 1.2, total: 2220.18 },
  { price: 1850.1, amount: 0.8, total: 1480.08 },
  { price: 1850.05, amount: 0.3, total: 555.02 },
  { price: 1850.0, amount: 1.5, total: 2775.0 },
];

const mockRecentTrades = [
  { price: 1850.25, amount: 0.7, time: "10:30 PM" },
  { price: 1850.3, amount: 1.1, time: "10:25 PM" },
  { price: 1850.35, amount: 0.9, time: "10:20 PM" },
  { price: 1850.4, amount: 0.4, time: "10:15 PM" },
  { price: 1850.45, amount: 1.3, time: "10:10 PM" },
];

// Available trading pairs
const tradingPairs = [
  { value: "eth-usdt", label: "ETH/USDT", base: "ethereum", quote: "usdt" },
  { value: "btc-usdt", label: "BTC/USDT", base: "bitcoin", quote: "usdt" },
  { value: "sol-usdt", label: "SOL/USDT", base: "solana", quote: "usdt" },
  { value: "ada-usdt", label: "ADA/USDT", base: "cardano", quote: "usdt" },
  { value: "dot-usdt", label: "DOT/USDT", base: "polkadot", quote: "usdt" },
];

// Available time intervals
const timeIntervals = [
  { value: "15m", label: "15 Min", days: 1, interval: "1s" },

  { value: "1d", label: "1 Day", days: 1, interval: "1m" },
  { value: "3d", label: "3 Days", days: 3, interval: "3m" },
  { value: "5d", label: "5 Days", days: 5, interval: "5m" },
  { value: "1w", label: "1 Week", days: 7, interval: "15m" },
  { value: "1m", label: "1 Month", days: 30, interval: "1h" },
  { value: "3m", label: "3 Months", days: 90, interval: "4h" },
  { value: "6m", label: "6 Months", days: 180, interval: "8h" },
  { value: "1y", label: "1 Year", days: 365, interval: "1d" },
  { value: "5y", label: "5 Years", days: 1825, interval: "1w" },
];

export default function TradePage() {
  const [selectedPair, setSelectedPair] = useState("eth-usdt");
  const [selectedInterval, setSelectedInterval] = useState("1d");
  const [orderForm, setOrderForm] = useState({
    amount: "",
    price: "",
    total: "",
  });

  const currentPair =
    tradingPairs.find((pair) => pair.value === selectedPair) || tradingPairs[0];
  const currentInterval =
    timeIntervals.find((interval) => interval.value === selectedInterval) ||
    timeIntervals[2];

  const handleInputChange = (field: string, value: string) => {
    setOrderForm((prev) => {
      const newForm = { ...prev, [field]: value };

      // Auto-calculate total when amount and price are both filled
      if (field === "amount" || field === "price") {
        const amount = field === "amount" ? value : prev.amount;
        const price = field === "price" ? value : prev.price;

        if (amount && price) {
          const calculatedTotal = (
            parseFloat(amount) * parseFloat(price)
          ).toFixed(2);
          newForm.total = calculatedTotal;
        }
      }

      return newForm;
    });
  };

  const handlePlaceOrder = () => {
    // Handle order placement logic here
    console.log("Placing order:", orderForm);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-center text-gray-400 text-sm mb-2">
          <span>Trade</span>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span>{currentPair.label}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold mb-2">{currentPair.label}</h1>

            {/* Coin Selection Dropdown */}
            <div className="flex items-center gap-2">
              <Label htmlFor="trading-pair" className="text-gray-300 text-sm">
                Trading Pair:
              </Label>
              <Select value={selectedPair} onValueChange={setSelectedPair}>
                <SelectTrigger className="w-[180px] bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select trading pair" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {tradingPairs.map((pair) => (
                    <SelectItem
                      key={pair.value}
                      value={pair.value}
                      className="text-white hover:bg-gray-700 focus:bg-gray-700"
                    >
                      {pair.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Time Interval Dropdown */}
            <div className="flex items-center gap-2">
              <Label htmlFor="time-interval" className="text-gray-300 text-sm">
                Time Interval:
              </Label>
              <Select
                value={selectedInterval}
                onValueChange={setSelectedInterval}
              >
                <SelectTrigger className="w-[140px] bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select interval" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {timeIntervals.map((interval) => (
                    <SelectItem
                      key={interval.value}
                      value={interval.value}
                      className="text-white hover:bg-gray-700 focus:bg-gray-700"
                    >
                      {interval.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Chart and Order Book */}
        <div className="lg:col-span-2 space-y-6">
          {/* Price Chart */}
          <PriceChart
            baseCurrency={currentPair.base}
            quoteCurrency={currentPair.quote}
            title={currentPair.label}
            days={currentInterval.days}
            interval={currentInterval.interval}
            height="h-64"
            showPriceBadge={true}
          />

          {/* Order Book and Recent Trades */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Order Book */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Order Book</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700 hover:bg-gray-700/50">
                      <TableHead className="text-gray-300">Price</TableHead>
                      <TableHead className="text-gray-300">Amount</TableHead>
                      <TableHead className="text-gray-300">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockOrderBook.map((order, index) => (
                      <TableRow
                        key={index}
                        className="border-gray-700 hover:bg-gray-700/50"
                      >
                        <TableCell className="text-green-400 font-mono">
                          ${order.price.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-gray-300 font-mono">
                          {order.amount} {currentPair.base.toUpperCase()}
                        </TableCell>
                        <TableCell className="text-gray-300 font-mono">
                          ${order.total.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Recent Trades */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Recent Trades</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700 hover:bg-gray-700/50">
                      <TableHead className="text-gray-300">Price</TableHead>
                      <TableHead className="text-gray-300">Amount</TableHead>
                      <TableHead className="text-gray-300">Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockRecentTrades.map((trade, index) => (
                      <TableRow
                        key={index}
                        className="border-gray-700 hover:bg-gray-700/50"
                      >
                        <TableCell className="text-green-400 font-mono">
                          ${trade.price.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-gray-300 font-mono">
                          {trade.amount} {currentPair.base.toUpperCase()}
                        </TableCell>
                        <TableCell className="text-gray-400 text-sm">
                          {trade.time}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column - Place Order Form */}
        <div className="lg:col-span-1">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Place Order</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-gray-300">
                  Amount ({currentPair.base.toUpperCase()})
                </Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.0"
                  value={orderForm.amount}
                  onChange={(e) => handleInputChange("amount", e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price" className="text-gray-300">
                  Price ({currentPair.quote.toUpperCase()})
                </Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="0.0"
                  value={orderForm.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="total" className="text-gray-300">
                  Total ({currentPair.quote.toUpperCase()})
                </Label>
                <Input
                  id="total"
                  type="number"
                  placeholder="0.0"
                  value={orderForm.total}
                  onChange={(e) => handleInputChange("total", e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                />
              </div>

              <Separator className="bg-gray-600" />

              <Button
                onClick={handlePlaceOrder}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                Place Order
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
