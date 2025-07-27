"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

// Types for Binance data
interface BinanceKlineArray {
  0: number; // Open time
  1: string; // Open price
  2: string; // High price
  3: string; // Low price
  4: string; // Close price
  5: string; // Volume
  6: number; // Close time
  7: string; // Quote asset volume
  8: number; // Number of trades
  9: string; // Taker buy base asset volume
  10: string; // Taker buy quote asset volume
  11: string; // Ignore
}

interface ChartDataPoint {
  time: string;
  date: string;
  price: number;
  timestamp: number;
}

interface PriceChartProps {
  baseCurrency: string; // e.g., "ETH", "BTC", "SOL"
  quoteCurrency: string; // e.g., "USDT", "USDC", "BTC"
  title?: string;
  days?: number; // Default 1 for 24h, can be 7, 30, etc.
  interval?: string; // "1h", "4h", "1d", "1w"
  height?: string; // CSS height value
  showPriceBadge?: boolean; // Whether to show current price and change
}

// Binance symbol mapping for different cryptocurrencies
const BINANCE_SYMBOLS: { [key: string]: string } = {
  // Ethereum pairs
  ethereum: "ETHUSDT",
  eth: "ETHUSDT",
  "ethereum-usdc": "ETHUSDC",
  "eth-usdc": "ETHUSDC",

  // Bitcoin pairs
  bitcoin: "BTCUSDT",
  btc: "BTCUSDT",
  "bitcoin-usdc": "BTCUSDC",
  "btc-usdc": "BTCUSDC",

  // Solana pairs
  solana: "SOLUSDT",
  sol: "SOLUSDT",
  "solana-usdc": "SOLUSDC",
  "sol-usdc": "SOLUSDC",

  // Cardano pairs
  cardano: "ADAUSDT",
  ada: "ADAUSDT",

  // Polygon pairs
  polygon: "MATICUSDT",
  matic: "MATICUSDT",

  // Avalanche pairs
  avalanche: "AVAXUSDT",
  avax: "AVAXUSDT",

  // Chainlink pairs
  chainlink: "LINKUSDT",
  link: "LINKUSDT",

  // Uniswap pairs
  uniswap: "UNIUSDT",
  uni: "UNIUSDT",

  // Binance Coin pairs
  "binance-coin": "BNBUSDT",
  bnb: "BNBUSDT",

  // Ripple pairs
  ripple: "XRPUSDT",
  xrp: "XRPUSDT",

  // Litecoin pairs
  litecoin: "LTCUSDT",
  ltc: "LTCUSDT",

  // Polkadot pairs
  polkadot: "DOTUSDT",
  dot: "DOTUSDT",

  // Cosmos pairs
  cosmos: "ATOMUSDT",
  atom: "ATOMUSDT",

  // Tezos pairs
  tezos: "XTZUSDT",
  xtz: "XTZUSDT",

  // Algorand pairs
  algorand: "ALGOUSDT",
  algo: "ALGOUSDT",

  // Near Protocol pairs
  near: "NEARUSDT",
  "near-protocol": "NEARUSDT",

  // Filecoin pairs
  filecoin: "FILUSDT",
  fil: "FILUSDT",

  // The Graph pairs
  "the-graph": "GRTUSDT",
  grt: "GRTUSDT",

  // Livepeer pairs
  livepeer: "LPTUSDT",
  lpt: "LPTUSDT",

  // Audius pairs
  audius: "AUDIOUSDT",
  audio: "AUDIOUSDT",

  // Helium pairs
  helium: "HNTUSDT",
  hnt: "HNTUSDT",

  // IoTeX pairs
  iotex: "IOTXUSDT",
  iotx: "IOTXUSDT",

  // Kusama pairs
  kusama: "KSMUSDT",
  ksm: "KSMUSDT",

  // Monero pairs
  monero: "XMRUSDT",
  xmr: "XMRUSDT",

  // Bitcoin Cash pairs
  "bitcoin-cash": "BCHUSDT",
  bch: "BCHUSDT",

  // Stellar pairs
  stellar: "XLMUSDT",
  xlm: "XLMUSDT",

  // Tron pairs
  tron: "TRXUSDT",
  trx: "TRXUSDT",

  // EOS pairs
  eos: "EOSUSDT",

  // Binance USD pairs
  "binance-usd": "BUSDUSDT",
  busd: "BUSDUSDT",

  // DAI pairs
  dai: "DAIUSDT",

  // USD Coin pairs
  "usd-coin": "USDCUSDT",
  usdc: "USDCUSDT",

  // Tether pairs
  tether: "USDTUSDT",
  usdt: "USDTUSDT",
};

