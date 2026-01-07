import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
  Transaction,
  SystemProgram,
  PublicKey,
  TransactionSignature,
} from '@solana/web3.js';
import { useState, useCallback } from 'react';
import { solToLamports } from '@/lib/utils/format';

interface SendTransactionOptions {
  onSuccess?: (signature: string) => void;
  onError?: (error: Error) => void;
}

export function useSendTransaction(options: SendTransactionOptions = {}) {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const send = useCallback(
    async (toAddress: string, amount: number): Promise<string | null> => {
      if (!publicKey) {
        const err = new Error('Wallet not connected');
        setError(err);
        options.onError?.(err);
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        const toPubkey = new PublicKey(toAddress);
        const lamports = solToLamports(amount);

        const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey,
            lamports,
          })
        );

        const signature = await sendTransaction(transaction, connection);

        await connection.confirmTransaction(signature, 'confirmed');

        options.onSuccess?.(signature);
        return signature;
      } catch (err) {
        const error = err as Error;
        setError(error);
        options.onError?.(error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [publicKey, sendTransaction, connection, options]
  );

  return {
    send,
    loading,
    error,
  };
}
