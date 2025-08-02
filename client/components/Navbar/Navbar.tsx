"use client";

import React, { useState } from "react";
import { User, LogOut, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/AuthModal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
const Navbar = () => {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  return (
    <nav className="bg-gray-900  border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo/Brand */}
        <div className="flex items-center">
          <h1 className="text-white text-xl font-bold">UNIFI</h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            <a
              onClick={() => router.push("/trade")}
              className="text-white cursor-pointer hover:text-gray-300 transition-colors"
            >
              Trade
            </a>
            <a
              onClick={() => router.push("/dashboard")}
              className="text-white cursor-pointer hover:text-gray-300 transition-colors"
            >
              Dashboard
            </a>
          </div>
          {/* Wallet Connection and User Profile */}
          <div className="flex items-center space-x-4">
            {/* Reown AppKit Wallet Button */}
            <appkit-button />

            {/* User Profile */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-10 h-10 p-0 bg-gray-800 hover:bg-gray-700"
                  >
                    <User className="w-5 h-5 text-gray-300" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-gray-800 border-gray-700">
                  <DropdownMenuItem className="text-white hover:bg-gray-700">
                    <User className="mr-2 h-4 w-4" />
                    <span>{user?.username || user?.email}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-600" />
                  <DropdownMenuItem
                    onClick={() => router.push("/dashboard/profile")}
                    className="text-white hover:bg-gray-700"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-600" />
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-red-400 hover:text-red-300 hover:bg-gray-700"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => {
                    setAuthMode("login");
                    setShowAuthModal(true);
                  }}
                  variant="ghost"
                  className="text-white hover:text-gray-300"
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => {
                    setAuthMode("register");
                    setShowAuthModal(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />
    </nav>
  );
};

export default Navbar;