// Interval mapping for Binance API
const getBinanceInterval = (days: number, interval?: string): string => {
  // If interval is provided, use it directly
  if (interval) {
    return interval;
  }

  // Otherwise, use days-based logic
  if (days === 1) return "1h"; // 1 hour intervals for 24h
  if (days <= 7) return "4h"; // 4 hour intervals for 7 days
  if (days <= 30) return "1d"; // Daily intervals for 30 days
  return "1d"; // Default to daily
};

// Get the number of candles based on days and interval
const getCandleCount = (days: number, interval: string): number => {
  // Calculate based on interval and days
  if (interval === "1s") return Math.min(days * 24 * 60 * 60, 1000); // Max 1000 for 1s
  if (interval === "3s") return Math.min(days * 24 * 60 * 20, 1000); // Max 1000 for 3s
  if (interval === "5s") return Math.min(days * 24 * 60 * 12, 1000); // Max 1000 for 5s
  if (interval === "10s") return Math.min(days * 24 * 60 * 6, 1000); // Max 1000 for 10s
  if (interval === "15s") return Math.min(days * 24 * 60 * 4, 1000); // Max 1000 for 15s
  if (interval === "30s") return Math.min(days * 24 * 60 * 2, 1000); // Max 1000 for 30s
  if (interval === "1m") return Math.min(days * 24 * 60, 1000); // Max 1000 for 1m
  if (interval === "3m") return Math.min(days * 24 * 20, 1000); // Max 1000 for 3m
  if (interval === "5m") return Math.min(days * 24 * 12, 1000); // Max 1000 for 5m
  if (interval === "15m") return Math.min(days * 24 * 4, 1000); // Max 1000 for 15m
  if (interval === "30m") return Math.min(days * 24 * 2, 1000); // Max 1000 for 30m
  if (interval === "1h") return Math.min(Math.max(days * 24, 24), 500); // At least 24 candles for 1h, max 500
  if (interval === "2h") return Math.min(Math.max(days * 12, 12), 500); // At least 12 candles for 2h, max 500
  if (interval === "4h") return Math.min(Math.max(days * 6, 6), 500); // At least 6 candles for 4h, max 500
  if (interval === "6h") return Math.min(Math.max(days * 4, 4), 500); // At least 4 candles for 6h, max 500
  if (interval === "8h") return Math.min(Math.max(days * 3, 3), 500); // At least 3 candles for 8h, max 500
  if (interval === "12h") return Math.min(Math.max(days * 2, 2), 500); // At least 2 candles for 12h, max 500
  if (interval === "1d") return Math.min(Math.max(days, 7), 500); // At least 7 candles for 1d, max 500
  if (interval === "3d") return Math.min(Math.max(Math.ceil(days / 3), 7), 500); // At least 7 candles for 3d, max 500
  if (interval === "1w") return Math.min(Math.max(Math.ceil(days / 7), 7), 500); // At least 7 candles for 1w, max 500
  if (interval === "1M")
    return Math.min(Math.max(Math.ceil(days / 30), 7), 500); // At least 7 candles for 1M, max 500

  // Default fallback
  return Math.min(Math.max(days * 24, 24), 500); // At least 24 candles, max 500
};

