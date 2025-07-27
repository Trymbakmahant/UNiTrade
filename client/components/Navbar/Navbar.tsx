"use client";

import React from "react";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";
const Navbar = () => {
  const router = useRouter();
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
              onClick={() => router.push("/portfolio")}
              className="text-white cursor-pointer hover:text-gray-300 transition-colors"
            >
              Portfolio
            </a>
            <a
              onClick={() => router.push("/history")}
              className="text-white cursor-pointer hover:text-gray-300 transition-colors"
            >
              History
            </a>
          </div>
          {/* Wallet Connection and User Profile */}
          <div className="flex items-center space-x-4">
            {/* Reown AppKit Wallet Button */}
            <appkit-button />

            {/* User Profile Icon */}
            <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors">
              <User className="w-5 h-5 text-gray-300" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
