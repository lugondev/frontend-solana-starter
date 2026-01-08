import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { useState, useCallback } from 'react';
import { BN } from '@coral-xyz/anchor';
import {
  getStarterProgram,
  STARTER_PROGRAM_ID,
  parseProgramError,
} from '../anchor/program';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

export function useTokenOperations() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const program = wallet.publicKey
    ? getStarterProgram(connection, wallet as any)
    : null;

  const createMint = useCallback(async () => {
    if (!program || !wallet.publicKey) {
      throw new Error('Wallet not connected');
    }

    setLoading(true);
    setError(null);

    try {
      const [mintPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('mint')],
        STARTER_PROGRAM_ID
      );

      const [mintAuthorityPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('mint_authority')],
        STARTER_PROGRAM_ID
      );

      const tx = await program.methods
        .createMint()
        .accountsPartial({
          signer: wallet.publicKey,
          mint: mintPda,
          mintAuthority: mintAuthorityPda,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      setLoading(false);
      return { signature: tx, mint: mintPda };
    } catch (err: any) {
      const errorMsg = parseProgramError(err);
      setError(errorMsg);
      setLoading(false);
      throw new Error(errorMsg);
    }
  }, [program, wallet.publicKey]);

  const burnTokens = useCallback(
    async (tokenAccount: PublicKey, mint: PublicKey, amount: number) => {
      if (!program || !wallet.publicKey) {
        throw new Error('Wallet not connected');
      }

      setLoading(true);
      setError(null);

      try {
        const tx = await program.methods
          .burnTokens(new BN(amount))
          .accountsPartial({
            tokenAccount,
            mint,
            authority: wallet.publicKey,
            tokenProgram: TOKEN_PROGRAM_ID,
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

  const approveDelegate = useCallback(
    async (tokenAccount: PublicKey, delegate: PublicKey, amount: number) => {
      if (!program || !wallet.publicKey) {
        throw new Error('Wallet not connected');
      }

      setLoading(true);
      setError(null);

      try {
        const tx = await program.methods
          .approveDelegate(new BN(amount))
          .accountsPartial({
            tokenAccount,
            delegate,
            authority: wallet.publicKey,
            tokenProgram: TOKEN_PROGRAM_ID,
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

  const freezeAccount = useCallback(
    async (tokenAccount: PublicKey, mint: PublicKey) => {
      if (!program || !wallet.publicKey) {
        throw new Error('Wallet not connected');
      }

      setLoading(true);
      setError(null);

      try {
        const [freezeAuthorityPda] = PublicKey.findProgramAddressSync(
          [Buffer.from('mint_authority')],
          STARTER_PROGRAM_ID
        );

        const tx = await program.methods
          .freezeTokenAccount()
          .accountsPartial({
            tokenAccount,
            mint,
            freezeAuthority: freezeAuthorityPda,
            tokenProgram: TOKEN_PROGRAM_ID,
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

  const transferTokens = useCallback(
    async (fromAccount: PublicKey, toAccount: PublicKey, mint: PublicKey, amount: number) => {
      if (!program || !wallet.publicKey) {
        throw new Error('Wallet not connected');
      }

      setLoading(true);
      setError(null);

      try {
        const tx = await program.methods
          .transferTokens(new BN(amount))
          .accountsPartial({
            fromAccount,
            toAccount,
            mint,
            authority: wallet.publicKey,
            tokenProgram: TOKEN_PROGRAM_ID,
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

  const closeTokenAccount = useCallback(
    async (tokenAccount: PublicKey, destination: PublicKey) => {
      if (!program || !wallet.publicKey) {
        throw new Error('Wallet not connected');
      }

      setLoading(true);
      setError(null);

      try {
        const tx = await program.methods
          .closeTokenAccount()
          .accountsPartial({
            tokenAccount,
            destination,
            authority: wallet.publicKey,
            tokenProgram: TOKEN_PROGRAM_ID,
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

  return {
    program,
    loading,
    error,
    createMint,
    burnTokens,
    approveDelegate,
    freezeAccount,
    transferTokens,
    closeTokenAccount,
  };
}