export default function PriceChart({
  baseCurrency,
  quoteCurrency,
  title,
  days = 1,
  interval,
  height = "h-64",
  showPriceBadge = true,
}: PriceChartProps) {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [priceChange24h, setPriceChange24h] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [yAxisDomain, setYAxisDomain] = useState<[number, number]>([0, 0]);

  // Get the Binance symbol for the trading pair
  const getBinanceSymbol = (base: string, quote: string): string => {
    const baseUpper = base.toUpperCase();
    const quoteUpper = quote.toUpperCase();
    const symbol = `${baseUpper}${quoteUpper}`;

    // Check if we have a direct mapping
    const directKey = `${base}-${quote}`.toLowerCase();
    if (BINANCE_SYMBOLS[directKey]) {
      return BINANCE_SYMBOLS[directKey];
    }

    // Check if we have a base currency mapping
    const baseKey = base.toLowerCase();
    if (BINANCE_SYMBOLS[baseKey]) {
      return BINANCE_SYMBOLS[baseKey];
    }

    // Try to construct the symbol
    return symbol;
  };

  // Format the display title
  const getDisplayTitle = () => {
    if (title) return title;
    const base = baseCurrency.toUpperCase();
    const quote = quoteCurrency.toUpperCase();
    return `${base}/${quote}`;
  };

  // Calculate Y-axis domain with padding
  const calculateYAxisDomain = (data: ChartDataPoint[]): [number, number] => {
    if (data.length === 0) return [0, 0];

    const prices = data.map((point) => point.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    // Add 5% padding on top and bottom
    const padding = (maxPrice - minPrice) * 0.05;
    const paddedMin = Math.max(0, minPrice - padding);
    const paddedMax = maxPrice + padding;

    return [paddedMin, paddedMax];
  };

  // Fetch Binance data
  useEffect(() => {
    const fetchBinanceData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const symbol = getBinanceSymbol(baseCurrency, quoteCurrency);
        const binanceInterval = getBinanceInterval(days, interval);
        const limit = getCandleCount(days, binanceInterval);

        console.log("PriceChart Debug:", {
          baseCurrency,
          quoteCurrency,
          days,
          interval,
          symbol,
          binanceInterval,
          limit,
        });

        // Fetch data from Binance
        let response;
        try {
          response = await axios.get<BinanceKlineArray[]>(
            `https://api.binance.com/api/v3/klines`,
            {
              params: {
                symbol: symbol,
                interval: binanceInterval,
                limit: limit,
              },
              timeout: 10000,
            }
          );
        } catch (apiError) {
          // If the requested interval fails, try with a more common interval
          console.log("Primary interval failed, trying fallback...");
          const fallbackInterval = "1h"; // Use 1h as fallback
          const fallbackLimit = Math.min(Math.max(days * 24, 24), 500);

          response = await axios.get<BinanceKlineArray[]>(
            `https://api.binance.com/api/v3/klines`,
            {
              params: {
                symbol: symbol,
                interval: fallbackInterval,
                limit: fallbackLimit,
              },
              timeout: 10000,
            }
          );
        }

        // Transform the data for the chart
        const transformedData: ChartDataPoint[] = response.data
          .filter((kline) => {
            // Filter out invalid data points
            const price = parseFloat(kline[4]);
            const timestamp = kline[0];
            return !isNaN(price) && price > 0 && timestamp > 0;
          })
          .map((kline) => {
            const date = new Date(kline[0]);
            return {
              time: date.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              }),
              date: date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
              price: parseFloat(kline[4]), // Close price is at index 4
              timestamp: kline[0], // Open time is at index 0
            };
          });

        console.log("Raw API Response:", {
          responseLength: response.data.length,
          sampleKline: response.data[0],
          transformedLength: transformedData.length,
          allKlines: response.data.map((k) => [k[0], k[4]]), // Show timestamps and prices
        });

        // Sort data by timestamp to ensure chronological order
        transformedData.sort((a, b) => a.timestamp - b.timestamp);

        // Ensure we have at least 2 data points for the chart
        if (transformedData.length < 2) {
          console.error("Data validation failed:", {
            originalDataLength: response.data.length,
            filteredDataLength: transformedData.length,
            requestedLimit: limit,
            interval: binanceInterval,
            symbol: symbol,
          });
          throw new Error(
            `Insufficient data points: ${transformedData.length}. Need at least 2 for chart rendering. Requested ${limit} candles for ${binanceInterval} interval.`
          );
        }

        console.log("Binance API Response:", {
          symbol,
          interval: binanceInterval,
          limit,
          dataPoints: response.data.length,
          sampleData: response.data[0],
          transformedDataLength: transformedData.length,
          firstDataPoint: transformedData[0],
          lastDataPoint: transformedData[transformedData.length - 1],
        });

        setChartData(transformedData);

        console.log("Chart Data Set:", {
          dataLength: transformedData.length,
          firstPoint: transformedData[0],
          lastPoint: transformedData[transformedData.length - 1],
          priceRange: {
            min: Math.min(...transformedData.map((d) => d.price)),
            max: Math.max(...transformedData.map((d) => d.price)),
          },
        });

        // Calculate Y-axis domain
        const domain = calculateYAxisDomain(transformedData);
        setYAxisDomain(domain);

        // Get current price (last data point)
        if (transformedData.length > 0) {
          setCurrentPrice(transformedData[transformedData.length - 1].price);
        }

        // Calculate price change
        if (transformedData.length > 1) {
          const firstPrice = transformedData[0].price;
          const lastPrice = transformedData[transformedData.length - 1].price;
          const change = ((lastPrice - firstPrice) / firstPrice) * 100;
          setPriceChange24h(change);
        }
      } catch (err: unknown) {
        console.error("Error fetching Binance data:", err);

        let errorMessage = `Failed to load ${getDisplayTitle()} price data`;

        // Type guard for axios errors
        if (err && typeof err === "object" && "response" in err) {
          const axiosError = err as {
            response: { status: number; data?: unknown };
          };
          if (axiosError.response.status === 400) {
            errorMessage = `Trading pair ${getDisplayTitle()} not found on Binance.`;
          } else if (axiosError.response.status === 429) {
            errorMessage =
              "Rate limit exceeded. Please try again in a few minutes.";
          } else if (axiosError.response.status === 418) {
            errorMessage = "IP banned. Please try again later.";
          } else {
            errorMessage = `Server error (${axiosError.response.status}). Please try again.`;
          }
        } else if (err && typeof err === "object" && "request" in err) {
          // Network error
          errorMessage = "Network error. Please check your connection.";
        } else if (err && typeof err === "object" && "code" in err) {
          const timeoutError = err as { code: string };
          if (timeoutError.code === "ECONNABORTED") {
            errorMessage = "Request timeout. Please try again.";
          }
        }

        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBinanceData();

    // Refresh data every 5 minutes
    const refreshInterval = setInterval(fetchBinanceData, 5 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, [baseCurrency, quoteCurrency, days, interval]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 6, // Allow more decimals for crypto
    }).format(price);
  };

  const getTimeLabel = () => {
    // If interval is provided, use it for the label
    if (interval) {
      return interval;
    }

    // Otherwise, use days-based logic
    if (days === 1) return "24h";
    if (days === 7) return "7d";
    if (days === 30) return "30d";
    if (days === 90) return "90d";
    if (days === 365) return "1y";
    return `${days}d`;
  };

  // Custom tooltip component
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{ payload: ChartDataPoint }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-lg">
          <p className="text-gray-300 text-sm font-medium">{data.date}</p>
          <p className="text-gray-400 text-xs">{data.time}</p>
          <p className="text-blue-400 font-semibold">
            {formatPrice(data.price)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">{getDisplayTitle()}</CardTitle>
          {showPriceBadge && !isLoading && !error && (
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold">
                {formatPrice(currentPrice)}
              </span>
              <Badge
                variant="secondary"
                className={`${
                  priceChange24h >= 0
                    ? "bg-green-500/20 text-green-400 border-green-500/30"
                    : "bg-red-500/20 text-red-400 border-red-500/30"
                }`}
              >
                {priceChange24h >= 0 ? (
                  <TrendingUp className="w-3 h-3 mr-1" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-1" />
                )}
                {getTimeLabel()} {priceChange24h >= 0 ? "+" : ""}
                {priceChange24h.toFixed(2)}%
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div
            className={`${height} bg-gray-900 rounded-lg flex items-center justify-center`}
          >
            <div className="flex items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Loading chart data...</span>
            </div>
          </div>
        ) : error ? (
          <div
            className={`${height} bg-gray-900 rounded-lg flex items-center justify-center`}
          >
            <div className="text-red-400 text-center">
              <p>Error loading chart data</p>
              <p className="text-sm text-gray-400">{error}</p>
            </div>
          </div>
        ) : (
          <div className={`${height} bg-gray-900 rounded-lg p-4`}>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="time"
                    stroke="#9CA3AF"
                    fontSize={12}
                    tick={{ fill: "#9CA3AF" }}
                  />
                  <YAxis
                    domain={yAxisDomain}
                    stroke="#9CA3AF"
                    fontSize={12}
                    tick={{ fill: "#9CA3AF" }}
                    tickFormatter={(value) => `$${value.toFixed(2)}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: "#3B82F6" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-gray-400 text-center">
                  <p>No chart data available</p>
                  <p className="text-sm">Data points: {chartData.length}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
