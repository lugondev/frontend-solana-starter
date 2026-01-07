import { useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, AccountInfo, ParsedAccountData } from '@solana/web3.js';
import useSWR from 'swr';

interface UseAccountOptions {
  refreshInterval?: number;
  revalidateOnFocus?: boolean;
}

export function useAccount(
  address?: string | PublicKey | null,
  options: UseAccountOptions = {}
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
    publicKey ? ['account', publicKey.toString()] : null,
    async () => {
      if (!publicKey) return null;
      const accountInfo = await connection.getAccountInfo(publicKey);
      return accountInfo;
    },
    {
      refreshInterval,
      revalidateOnFocus,
      dedupingInterval: 10000,
    }
  );

  return {
    account: data,
    error,
    isLoading,
    refetch: mutate,
  };
}
