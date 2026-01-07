import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { useState, useCallback } from 'react';
import { BN } from '@coral-xyz/anchor';
import useSWR from 'swr';
import {
  getCounterProgram,
  PDAHelper,
  COUNTER_PROGRAM_ID,
  parseProgramError,
} from '../anchor/program';

export function useCounterProgram() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const program = wallet.publicKey
    ? getCounterProgram(connection, wallet as any)
    : null;

  const { data: counterData, mutate: refetchCounter } = useSWR(
    wallet.publicKey ? ['counter', wallet.publicKey.toBase58()] : null,
    async () => {
      if (!program || !wallet.publicKey) return null;
      
      const [counterPda] = await PDAHelper.getCounterPDA(
        wallet.publicKey,
        COUNTER_PROGRAM_ID
      );

      try {
        const account = await program.account.counter.fetch(counterPda);
        return {
          pda: counterPda,
          count: account.count.toNumber(),
          authority: account.authority,
        };
      } catch (err) {
        return null;
      }
    },
    { refreshInterval: 5000 }
  );

  const initialize = useCallback(async () => {
    if (!program || !wallet.publicKey) {
      throw new Error('Wallet not connected');
    }

    setLoading(true);
    setError(null);

    try {
      const [counterPda] = await PDAHelper.getCounterPDA(
        wallet.publicKey,
        COUNTER_PROGRAM_ID
      );

      const tx = await program.methods
        .initialize()
        .accountsPartial({
          authority: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      await refetchCounter();
      setLoading(false);
      return { signature: tx, pda: counterPda };
    } catch (err: any) {
      const errorMsg = parseProgramError(err);
      setError(errorMsg);
      setLoading(false);
      throw new Error(errorMsg);
    }
  }, [program, wallet.publicKey, refetchCounter]);

  const increment = useCallback(async () => {
    if (!program || !wallet.publicKey) {
      throw new Error('Wallet not connected');
    }

    setLoading(true);
    setError(null);

    try {
      const [counterPda] = await PDAHelper.getCounterPDA(
        wallet.publicKey,
        COUNTER_PROGRAM_ID
      );

      const tx = await program.methods
        .increment()
        .accountsPartial({})
        .rpc();

      await refetchCounter();
      setLoading(false);
      return tx;
    } catch (err: any) {
      const errorMsg = parseProgramError(err);
      setError(errorMsg);
      setLoading(false);
      throw new Error(errorMsg);
    }
  }, [program, wallet.publicKey, refetchCounter]);

  const decrement = useCallback(async () => {
    if (!program || !wallet.publicKey) {
      throw new Error('Wallet not connected');
    }

    setLoading(true);
    setError(null);

    try {
      const [counterPda] = await PDAHelper.getCounterPDA(
        wallet.publicKey,
        COUNTER_PROGRAM_ID
      );

      const tx = await program.methods
        .decrement()
        .accountsPartial({})
        .rpc();

      await refetchCounter();
      setLoading(false);
      return tx;
    } catch (err: any) {
      const errorMsg = parseProgramError(err);
      setError(errorMsg);
      setLoading(false);
      throw new Error(errorMsg);
    }
  }, [program, wallet.publicKey, refetchCounter]);

  const add = useCallback(
    async (value: number) => {
      if (!program || !wallet.publicKey) {
        throw new Error('Wallet not connected');
      }

      setLoading(true);
      setError(null);

      try {
        const [counterPda] = await PDAHelper.getCounterPDA(
          wallet.publicKey,
          COUNTER_PROGRAM_ID
        );

        const tx = await program.methods
          .add(new BN(value))
          .accountsPartial({})
          .rpc();

        await refetchCounter();
        setLoading(false);
        return tx;
      } catch (err: any) {
        const errorMsg = parseProgramError(err);
        setError(errorMsg);
        setLoading(false);
        throw new Error(errorMsg);
      }
    },
    [program, wallet.publicKey, refetchCounter]
  );

  const reset = useCallback(async () => {
    if (!program || !wallet.publicKey) {
      throw new Error('Wallet not connected');
    }

    setLoading(true);
    setError(null);

    try {
      const [counterPda] = await PDAHelper.getCounterPDA(
        wallet.publicKey,
        COUNTER_PROGRAM_ID
      );

      const tx = await program.methods
        .reset()
        .accountsPartial({
          authority: wallet.publicKey,
        })
        .rpc();

      await refetchCounter();
      setLoading(false);
      return tx;
    } catch (err: any) {
      const errorMsg = parseProgramError(err);
      setError(errorMsg);
      setLoading(false);
      throw new Error(errorMsg);
    }
  }, [program, wallet.publicKey, refetchCounter]);

  const incrementWithPayment = useCallback(
    async (payment: number, feeCollector: PublicKey) => {
      if (!program || !wallet.publicKey) {
        throw new Error('Wallet not connected');
      }

      setLoading(true);
      setError(null);

      try {
        const [counterPda] = await PDAHelper.getCounterPDA(
          wallet.publicKey,
          COUNTER_PROGRAM_ID
        );

        const tx = await program.methods
          .incrementWithPayment(new BN(payment))
          .accountsPartial({
            payer: wallet.publicKey,
            feeCollector: feeCollector,
            systemProgram: SystemProgram.programId,
          })
          .rpc();

        await refetchCounter();
        setLoading(false);
        return tx;
      } catch (err: any) {
        const errorMsg = parseProgramError(err);
        setError(errorMsg);
        setLoading(false);
        throw new Error(errorMsg);
      }
    },
    [program, wallet.publicKey, refetchCounter]
  );

  return {
    program,
    loading,
    error,
    counter: counterData,
    initialize,
    increment,
    decrement,
    add,
    reset,
    incrementWithPayment,
    refetch: refetchCounter,
  };
}
