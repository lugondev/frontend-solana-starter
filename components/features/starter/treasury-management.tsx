'use client';

import { useTreasury } from '@/lib/hooks/use-treasury';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWallet } from '@solana/wallet-adapter-react';
import { useState } from 'react';
import useSWR from 'swr';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

export function TreasuryManagement() {
  const { publicKey } = useWallet();
  const {
    loading,
    error,
    depositToTreasury,
    emergencyWithdraw,
    getTreasuryInfo,
  } = useTreasury();

  const [depositAmount, setDepositAmount] = useState(0.1);

  const { data: treasuryInfo, mutate } = useSWR(
    publicKey ? 'treasury' : null,
    getTreasuryInfo,
    { refreshInterval: 5000 }
  );

  if (!publicKey) {
    return (
      <Card title="Treasury Management">
        <p className="text-gray-600">Connect your wallet to manage treasury</p>
      </Card>
    );
  }

  return (
    <Card title="Treasury Management">
      <div className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {treasuryInfo && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Treasury Balance</p>
            <p className="text-3xl font-bold text-blue-600">
              {(treasuryInfo.balance / LAMPORTS_PER_SOL).toFixed(4)} SOL
            </p>
            <p className="text-xs font-mono text-gray-500 mt-2 break-all">
              {treasuryInfo.address.toBase58()}
            </p>
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Deposit Amount (SOL)
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              step="0.01"
              min="0"
              value={depositAmount}
              onChange={(e) => setDepositAmount(Number(e.target.value))}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Button
              onClick={async () => {
                try {
                  const lamports = Math.floor(depositAmount * LAMPORTS_PER_SOL);
                  await depositToTreasury(lamports);
                  await mutate();
                } catch (err) {
                  console.error('Deposit failed:', err);
                }
              }}
              loading={loading}
            >
              Deposit
            </Button>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <Button
            onClick={async () => {
              if (!publicKey) return;
              if (!confirm('Emergency withdraw will drain all funds from treasury. Continue?')) {
                return;
              }
              try {
                await emergencyWithdraw(publicKey);
                await mutate();
              } catch (err) {
                console.error('Emergency withdraw failed:', err);
              }
            }}
            loading={loading}
            variant="secondary"
            className="w-full"
          >
            Emergency Withdraw (Admin Only)
          </Button>
        </div>
      </div>
    </Card>
  );
}
