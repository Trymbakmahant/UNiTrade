"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { ChevronRight } from "lucide-react";
import PriceChart from "@/components/PriceChart";

// Available trading pairs for demo
const tradingPairs = [
  { base: "ethereum", quote: "usdt", name: "ETH/USDT" },
  { base: "bitcoin", quote: "usdt", name: "BTC/USDT" },
  { base: "solana", quote: "usdt", name: "SOL/USDT" },
  { base: "ethereum", quote: "usdc", name: "ETH/USDC" },
  { base: "bitcoin", quote: "usdc", name: "BTC/USDC" },
  { base: "cardano", quote: "usdt", name: "ADA/USDT" },
  { base: "polygon", quote: "usdt", name: "MATIC/USDT" },
  { base: "avalanche", quote: "usdt", name: "AVAX/USDT" },
  { base: "chainlink", quote: "usdt", name: "LINK/USDT" },
  { base: "uniswap", quote: "usdt", name: "UNI/USDT" },
];

const timeframes = [
  { days: 1, interval: "1h", label: "1H" },
  { days: 1, interval: "12h", label: "12H" },
  { days: 7, interval: "1d", label: "7D" },
  { days: 30, interval: "1d", label: "30D" },
];

export default function TradeDemoPage() {
  const [selectedPair, setSelectedPair] = useState(tradingPairs[0]);
  const [selectedTimeframe, setSelectedTimeframe] = useState(timeframes[0]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-center text-gray-400 text-sm mb-2">
          <span>Trade</span>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span>Demo</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Dynamic Chart Demo</h1>
            <p className="text-gray-400">
              Select different trading pairs and timeframes
            </p>
          </div>
        </div>
      </div>

      {/* Trading Pair Selector */}
      <Card className="bg-gray-800 border-gray-700 mb-6">
        <CardHeader>
          <CardTitle className="text-white">Select Trading Pair</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {tradingPairs.map((pair) => (
              <Button
                key={`${pair.base}-${pair.quote}`}
                variant={
                  selectedPair.name === pair.name ? "default" : "outline"
                }
                onClick={() => setSelectedPair(pair)}
                className="text-sm"
              >
                {pair.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Timeframe Selector */}
      <Card className="bg-gray-800 border-gray-700 mb-6">
        <CardHeader>
          <CardTitle className="text-white">Select Timeframe</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {timeframes.map((timeframe) => (
              <Button
                key={timeframe.days}
                variant={
                  selectedTimeframe.days === timeframe.days
                    ? "default"
                    : "outline"
                }
                onClick={() => setSelectedTimeframe(timeframe)}
                className="text-sm"
              >
                {timeframe.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2">
          <PriceChart
            baseCurrency={selectedPair.base}
            quoteCurrency={selectedPair.quote}
            title={selectedPair.name}
            days={selectedTimeframe.days}
            interval={selectedTimeframe.interval}
            height="h-96"
            showPriceBadge={true}
          />
        </div>

        {/* Multiple Charts Demo */}
        <PriceChart
          baseCurrency="bitcoin"
          quoteCurrency="usdt"
          title="BTC/USDT (1H)"
          days={1}
          interval="1h"
          height="h-64"
          showPriceBadge={true}
        />

        <PriceChart
          baseCurrency="solana"
          quoteCurrency="usdt"
          title="SOL/USDT (12H)"
          days={1}
          interval="12h"
          height="h-64"
          showPriceBadge={true}
        />

        <PriceChart
          baseCurrency="ethereum"
          quoteCurrency="usdc"
          title="ETH/USDC (4H)"
          days={1}
          interval="4h"
          height="h-64"
          showPriceBadge={false}
        />

        <PriceChart
          baseCurrency="cardano"
          quoteCurrency="usdt"
          title="ADA/USDT (1D)"
          days={7}
          interval="1d"
          height="h-64"
          showPriceBadge={true}
        />
      </div>

      {/* Usage Examples */}
      <Card className="bg-gray-800 border-gray-700 mt-6">
        <CardHeader>
          <CardTitle className="text-white">Usage Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-200">Basic Usage</h3>
              <pre className="bg-gray-900 p-3 rounded text-sm overflow-x-auto">
                {`<PriceChart 
  baseCurrency="ethereum"
  quoteCurrency="usdt"
  title="ETH/USDT"
/>`}
              </pre>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-gray-200">Advanced Usage</h3>
              <pre className="bg-gray-900 p-3 rounded text-sm overflow-x-auto">
                {`<PriceChart 
  baseCurrency="solana"
  quoteCurrency="usdc"
  title="SOL/USDC"
  days={1}
  interval="12h"
  height="h-80"
  showPriceBadge={false}
/>`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
