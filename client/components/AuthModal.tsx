"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { X, Mail, Lock, User, Wallet, Copy, RefreshCw } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "register";
}

export default function AuthModal({
  isOpen,
  onClose,
  initialMode = "login",
}: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    walletAddress: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const { login, register } = useAuth();

  // Wagmi hooks for wallet connection
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  // Update wallet address when wallet is connected
  useEffect(() => {
    if (isConnected && address) {
      setFormData((prev) => ({ ...prev, walletAddress: address }));
    }
  }, [isConnected, address]);

  // Validation functions
  const validateEmail = (email: string): string => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validatePassword = (password: string): string => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const validateUsername = (username: string): string => {
    if (!username) return "Username is required";
    if (username.length < 2) return "Username must be at least 2 characters";
    return "";
  };

  const validateWalletAddress = (walletAddress: string): string => {
    if (!walletAddress || walletAddress.trim() === "") return "";
    if (walletAddress.length !== 42 || !walletAddress.startsWith("0x")) {
      return "Wallet address must be a valid 42-character Ethereum address starting with 0x";
    }
    return "";
  };

  // Validate form data
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Validate email
    const emailError = validateEmail(formData.email);
    if (emailError) errors.email = emailError;

    // Validate password
    const passwordError = validatePassword(formData.password);
    if (passwordError) errors.password = passwordError;

    // Validate username for register mode
    if (mode === "register") {
      const usernameError = validateUsername(formData.username);
      if (usernameError) errors.username = usernameError;

      // Validate wallet address for register mode
      const walletError = validateWalletAddress(formData.walletAddress);
      if (walletError) errors.walletAddress = walletError;
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (mode === "login") {
        await login({
          email: formData.email,
          password: formData.password,
        });
      } else {
        const registerData: {
          email: string;
          password: string;
          username: string;
          walletAddress?: string;
        } = {
          email: formData.email,
          password: formData.password,
          username: formData.username,
        };

        // Only include walletAddress if it's not empty
        if (formData.walletAddress && formData.walletAddress.trim() !== "") {
          registerData.walletAddress = formData.walletAddress;
        }

        await register(registerData);
      }
      onClose();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleConnectWallet = () => {
    // Use the first available connector (usually MetaMask)
    const connector = connectors[0];
    if (connector) {
      connect({ connector });
    }
  };

  const handleDisconnectWallet = () => {
    disconnect();
    setFormData((prev) => ({ ...prev, walletAddress: "" }));
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader className="relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
          <CardTitle className="text-white text-center">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-300">
                  Username
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter username"
                    value={formData.username}
                    onChange={(e) =>
                      handleInputChange("username", e.target.value)
                    }
                    className={`pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 ${
                      fieldErrors.username ? "border-red-500" : ""
                    }`}
                    required
                  />
                </div>
                {fieldErrors.username && (
                  <p className="text-red-400 text-xs">{fieldErrors.username}</p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 ${
                    fieldErrors.email ? "border-red-500" : ""
                  }`}
                  required
                />
              </div>
              {fieldErrors.email && (
                <p className="text-red-400 text-xs">{fieldErrors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  className={`pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 ${
                    fieldErrors.password ? "border-red-500" : ""
                  }`}
                  required
                />
              </div>
              {fieldErrors.password && (
                <p className="text-red-400 text-xs">{fieldErrors.password}</p>
              )}
            </div>

            {mode === "register" && (
              <div className="space-y-2">
                <Label htmlFor="walletAddress" className="text-gray-300">
                  Wallet Address
                </Label>

                {isConnected && address ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-gray-700 border border-gray-600 rounded-md">
                      <div className="flex items-center space-x-2">
                        <Wallet className="w-4 h-4 text-green-400" />
                        <span className="text-white text-sm font-mono">
                          {formatAddress(address)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          type="button"
                          onClick={() => copyToClipboard(address)}
                          className="p-1 text-gray-400 hover:text-white"
                          title="Copy address"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={handleDisconnectWallet}
                          className="p-1 text-gray-400 hover:text-red-400"
                          title="Disconnect wallet"
                        >
                          <RefreshCw className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400">
                      Connected wallet will be linked to your account
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Button
                      type="button"
                      onClick={handleConnectWallet}
                      disabled={isPending}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center space-x-2"
                    >
                      <Wallet className="w-4 h-4" />
                      <span>
                        {isPending ? "Connecting..." : "Connect Wallet"}
                      </span>
                    </Button>
                    <p className="text-xs text-gray-400">
                      Connect your wallet to link it to your account (optional)
                    </p>
                  </div>
                )}
                {fieldErrors.walletAddress && (
                  <p className="text-red-400 text-xs">
                    {fieldErrors.walletAddress}
                  </p>
                )}
              </div>
            )}

            {error && (
              <div className="text-red-400 text-sm text-center">{error}</div>
            )}

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={loading}
            >
              {loading
                ? "Loading..."
                : mode === "login"
                ? "Sign In"
                : "Create Account"}
            </Button>
          </form>

          <Separator className="my-4 bg-gray-600" />

          <div className="text-center">
            <p className="text-gray-400 text-sm">
              {mode === "login"
                ? "Don't have an account?"
                : "Already have an account?"}
              <button
                onClick={() => setMode(mode === "login" ? "register" : "login")}
                className="text-blue-400 hover:text-blue-300 ml-1"
              >
                {mode === "login" ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
