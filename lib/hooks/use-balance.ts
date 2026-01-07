import { useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import useSWR from 'swr';
import { lamportsToSol } from '@/lib/utils/format';

interface UseBalanceOptions {
  refreshInterval?: number;
  revalidateOnFocus?: boolean;
}

export function useBalance(
  address?: string | PublicKey | null,
  options: UseBalanceOptions = {}
) {
  const { connection } = useConnection();
  const {
    refreshInterval = 30000,
    revalidateOnFocus = true,
  } = options;

  const publicKey = address
    ? typeof address === 'string'
      ? new PublicKey(address)
      : address
    : null;

  const { data, error, isLoading, mutate } = useSWR(
    publicKey ? ['balance', publicKey.toString()] : null,
    async () => {
      if (!publicKey) return null;
      const lamports = await connection.getBalance(publicKey);
      return {
        lamports,
        sol: lamportsToSol(lamports),
      };
    },
    {
      refreshInterval,
      revalidateOnFocus,
      dedupingInterval: 10000,
    }
  );

  return {
    balance: data,
    error,
    isLoading,
    refetch: mutate,
  };
}
