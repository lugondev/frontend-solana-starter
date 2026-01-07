'use client';

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { useEffect, useState } from 'react';
import { formatNumber, lamportsToSol } from '@/lib/utils/format';

export function WalletBalance() {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!publicKey || !connected) {
      setBalance(null);
      return;
    }

    let subscriptionId: number | null = null;

    const fetchInitialBalance = async () => {
      setLoading(true);
      try {
        const bal = await connection.getBalance(publicKey);
        setBalance(lamportsToSol(bal));
      } catch (error) {
        console.error('Failed to fetch balance:', error);
      } finally {
        setLoading(false);
      }
    };

    const subscribeToBalanceChanges = () => {
      subscriptionId = connection.onAccountChange(
        publicKey,
        (accountInfo) => {
          setBalance(lamportsToSol(accountInfo.lamports));
        },
        'confirmed'
      );
    };

    fetchInitialBalance();
    subscribeToBalanceChanges();

    return () => {
      if (subscriptionId !== null) {
        connection.removeAccountChangeListener(subscriptionId);
      }
    };
  }, [publicKey, connected, connection]);

  if (!connected || !publicKey) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 shadow-sm">
      <div className="flex flex-col">
        <span className="text-xs text-gray-400">Balance</span>
        {loading ? (
          <div className="h-5 w-20 animate-pulse rounded bg-gray-700" />
        ) : (
          <span className="text-lg font-bold text-white">
            {balance !== null ? formatNumber(balance, 4) : '0'} SOL
          </span>
        )}
      </div>
    </div>
  );
}
