import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram, Keypair, SYSVAR_RENT_PUBKEY } from '@solana/web3.js';
import { useState, useCallback } from 'react';
import { BN } from '@coral-xyz/anchor';
import {
  getStarterProgram,
  STARTER_PROGRAM_ID,
  parseProgramError,
} from '../anchor/program';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';

interface Creator {
  address: PublicKey;
  share: number;
  verified: boolean;
}

export function useNFTCollection() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const program = wallet.publicKey
    ? getStarterProgram(connection, wallet as any)
    : null;

  const createCollection = useCallback(
    async (
      collectionMint: PublicKey,
      name: string,
      symbol: string,
      uri: string,
      sellerFeeBasisPoints: number,
      totalSupply: number,
      isMutable: boolean
    ) => {
      if (!program || !wallet.publicKey) {
        throw new Error('Wallet not connected');
      }

      setLoading(true);
      setError(null);

      try {
        const [collectionPda] = PublicKey.findProgramAddressSync(
          [Buffer.from('nft_collection'), collectionMint.toBuffer()],
          STARTER_PROGRAM_ID
        );

        const tx = await program.methods
          .createCollection(
            name,
            symbol,
            uri,
            sellerFeeBasisPoints,
            new BN(totalSupply),
            isMutable
          )
          .accountsPartial({
            collection: collectionPda,
            collectionMint,
            authority: wallet.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .rpc();

        setLoading(false);
        return { signature: tx, collection: collectionPda };
      } catch (err: any) {
        const errorMsg = parseProgramError(err);
        setError(errorMsg);
        setLoading(false);
        throw new Error(errorMsg);
      }
    },
    [program, wallet.publicKey]
  );

  const mintNFT = useCallback(
    async (
      collectionMint: PublicKey,
      recipient: PublicKey,
      name: string,
      uri: string,
      creators: Creator[]
    ) => {
      if (!program || !wallet.publicKey) {
        throw new Error('Wallet not connected');
      }

      setLoading(true);
      setError(null);

      try {
        const nftMintKeypair = Keypair.generate();
        const nftMint = nftMintKeypair.publicKey;

        const [collectionPda] = PublicKey.findProgramAddressSync(
          [Buffer.from('nft_collection'), collectionMint.toBuffer()],
          STARTER_PROGRAM_ID
        );

        const [metadataPda] = PublicKey.findProgramAddressSync(
          [Buffer.from('nft_metadata'), nftMint.toBuffer()],
          STARTER_PROGRAM_ID
        );

        const [recipientTokenAccount] = PublicKey.findProgramAddressSync(
          [recipient.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), nftMint.toBuffer()],
          ASSOCIATED_TOKEN_PROGRAM_ID
        );

        const formattedCreators = creators.map((creator) => ({
          address: creator.address,
          share: creator.share,
          verified: creator.verified,
        }));

        const tx = await program.methods
          .mintNft(name, uri, formattedCreators)
          .accountsPartial({
            collection: collectionPda,
            nftMetadata: metadataPda,
            nftMint,
            recipientTokenAccount,
            recipient,
            authority: wallet.publicKey,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
            rent: SYSVAR_RENT_PUBKEY,
          })
          .signers([nftMintKeypair])
          .rpc();

        setLoading(false);
        return { signature: tx, nftMint, metadata: metadataPda };
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
    createCollection,
    mintNFT,
  };
}
