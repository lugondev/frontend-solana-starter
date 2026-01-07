import { useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import useSWR from 'swr';

interface UseTransactionHistoryOptions {
  limit?: number;
  refreshInterval?: number;
}

export function useTransactionHistory(
  address?: string | PublicKey | null,
  options: UseTransactionHistoryOptions = {}
) {
  const { connection } = useConnection();
  const {
    limit = 10,
    refreshInterval = 60000,
  } = options;

  const publicKey = address
    ? typeof address === 'string'
      ? new PublicKey(address)
      : address
    : null;

  const { data, error, isLoading, mutate } = useSWR(
    publicKey ? ['transactions', publicKey.toString(), limit] : null,
    async () => {
      if (!publicKey) return null;
      const signatures = await connection.getSignaturesForAddress(publicKey, {
        limit,
      });
      return signatures;
    },
    {
      refreshInterval,
      dedupingInterval: 30000,
    }
  );

  return {
    transactions: data || [],
    error,
    isLoading,
    refetch: mutate,
  };
}
