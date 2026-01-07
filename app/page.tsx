import Link from "next/link";
import { WalletButton } from "@/components/features/wallet/wallet-button";
import { WalletBalance } from "@/components/features/wallet/wallet-balance";
import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black">
      <nav className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary" />
            <span className="text-xl font-bold">Solana Starter</span>
          </Link>
          <div className="flex items-center gap-4">
            <WalletBalance />
            <WalletButton />
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="text-center">
            <h1 className="mb-4 text-5xl font-bold text-white">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Solana Web3
              </span>
            </h1>
            <p className="text-lg text-gray-400">
              A modern Next.js starter with optimized Solana integration
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card
              title="Connect Wallet"
              description="Connect your Solana wallet to get started"
            >
              <div className="space-y-4">
                <p className="text-sm text-gray-400">
                  Click the button above to connect your wallet. We support
                  Phantom, Solflare, and more.
                </p>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Real-time balance updates
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Automatic wallet detection
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Optimized data fetching
                  </li>
                </ul>
              </div>
            </Card>

            <Card
              title="Anchor Programs"
              description="Interact with on-chain programs"
            >
              <div className="space-y-4">
                <p className="text-sm text-gray-400">
                  Try out our demo programs built with Anchor framework
                </p>
                <Link
                  href="/programs"
                  className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-primary to-secondary rounded-lg font-semibold text-white hover:opacity-90 transition-opacity"
                >
                  Go to Programs Demo
                </Link>
                <ul className="space-y-2 text-sm text-gray-400 pt-2">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                    User Account Management
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                    Counter with CPI
                  </li>
                </ul>
              </div>
            </Card>

            <Card
              title="Features"
              description="What's included in this starter"
            >
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-secondary" />
                  <span>
                    <strong>Anchor Integration</strong> - Type-safe program interaction
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-secondary" />
                  <span>
                    <strong>Solana Web3.js</strong> - Full wallet adapter integration
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-secondary" />
                  <span>
                    <strong>SWR Caching</strong> - Optimized onchain data fetching
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-secondary" />
                  <span>
                    <strong>TypeScript</strong> - Full type safety
                  </span>
                </li>
              </ul>
            </Card>
          </div>

          <Card title="Quick Links" className="text-center">
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/dashboard"
                className="rounded-lg border-2 border-primary bg-primary px-6 py-3 font-medium text-white transition-all hover:bg-primary-dark"
              >
                Go to Dashboard
              </Link>
              <a
                href="https://docs.solana.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border-2 border-gray-600 bg-gray-800 px-6 py-3 font-medium text-gray-200 transition-all hover:border-gray-500 hover:bg-gray-700"
              >
                Solana Docs
              </a>
            </div>
          </Card>
        </div>
      </main>

      <footer className="border-t border-gray-800 bg-gray-900 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-gray-400">
          <p>
            Built with ❤️ using Next.js 16.1.1 and Solana Web3.js
          </p>
        </div>
      </footer>
    </div>
  );
}
