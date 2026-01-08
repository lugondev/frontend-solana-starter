import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { useState, useCallback } from 'react';
import { BN } from '@coral-xyz/anchor';
import {
  getStarterProgram,
  STARTER_PROGRAM_ID,
  parseProgramError,
} from '../anchor/program';

export function useTreasury() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const program = wallet.publicKey
    ? getStarterProgram(connection, wallet as any)
    : null;

  const depositToTreasury = useCallback(
    async (amountLamports: number) => {
      if (!program || !wallet.publicKey) {
        throw new Error('Wallet not connected');
      }

      setLoading(true);
      setError(null);

      try {
        const [treasuryPda] = PublicKey.findProgramAddressSync(
          [Buffer.from('treasury')],
          STARTER_PROGRAM_ID
        );

        const tx = await program.methods
          .depositToTreasury(new BN(amountLamports))
          .accountsPartial({
            treasury: treasuryPda,
            depositor: wallet.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .rpc();

        setLoading(false);
        return { signature: tx, treasury: treasuryPda };
      } catch (err: any) {
        const errorMsg = parseProgramError(err);
        setError(errorMsg);
        setLoading(false);
        throw new Error(errorMsg);
      }
    },
    [program, wallet.publicKey]
  );

  const emergencyWithdraw = useCallback(
    async (destinationAddress: PublicKey) => {
      if (!program || !wallet.publicKey) {
        throw new Error('Wallet not connected');
      }

      setLoading(true);
      setError(null);

      try {
        const [treasuryPda] = PublicKey.findProgramAddressSync(
          [Buffer.from('treasury')],
          STARTER_PROGRAM_ID
        );

        const [configPda] = PublicKey.findProgramAddressSync(
          [Buffer.from('program_config')],
          STARTER_PROGRAM_ID
        );

        const tx = await program.methods
          .emergencyWithdraw()
          .accountsPartial({
            treasury: treasuryPda,
            programConfig: configPda,
            authority: wallet.publicKey,
            destination: destinationAddress,
            systemProgram: SystemProgram.programId,
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
    [program, wallet.publicKey]
  );

  const getTreasuryInfo = useCallback(async () => {
    if (!program) return null;

    try {
      const [treasuryPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('treasury')],
        STARTER_PROGRAM_ID
      );

      const balance = await connection.getBalance(treasuryPda);
      return {
        address: treasuryPda,
        balance,
      };
    } catch (err) {
      console.error('Error fetching treasury:', err);
      return null;
    }
  }, [program, connection]);

  return {
    program,
    loading,
    error,
    depositToTreasury,
    emergencyWithdraw,
    getTreasuryInfo,
  };
}
