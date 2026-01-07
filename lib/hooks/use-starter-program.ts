import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { useState, useCallback } from 'react';
import { BN } from '@coral-xyz/anchor';
import {
  getStarterProgram,
  PDAHelper,
  STARTER_PROGRAM_ID,
  COUNTER_PROGRAM_ID,
  parseProgramError,
} from '../anchor/program';

export function useStarterProgram() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const program = wallet.publicKey
    ? getStarterProgram(connection, wallet as any)
    : null;

  const createUserAccount = useCallback(async () => {
    if (!program || !wallet.publicKey) {
      throw new Error('Wallet not connected');
    }

    setLoading(true);
    setError(null);

    try {
      const [userPda] = await PDAHelper.getUserPDA(
        wallet.publicKey,
        STARTER_PROGRAM_ID
      );

      const tx = await program.methods
        .createUserAccount()
        .accountsPartial({
          authority: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      setLoading(false);
      return { signature: tx, userPda };
    } catch (err: any) {
      const errorMsg = parseProgramError(err);
      setError(errorMsg);
      setLoading(false);
      throw new Error(errorMsg);
    }
  }, [program, wallet.publicKey, connection]);

  const updateUserAccount = useCallback(
    async (points: number) => {
      if (!program || !wallet.publicKey) {
        throw new Error('Wallet not connected');
      }

      setLoading(true);
      setError(null);

      try {
        const tx = await program.methods
          .updateUserAccount(new BN(points))
          .accountsPartial({
            authority: wallet.publicKey,
          })
          .rpc();

        setLoading(false);
        return tx;
      } catch (err: any) {
        const errorMsg = parseProgramError(err);
        setError(errorMsg);
        setLoading(false);
        throw new Error(errorMsg);
      }
    },
    [program, wallet.publicKey, connection]
  );

  const closeUserAccount = useCallback(async () => {
    if (!program || !wallet.publicKey) {
      throw new Error('Wallet not connected');
    }

    setLoading(true);
    setError(null);

    try {
      const tx = await program.methods
        .closeUserAccount()
        .accountsPartial({
          authority: wallet.publicKey,
        })
        .rpc();

      setLoading(false);
      return tx;
    } catch (err: any) {
      const errorMsg = parseProgramError(err);
      setError(errorMsg);
      setLoading(false);
      throw new Error(errorMsg);
    }
  }, [program, wallet.publicKey, connection]);

  const incrementCounter = useCallback(async () => {
    if (!program || !wallet.publicKey) {
      throw new Error('Wallet not connected');
    }

    setLoading(true);
    setError(null);

    try {
      const tx = await program.methods
        .incrementCounter()
        .accountsPartial({
          authority: wallet.publicKey,
        })
        .rpc();

      setLoading(false);
      return tx;
    } catch (err: any) {
      const errorMsg = parseProgramError(err);
      setError(errorMsg);
      setLoading(false);
      throw new Error(errorMsg);
    }
  }, [program, wallet.publicKey, connection]);

  const addToCounter = useCallback(
    async (value: number) => {
      if (!program || !wallet.publicKey) {
        throw new Error('Wallet not connected');
      }

      setLoading(true);
      setError(null);

      try {
        const tx = await program.methods
          .addToCounter(new BN(value))
          .accountsPartial({
            authority: wallet.publicKey,
          })
          .rpc();

        setLoading(false);
        return tx;
      } catch (err: any) {
        const errorMsg = parseProgramError(err);
        setError(errorMsg);
        setLoading(false);
        throw new Error(errorMsg);
      }
    },
    [program, wallet.publicKey, connection]
  );

  return {
    program,
    loading,
    error,
    createUserAccount,
    updateUserAccount,
    closeUserAccount,
    incrementCounter,
    addToCounter,
  };
}
