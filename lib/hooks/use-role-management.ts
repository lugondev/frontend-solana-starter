import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { useState, useCallback } from 'react';
import {
  getStarterProgram,
  STARTER_PROGRAM_ID,
  parseProgramError,
} from '../anchor/program';

export enum RoleType {
  Admin = 'admin',
  Moderator = 'moderator',
  User = 'user',
}

export function useRoleManagement() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const program = wallet.publicKey
    ? getStarterProgram(connection, wallet as any)
    : null;

  const assignRole = useCallback(
    async (targetAuthority: PublicKey, roleType: RoleType) => {
      if (!program || !wallet.publicKey) {
        throw new Error('Wallet not connected');
      }

      setLoading(true);
      setError(null);

      try {
        const [rolePda] = PublicKey.findProgramAddressSync(
          [Buffer.from('role'), targetAuthority.toBuffer()],
          STARTER_PROGRAM_ID
        );

        const [configPda] = PublicKey.findProgramAddressSync(
          [Buffer.from('program_config')],
          STARTER_PROGRAM_ID
        );

        const roleTypeAnchor = { [roleType]: {} };

        const tx = await program.methods
          .assignRole(roleTypeAnchor)
          .accountsPartial({
            role: rolePda,
            programConfig: configPda,
            admin: wallet.publicKey,
            targetAuthority,
            systemProgram: SystemProgram.programId,
          })
          .rpc();

        setLoading(false);
        return { signature: tx, role: rolePda };
      } catch (err: any) {
        const errorMsg = parseProgramError(err);
        setError(errorMsg);
        setLoading(false);
        throw new Error(errorMsg);
      }
    },
    [program, wallet.publicKey]
  );

  const checkPermission = useCallback(
    async (requiredPermission: number): Promise<boolean> => {
      if (!program || !wallet.publicKey) {
        throw new Error('Wallet not connected');
      }

      setLoading(true);
      setError(null);

      try {
        const [rolePda] = PublicKey.findProgramAddressSync(
          [Buffer.from('role'), wallet.publicKey.toBuffer()],
          STARTER_PROGRAM_ID
        );

        const hasPermission = await program.methods
          .checkPermission(requiredPermission)
          .accountsPartial({
            role: rolePda,
            authority: wallet.publicKey,
          })
          .view();

        setLoading(false);
        return hasPermission;
      } catch (err: any) {
        const errorMsg = parseProgramError(err);
        setError(errorMsg);
        setLoading(false);
        return false;
      }
    },
    [program, wallet.publicKey]
  );

  const getRoleInfo = useCallback(
    async (authority: PublicKey) => {
      if (!program) return null;

      try {
        const [rolePda] = PublicKey.findProgramAddressSync(
          [Buffer.from('role'), authority.toBuffer()],
          STARTER_PROGRAM_ID
        );

        const roleAccount = await program.account.role.fetch(rolePda);
        return {
          address: rolePda,
          authority: roleAccount.authority,
          roleType: roleAccount.roleType,
          permissions: roleAccount.permissions,
          assignedAt: roleAccount.assignedAt.toNumber(),
        };
      } catch (err) {
        console.error('Error fetching role:', err);
        return null;
      }
    },
    [program]
  );

  return {
    program,
    loading,
    error,
    assignRole,
    checkPermission,
    getRoleInfo,
  };
}
