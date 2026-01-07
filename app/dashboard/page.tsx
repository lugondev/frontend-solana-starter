'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import Link from 'next/link';
import { WalletButton } from '@/components/features/wallet/wallet-button';
import { WalletBalance } from '@/components/features/wallet/wallet-balance';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Skeleton } from '@/components/ui/skeleton';
import { useBalance } from '@/lib/hooks/use-balance';
import { useTransactionHistory } from '@/lib/hooks/use-transaction-history';
import { useSendTransaction } from '@/lib/hooks/use-send-transaction';
import { formatAddress, formatNumber } from '@/lib/utils/format';
import { useState } from 'react';

export default function DashboardPage() {
  const { publicKey, connected } = useWallet();
  const { balance, isLoading: balanceLoading } = useBalance(publicKey);
  const { transactions, isLoading: txLoading } = useTransactionHistory(publicKey, {
    limit: 5,
  });
  const { send, loading: sendLoading } = useSendTransaction({
    onSuccess: (signature) => {
      alert(`Transaction sent! Signature: ${signature}`);
      setToAddress('');
      setAmount('');
    },
    onError: (error) => {
      alert(`Transaction failed: ${error.message}`);
    },
  });

  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');

  const handleSendTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!toAddress || !amount) return;
    await send(toAddress, parseFloat(amount));
  };

  if (!connected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black">
        <nav className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm">
          <div className="container mx-auto flex items-center justify-between px-4 py-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary" />
              <span className="text-xl font-bold">Solana Starter</span>
            </Link>
            <WalletButton />
          </div>
        </nav>

        <main className="container mx-auto px-4 py-12">
          <div className="mx-auto max-w-md">
            <Card className="text-center">
              <div className="mb-6">
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gray-700 flex items-center justify-center">
                  <svg
                    className="h-8 w-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white">
                  Wallet Not Connected
                </h2>
                <p className="mt-2 text-gray-400">
                  Please connect your wallet to access the dashboard
                </p>
              </div>
              <WalletButton />
            </Card>
          </div>
        </main>
      </div>
    );
  }

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

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="mt-2 text-gray-400">
            Manage your Solana wallet and transactions
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <Card title="Account Overview">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-400">
                    Wallet Address
                  </label>
                  <div className="mt-1 flex items-center gap-2">
                    <code className="rounded bg-gray-700 px-3 py-2 text-sm font-mono text-gray-200">
                      {publicKey ? formatAddress(publicKey.toString(), 8) : ''}
                    </code>
                    <button
                      onClick={() => {
                        if (publicKey) {
                          navigator.clipboard.writeText(publicKey.toString());
                        }
                      }}
                      className="rounded-lg p-2 hover:bg-gray-700 transition-colors"
                      title="Copy address"
                    >
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-400">
                    Balance
                  </label>
                  {balanceLoading ? (
                    <Skeleton className="mt-1 h-10 w-full" />
                  ) : (
                    <div className="mt-1 text-3xl font-bold text-white">
                      {balance?.sol ? formatNumber(balance.sol, 4) : '0'} SOL
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-400">
                    Network
                  </label>
                  <div className="mt-1 inline-flex items-center gap-2 rounded-full bg-green-900/50 px-3 py-1 text-sm font-medium text-green-400">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    {process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet'}
                  </div>
                </div>
              </div>
            </Card>

            <Card title="Send Transaction">
              <form onSubmit={handleSendTransaction} className="space-y-4">
                <div>
                  <label
                    htmlFor="toAddress"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Recipient Address
                  </label>
                  <input
                    type="text"
                    id="toAddress"
                    value={toAddress}
                    onChange={(e) => setToAddress(e.target.value)}
                    placeholder="Enter Solana address"
                    className="mt-1 block w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="amount"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Amount (SOL)
                  </label>
                  <input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    step="0.001"
                    min="0"
                    className="mt-1 block w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  loading={sendLoading}
                  disabled={!toAddress || !amount || sendLoading}
                >
                  Send Transaction
                </Button>
              </form>
            </Card>
          </div>

          <Card title="Recent Transactions" description="Your last 5 transactions">
            {txLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : transactions.length === 0 ? (
              <div className="py-8 text-center text-gray-400">
                No transactions found
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map((tx) => (
                  <div
                    key={tx.signature}
                    className="rounded-lg border border-gray-700 p-4 hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-400">
                            Signature
                          </span>
                          {tx.err ? (
                            <span className="rounded-full bg-red-900/50 px-2 py-0.5 text-xs font-medium text-red-400">
                              Failed
                            </span>
                          ) : (
                            <span className="rounded-full bg-green-900/50 px-2 py-0.5 text-xs font-medium text-green-400">
                              Success
                            </span>
                          )}
                        </div>
                        <code className="mt-1 block text-sm font-mono text-gray-200">
                          {formatAddress(tx.signature, 8)}
                        </code>
                        <div className="mt-2 text-xs text-gray-400">
                          Slot: {tx.slot}
                        </div>
                      </div>
                      <a
                        href={`https://solscan.io/tx/${tx.signature}?cluster=${process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet'}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg p-2 hover:bg-gray-700 transition-colors"
                        title="View on Explorer"
                      >
                        <svg
                          className="h-5 w-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}
