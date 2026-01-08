import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { useState, useCallback } from 'react';
import { BN } from '@coral-xyz/anchor';
import {
  getStarterProgram,
  STARTER_PROGRAM_ID,
  parseProgramError,
} from '../anchor/program';

const BPF_LOADER_UPGRADEABLE_PROGRAM_ID = new PublicKey(
  'BPFLoaderUpgradeab1e11111111111111111111111'
);

export function useGovernance() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const program = wallet.publicKey
    ? getStarterProgram(connection, wallet as any)
    : null;

  const initializeUpgradeAuthority = useCallback(
    async (
      votingThreshold: number,
      votingPeriodSeconds: number,
      executionDelaySeconds: number
    ) => {
      if (!program || !wallet.publicKey) {
        throw new Error('Wallet not connected');
      }

      setLoading(true);
      setError(null);

      try {
        const [upgradeAuthorityPda] = PublicKey.findProgramAddressSync(
          [Buffer.from('upgrade_authority')],
          STARTER_PROGRAM_ID
        );

        const tx = await program.methods
          .initializeUpgradeAuthority(
            votingThreshold,
            new BN(votingPeriodSeconds),
            new BN(executionDelaySeconds)
          )
          .accountsPartial({
            upgradeAuthority: upgradeAuthorityPda,
            admin: wallet.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .rpc();

        setLoading(false);
        return { signature: tx, upgradeAuthority: upgradeAuthorityPda };
      } catch (err: any) {
        const errorMsg = parseProgramError(err);
        setError(errorMsg);
        setLoading(false);
        throw new Error(errorMsg);
      }
    },
    [program, wallet.publicKey]
  );

  const createUpgradeProposal = useCallback(
    async (
      proposalId: number,
      description: string,
      newProgramData: PublicKey
    ) => {
      if (!program || !wallet.publicKey) {
        throw new Error('Wallet not connected');
      }

      setLoading(true);
      setError(null);

      try {
        const [upgradeAuthorityPda] = PublicKey.findProgramAddressSync(
          [Buffer.from('upgrade_authority')],
          STARTER_PROGRAM_ID
        );

        const [proposalPda] = PublicKey.findProgramAddressSync(
          [
            Buffer.from('upgrade_proposal'),
            new BN(proposalId).toArrayLike(Buffer, 'le', 8),
          ],
          STARTER_PROGRAM_ID
        );

        const tx = await program.methods
          .createUpgradeProposal(new BN(proposalId), description)
          .accountsPartial({
            upgradeAuthority: upgradeAuthorityPda,
            proposal: proposalPda,
            proposer: wallet.publicKey,
            newProgramData,
            systemProgram: SystemProgram.programId,
          })
          .rpc();

        setLoading(false);
        return { signature: tx, proposal: proposalPda };
      } catch (err: any) {
        const errorMsg = parseProgramError(err);
        setError(errorMsg);
        setLoading(false);
        throw new Error(errorMsg);
      }
    },
    [program, wallet.publicKey]
  );

  const castVote = useCallback(
    async (proposalId: number, inFavor: boolean, votingPower: number) => {
      if (!program || !wallet.publicKey) {
        throw new Error('Wallet not connected');
      }

      setLoading(true);
      setError(null);

      try {
        const [upgradeAuthorityPda] = PublicKey.findProgramAddressSync(
          [Buffer.from('upgrade_authority')],
          STARTER_PROGRAM_ID
        );

        const [proposalPda] = PublicKey.findProgramAddressSync(
          [
            Buffer.from('upgrade_proposal'),
            new BN(proposalId).toArrayLike(Buffer, 'le', 8),
          ],
          STARTER_PROGRAM_ID
        );

        const [votePda] = PublicKey.findProgramAddressSync(
          [
            Buffer.from('vote'),
            new BN(proposalId).toArrayLike(Buffer, 'le', 8),
            wallet.publicKey.toBuffer(),
          ],
          STARTER_PROGRAM_ID
        );

        const tx = await program.methods
          .castVote(new BN(proposalId), inFavor, new BN(votingPower))
          .accountsPartial({
            upgradeAuthority: upgradeAuthorityPda,
            proposal: proposalPda,
            vote: votePda,
            voter: wallet.publicKey,
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

  const executeProposal = useCallback(
    async (
      proposalId: number,
      oldVersion: string,
      newVersion: string,
      programData: PublicKey,
      newProgramData: PublicKey,
      proposalCount: number
    ) => {
      if (!program || !wallet.publicKey) {
        throw new Error('Wallet not connected');
      }

      setLoading(true);
      setError(null);

      try {
        const [upgradeAuthorityPda] = PublicKey.findProgramAddressSync(
          [Buffer.from('upgrade_authority')],
          STARTER_PROGRAM_ID
        );

        const [proposalPda] = PublicKey.findProgramAddressSync(
          [
            Buffer.from('upgrade_proposal'),
            new BN(proposalId).toArrayLike(Buffer, 'le', 8),
          ],
          STARTER_PROGRAM_ID
        );

        const [programVersionPda] = PublicKey.findProgramAddressSync(
          [
            Buffer.from('program_version'),
            new BN(proposalCount).toArrayLike(Buffer, 'le', 8),
          ],
          STARTER_PROGRAM_ID
        );

        const tx = await program.methods
          .executeProposal(new BN(proposalId), oldVersion, newVersion)
          .accountsPartial({
            upgradeAuthority: upgradeAuthorityPda,
            proposal: proposalPda,
            programVersion: programVersionPda,
            executor: wallet.publicKey,
            programData,
            newProgramData,
            bpfLoaderUpgradeableProgram: BPF_LOADER_UPGRADEABLE_PROGRAM_ID,
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

  const cancelProposal = useCallback(
    async (proposalId: number) => {
      if (!program || !wallet.publicKey) {
        throw new Error('Wallet not connected');
      }

      setLoading(true);
      setError(null);

      try {
        const [upgradeAuthorityPda] = PublicKey.findProgramAddressSync(
          [Buffer.from('upgrade_authority')],
          STARTER_PROGRAM_ID
        );

        const [proposalPda] = PublicKey.findProgramAddressSync(
          [
            Buffer.from('upgrade_proposal'),
            new BN(proposalId).toArrayLike(Buffer, 'le', 8),
          ],
          STARTER_PROGRAM_ID
        );

        const tx = await program.methods
          .cancelProposal(new BN(proposalId))
          .accountsPartial({
            upgradeAuthority: upgradeAuthorityPda,
            proposal: proposalPda,
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
    [program, wallet.publicKey]
  );

  const acceptUpgradeAuthority = useCallback(async () => {
    if (!program || !wallet.publicKey) {
      throw new Error('Wallet not connected');
    }

    setLoading(true);
    setError(null);

    try {
      const [upgradeAuthorityPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('upgrade_authority')],
        STARTER_PROGRAM_ID
      );

      const tx = await program.methods
        .acceptUpgradeAuthority()
        .accountsPartial({
          upgradeAuthority: upgradeAuthorityPda,
          newAuthority: wallet.publicKey,
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
  }, [program, wallet.publicKey]);

  return {
    program,
    loading,
    error,
    initializeUpgradeAuthority,
    createUpgradeProposal,
    castVote,
    executeProposal,
    cancelProposal,
    acceptUpgradeAuthority,
  };
}
