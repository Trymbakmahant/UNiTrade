"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowDownUp,
  Settings,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import TokenSelector from "@/components/TokenSelector";
import {
  getQuote,
  getSwapTransaction,
  formatTokenAmount,
  parseTokenAmount,
  COMMON_TOKENS,
} from "@/lib/1inch";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";

interface Token {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logoURI?: string;
}

interface Quote {
  toTokenAmount: string;
  fromTokenAmount: string;
  estimatedGas: string;
  gasCost: string;
  priceImpact: string;
}

export default function SwapPage() {
  const { address, isConnected } = useAccount();

  // Token states
  const [fromToken, setFromToken] = useState<Token | undefined>(
    COMMON_TOKENS.ETH
  );
  const [toToken, setToToken] = useState<Token | undefined>(COMMON_TOKENS.USDC);
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");

  // Quote and swap states
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slippage, setSlippage] = useState(1);
  const [showSettings, setShowSettings] = useState(false);

  // Transaction states
  const [swapData, setSwapData] = useState<{
    tx: {
      to: string;
      data: string;
      value: string;
    };
  } | null>(null);
  const [isSwapping, setIsSwapping] = useState(false);

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Fetch quote when inputs change
  useEffect(() => {
    const fetchQuote = async () => {
      if (
        !fromToken ||
        !toToken ||
        !fromAmount ||
        parseFloat(fromAmount) <= 0
      ) {
        setQuote(null);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const amount = parseTokenAmount(fromAmount, fromToken.decimals);
        const quoteData = await getQuote(
          fromToken.address,
          toToken.address,
          amount
        );

        setQuote({
          toTokenAmount: formatTokenAmount(
            quoteData.toTokenAmount,
            toToken.decimals
          ),
          fromTokenAmount: formatTokenAmount(
            quoteData.fromTokenAmount,
            fromToken.decimals
          ),
          estimatedGas: quoteData.estimatedGas,
          gasCost: quoteData.gasCost,
          priceImpact: quoteData.priceImpact,
        });

        setToAmount(
          formatTokenAmount(quoteData.toTokenAmount, toToken.decimals)
        );
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch quote";
        setError(errorMessage);
        setQuote(null);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchQuote, 500);
    return () => clearTimeout(debounceTimer);
  }, [fromToken, toToken, fromAmount]);

  // Handle token swap
  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setFromAmount(toAmount);
    setToAmount("");
    setQuote(null);
  };

  // Handle swap execution
  const handleSwap = async () => {
    if (!address || !fromToken || !toToken || !fromAmount || !quote) {
      return;
    }

    setIsSwapping(true);
    setError(null);

    try {
      const amount = parseTokenAmount(fromAmount, fromToken.decimals);
      const swapData = await getSwapTransaction(
        fromToken.address,
        toToken.address,
        amount,
        address,
        slippage
      );

      setSwapData(swapData);

      // Execute the swap transaction using sendTransaction instead
      // Note: For 1inch integration, we need to use sendTransaction with raw data
      // This is a simplified version - in production you'd want to use the proper 1inch SDK
      console.log("Swap data prepared:", swapData);
      setError(
        "Swap execution not fully implemented - please use 1inch SDK for production"
      );
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to prepare swap";
      setError(errorMessage);
    } finally {
      setIsSwapping(false);
    }
  };

  // Reset form after successful swap
  useEffect(() => {
    if (isSuccess) {
      setFromAmount("");
      setToAmount("");
      setQuote(null);
      setSwapData(null);
    }
  }, [isSuccess]);

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
            <p className="text-muted-foreground mb-4">
              Please connect your wallet to start swapping tokens
            </p>
            <appkit-button />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Swap Tokens</h1>
        <p className="text-muted-foreground">
          Swap tokens instantly using 1inch aggregation
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Swap</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>

          {showSettings && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <label className="text-sm font-medium mb-2 block">
                Slippage Tolerance (%)
              </label>
              <Input
                type="number"
                value={slippage}
                onChange={(e) => setSlippage(parseFloat(e.target.value) || 1)}
                className="w-32"
                min="0.1"
                max="50"
                step="0.1"
              />
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          {/* From Token */}
          <div className="space-y-2">
            <label className="text-sm font-medium">From</label>
            <div className="flex gap-2">
              <TokenSelector
                selectedToken={fromToken}
                onTokenSelect={setFromToken}
              />
              <Input
                type="number"
                placeholder="0.0"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                className="flex-1"
                min="0"
                step="any"
              />
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSwapTokens}
              className="rounded-full p-2"
            >
              <ArrowDownUp className="h-4 w-4" />
            </Button>
          </div>

          {/* To Token */}
          <div className="space-y-2">
            <label className="text-sm font-medium">To</label>
            <div className="flex gap-2">
              <TokenSelector
                selectedToken={toToken}
                onTokenSelect={setToToken}
              />
              <Input
                type="number"
                placeholder="0.0"
                value={toAmount}
                onChange={(e) => setToAmount(e.target.value)}
                className="flex-1"
                min="0"
                step="any"
                readOnly
              />
            </div>
          </div>

          {/* Quote Information */}
          {quote && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Rate</span>
                <span>
                  1 {fromToken?.symbol} ={" "}
                  {(parseFloat(toAmount) / parseFloat(fromAmount)).toFixed(6)}{" "}
                  {toToken?.symbol}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Price Impact</span>
                <span
                  className={
                    parseFloat(quote.priceImpact) > 5
                      ? "text-red-500"
                      : "text-green-500"
                  }
                >
                  {parseFloat(quote.priceImpact).toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Estimated Gas</span>
                <span>{parseInt(quote.estimatedGas).toLocaleString()} gas</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Gas Cost</span>
                <span>${parseFloat(quote.gasCost).toFixed(4)}</span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          {/* Success Message */}
          {isSuccess && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-green-700 text-sm">
                Swap completed successfully!
              </span>
            </div>
          )}

          {/* Swap Button */}
          <Button
            onClick={handleSwap}
            disabled={
              !fromToken ||
              !toToken ||
              !fromAmount ||
              parseFloat(fromAmount) <= 0 ||
              loading ||
              isSwapping ||
              isPending ||
              isConfirming ||
              !quote
            }
            className="w-full"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            {isSwapping && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            {isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            {isConfirming && <Loader2 className="h-4 w-4 animate-spin mr-2" />}

            {loading
              ? "Getting Quote..."
              : isSwapping
              ? "Preparing Swap..."
              : isPending
              ? "Confirming Transaction..."
              : isConfirming
              ? "Processing Swap..."
              : !fromToken || !toToken
              ? "Select Tokens"
              : !fromAmount || parseFloat(fromAmount) <= 0
              ? "Enter Amount"
              : !quote
              ? "Getting Quote..."
              : "Swap"}
          </Button>

          {/* Transaction Status */}
          {hash && (
            <div className="text-center">
              <Badge variant="outline" className="text-xs">
                Transaction Hash: {hash.slice(0, 10)}...{hash.slice(-8)}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="mt-6">
        <CardContent className="p-4">
          <h3 className="font-semibold mb-2">About 1inch</h3>
          <p className="text-sm text-muted-foreground">
            1inch aggregates liquidity from multiple DEXs to provide the best
            swap rates. Your swap will be executed through the most efficient
            route available.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
