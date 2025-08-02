import axios from "axios";

// 1inch API base URL
const API_BASE_URL = "https://api.1inch.dev";

// Common token addresses on Ethereum mainnet
export const COMMON_TOKENS = {
  ETH: {
    symbol: "ETH",
    name: "Ethereum",
    address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    decimals: 18,
    logoURI: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
  },
  USDC: {
    symbol: "USDC",
    name: "USD Coin",
    address: "0xa0b86a33e6441b8c4c8c8c8c8c8c8c8c8c8c8c8c8",
    decimals: 6,
    logoURI:
      "https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png",
  },
  USDT: {
    symbol: "USDT",
    name: "Tether USD",
    address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
    decimals: 6,
    logoURI: "https://assets.coingecko.com/coins/images/325/small/Tether.png",
  },
  DAI: {
    symbol: "DAI",
    name: "Dai Stablecoin",
    address: "0x6b175474e89094c44da98b954eedeac495271d0f",
    decimals: 18,
    logoURI: "https://assets.coingecko.com/coins/images/9956/small/4943.png",
  },
  WETH: {
    symbol: "WETH",
    name: "Wrapped Ether",
    address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    decimals: 18,
    logoURI: "https://assets.coingecko.com/coins/images/2518/small/weth.png",
  },
};

// Get 1inch API key from environment
const getApiKey = () => {
  const apiKey = process.env.NEXT_PUBLIC_1INCH_API_KEY;
  if (!apiKey) {
    console.warn(
      "1inch API key not found. Please set NEXT_PUBLIC_1INCH_API_KEY in your .env.local"
    );
    return null;
  }
  return apiKey;
};

// Get token list from 1inch
export const getTokenList = async (chainId: number = 1) => {
  try {
    const apiKey = getApiKey();
    if (!apiKey) {
      // Return common tokens if no API key
      return Object.values(COMMON_TOKENS);
    }

    const response = await axios.get(
      `${API_BASE_URL}/swap/v5.2/${chainId}/tokens`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: "application/json",
        },
      }
    );

    return Object.values(response.data.tokens);
  } catch (error) {
    console.error("Error fetching token list:", error);
    // Fallback to common tokens
    return Object.values(COMMON_TOKENS);
  }
};

// Get quote from 1inch
export const getQuote = async (
  fromTokenAddress: string,
  toTokenAddress: string,
  amount: string,
  chainId: number = 1
) => {
  try {
    const apiKey = getApiKey();
    if (!apiKey) {
      throw new Error("1inch API key not found");
    }

    const response = await axios.get(
      `${API_BASE_URL}/swap/v5.2/${chainId}/quote`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: "application/json",
        },
        params: {
          src: fromTokenAddress,
          dst: toTokenAddress,
          amount: amount,
          includeTokensInfo: true,
          includeGas: true,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching quote:", error);
    throw error;
  }
};

// Get swap transaction data
export const getSwapTransaction = async (
  fromTokenAddress: string,
  toTokenAddress: string,
  amount: string,
  fromAddress: string,
  slippage: number = 1,
  chainId: number = 1
) => {
  try {
    const apiKey = getApiKey();
    if (!apiKey) {
      throw new Error("1inch API key not found");
    }

    const response = await axios.get(
      `${API_BASE_URL}/swap/v5.2/${chainId}/swap`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: "application/json",
        },
        params: {
          src: fromTokenAddress,
          dst: toTokenAddress,
          amount: amount,
          from: fromAddress,
          slippage: slippage,
          includeTokensInfo: true,
          includeGas: true,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching swap transaction:", error);
    throw error;
  }
};

// Format token amount
export const formatTokenAmount = (amount: string, decimals: number): string => {
  const num = parseFloat(amount) / Math.pow(10, decimals);
  return num.toFixed(6);
};

// Parse token amount
export const parseTokenAmount = (amount: string, decimals: number): string => {
  const num = parseFloat(amount) * Math.pow(10, decimals);
  return num.toString();
};
