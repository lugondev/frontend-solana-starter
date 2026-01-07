import { Program, AnchorProvider, Idl } from '@coral-xyz/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
import { AnchorWallet } from '@solana/wallet-adapter-react';

import { StarterProgram } from './types/starter_program';
import { CounterProgram } from './types/counter_program';
import StarterProgramIDL from './idl/starter_program.json';
import CounterProgramIDL from './idl/counter_program.json';

// Program IDs from Anchor.toml
export const STARTER_PROGRAM_ID = new PublicKey(
  'gARh1g6reuvsAHB7DXqiuYzzyiJeoiJmtmCpV8Y5uWC'
);
export const COUNTER_PROGRAM_ID = new PublicKey(
  'CounzVsCGF4VzNkAwePKC9mXr6YWiFYF4kLW6YdV8Cc'
);

/**
 * Create Anchor provider from connection and wallet
 */
export function createProvider(
  connection: Connection,
  wallet: AnchorWallet
): AnchorProvider {
  return new AnchorProvider(connection, wallet, {
    commitment: 'confirmed',
    preflightCommitment: 'confirmed',
  });
}

/**
 * Get StarterProgram instance
 */
export function getStarterProgram(
  connection: Connection,
  wallet: AnchorWallet
): Program<StarterProgram> {
  const provider = createProvider(connection, wallet);
  return new Program(
    StarterProgramIDL as Idl,
    provider
  ) as unknown as Program<StarterProgram>;
}

/**
 * Get CounterProgram instance
 */
export function getCounterProgram(
  connection: Connection,
  wallet: AnchorWallet
): Program<CounterProgram> {
  const provider = createProvider(connection, wallet);
  return new Program(
    CounterProgramIDL as Idl,
    provider
  ) as unknown as Program<CounterProgram>;
}

/**
 * PDA Seeds Constants (from Rust constants.rs)
 */
export const SEED_CONFIG = Buffer.from('config');
export const SEED_USER = Buffer.from('user');
export const SEED_TOKEN_VAULT = Buffer.from('token_vault');
export const SEED_PDA_AUTHORITY = Buffer.from('pda_authority');
export const SEED_COUNTER = Buffer.from('counter');

/**
 * Helper to derive PDA addresses
 */
export class PDAHelper {
  /**
   * Get program config PDA
   */
  static async getConfigPDA(programId: PublicKey): Promise<[PublicKey, number]> {
    return PublicKey.findProgramAddressSync([SEED_CONFIG], programId);
  }

  /**
   * Get user account PDA
   */
  static async getUserPDA(
    authority: PublicKey,
    programId: PublicKey
  ): Promise<[PublicKey, number]> {
    return PublicKey.findProgramAddressSync(
      [SEED_USER, authority.toBuffer()],
      programId
    );
  }

  /**
   * Get token vault PDA
   */
  static async getTokenVaultPDA(programId: PublicKey): Promise<[PublicKey, number]> {
    return PublicKey.findProgramAddressSync([SEED_TOKEN_VAULT], programId);
  }

  /**
   * Get PDA authority PDA
   */
  static async getPDAAuthorityPDA(programId: PublicKey): Promise<[PublicKey, number]> {
    return PublicKey.findProgramAddressSync([SEED_PDA_AUTHORITY], programId);
  }

  /**
   * Get counter PDA
   */
  static async getCounterPDA(
    authority: PublicKey,
    programId: PublicKey
  ): Promise<[PublicKey, number]> {
    return PublicKey.findProgramAddressSync(
      [SEED_COUNTER, authority.toBuffer()],
      programId
    );
  }
}

/**
 * Error codes for user-friendly messages
 */
export const ERROR_MESSAGES: Record<number, string> = {
  6000: 'Unauthorized access',
  6001: 'Invalid amount',
  6002: 'Program is paused',
  6003: 'Invalid fee collector',
  6004: 'Invalid fee percentage',
  6005: 'Arithmetic overflow',
  6006: 'Invalid admin',
  6007: 'Invalid authority',
  6008: 'Counter overflow',
  6009: 'Counter underflow',
};

/**
 * Parse program error to user-friendly message
 */
export function parseProgramError(error: any): string {
  if (error?.code) {
    return ERROR_MESSAGES[error.code] || `Program error: ${error.code}`;
  }
  if (error?.message) {
    return error.message;
  }
  return 'Unknown error occurred';
}
