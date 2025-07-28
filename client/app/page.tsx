"use client";
import Navbar from "@/components/Navbar/Navbar";
import {
  Shield,
  Zap,
  Globe,
  TrendingUp,
  ArrowRight,
  Coins,
  ArrowLeftRight,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative px-6 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="mb-8">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Decentralized
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                  {" "}
                  Stop-Loss{" "}
                </span>
                Trading
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Protect your investments across multiple chains with lower fees
                and seamless cross-chain bridging
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <appkit-button />
              <button
                onClick={() => router.push("/trade")}
                className="px-8 py-4 cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-2"
              >
                Start Trading
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  $0M+
                </div>
                <div className="text-gray-400">Total Volume Protected</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  0+
                </div>
                <div className="text-gray-400">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">0%</div>
                <div className="text-gray-400">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose UNIFI?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the future of decentralized trading with advanced
              stop-loss protection and cross-chain capabilities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Lower Fees */}
            <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 hover:border-blue-500 transition-all duration-200">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-6">
                <Coins className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Lower Fees
              </h3>
              <p className="text-gray-300">
                Save up to 80% on trading fees compared to traditional
                centralized exchanges. Our decentralized approach eliminates
                middlemen costs.
              </p>
            </div>

            {/* Cross-Chain Bridging */}
            <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 hover:border-purple-500 transition-all duration-200">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-6">
                <ArrowLeftRight className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Cross-Chain Bridging
              </h3>
              <p className="text-gray-300">
                Seamlessly bridge assets between Ethereum, Solana, Bitcoin, and
                other major chains. No more complex multi-step processes.
              </p>
            </div>

            {/* Advanced Protection */}
            <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 hover:border-green-500 transition-all duration-200">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Advanced Protection
              </h3>
              <p className="text-gray-300">
                Smart contract-based stop-loss orders that execute
                automatically, protecting your investments 24/7 across all
                supported chains.
              </p>
            </div>

            {/* Lightning Fast */}
            <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 hover:border-yellow-500 transition-all duration-200">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Lightning Fast
              </h3>
              <p className="text-gray-300">
                Execute trades and stop-loss orders in milliseconds. Our
                optimized infrastructure ensures minimal slippage.
              </p>
            </div>

            {/* Global Access */}
            <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 hover:border-red-500 transition-all duration-200">
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mb-6">
                <Globe className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Global Access
              </h3>
              <p className="text-gray-300">
                Access your portfolio from anywhere in the world. No
                geographical restrictions or KYC requirements.
              </p>
            </div>

            {/* Real-time Analytics */}
            <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 hover:border-indigo-500 transition-all duration-200">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Real-time Analytics
              </h3>
              <p className="text-gray-300">
                Advanced charts and analytics to track your performance across
                all chains in one unified dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Chains Section */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Supported Chains
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Trade and bridge assets across the most popular blockchain
              networks
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Ethereum */}
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full"></div>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Ethereum
              </h3>
              <p className="text-gray-400 text-sm">Smart contracts & DeFi</p>
            </div>

            {/* Solana */}
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-12 h-12 bg-purple-500 rounded-full"></div>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Solana</h3>
              <p className="text-gray-400 text-sm">High-speed transactions</p>
            </div>

            {/* Bitcoin */}
            <div className="text-center">
              <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-12 h-12 bg-orange-500 rounded-full"></div>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Bitcoin</h3>
              <p className="text-gray-400 text-sm">Digital gold standard</p>
            </div>

            {/* Polygon */}
            <div className="text-center">
              <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-12 h-12 bg-indigo-500 rounded-full"></div>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Polygon</h3>
              <p className="text-gray-400 text-sm">Scalable Ethereum L2</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-6 py-20 bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Get started with decentralized stop-loss trading in three simple
              steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl">
                1
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Connect Wallet
              </h3>
              <p className="text-gray-300">
                Connect your wallet using our secure Web3 integration. Support
                for all major wallet providers.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl">
                2
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Set Stop-Loss
              </h3>
              <p className="text-gray-300">
                Choose your assets and set stop-loss parameters. Our smart
                contracts will monitor prices 24/7.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl">
                3
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Auto Execute
              </h3>
              <p className="text-gray-300">
                When conditions are met, orders execute automatically across all
                supported chains with minimal slippage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Protect Your Investments?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of traders who trust UNIFI for their decentralized
            stop-loss needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <appkit-button />
            <button className="px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-gray-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">UNIFI</h3>
              <p className="text-gray-400">
                Decentralized stop-loss trading with cross-chain bridging
                capabilities.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Trading
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Bridging
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Analytics
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Community
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Security
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Compliance
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 UNIFI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
