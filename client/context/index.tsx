"use client";

import React, { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, cookieToInitialState, type Config } from "wagmi";
import { createAppKit } from "@reown/appkit/react";
import { config, networks, projectId, wagmiAdapter } from "@/config";
import { sepolia } from "@reown/appkit/networks";
import { AuthProvider } from "./AuthContext";

const queryClient = new QueryClient();

const metadata = {
  name: "UNIFI App",
  description: "UNIFI app with Reown integration",
  url:
    typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3000",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

// Initialize AppKit *outside* the component render cycle
if (!projectId) {
  console.error("AppKit Initialization Error: Project ID is missing.");
} else {
  createAppKit({
    adapters: [wagmiAdapter],
    projectId: projectId!,
    networks: networks,
    defaultNetwork: sepolia,
    metadata,
    features: { analytics: true },
  });
}

export default function ContextProvider({
  children,
  cookies,
}: {
  children: ReactNode;
  cookies: string | null;
}) {
  // Calculate initial state for Wagmi SSR hydration
  const initialState = cookieToInitialState(config as Config, cookies);

  return (
    <WagmiProvider config={config as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>{children}</AuthProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
