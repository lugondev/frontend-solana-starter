import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { useState, useCallback } from 'react';
import { BN } from '@coral-xyz/anchor';
import {
  getStarterProgram,
  STARTER_PROGRAM_ID,
  parseProgramError,
} from '../anchor/program';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';

export function useNFTMarketplace() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const program = wallet.publicKey
    ? getStarterProgram(connection, wallet as any)
    : null;

  const createOffer = useCallback(
    async (
      nftMint: PublicKey,
      offerAmountLamports: number,
      currencyMint: PublicKey | null,
      expiresAt: number
    ) => {
      if (!program || !wallet.publicKey) {
        throw new Error('Wallet not connected');
      }

      setLoading(true);
      setError(null);

      try {
        const [offerPda] = PublicKey.findProgramAddressSync(
          [Buffer.from('nft_offer'), nftMint.toBuffer(), wallet.publicKey.toBuffer()],
          STARTER_PROGRAM_ID
        );

        const [metadataPda] = PublicKey.findProgramAddressSync(
          [Buffer.from('nft_metadata'), nftMint.toBuffer()],
          STARTER_PROGRAM_ID
        );

        const escrowAccount = wallet.publicKey;

        const tx = await program.methods
          .createNftOffer(
            new BN(offerAmountLamports),
            currencyMint,
            new BN(expiresAt)
          )
          .accountsPartial({
            offer: offerPda,
            nftMint,
            nftMetadata: metadataPda,
            escrowAccount,
            buyer: wallet.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .rpc();

        setLoading(false);
        return { signature: tx, offer: offerPda };
      } catch (err: any) {
        const errorMsg = parseProgramError(err);
        setError(errorMsg);
        setLoading(false);
        throw new Error(errorMsg);
      }
    },
    [program, wallet.publicKey]
  );

  const acceptOffer = useCallback(
    async (nftMint: PublicKey, buyerAddress: PublicKey) => {
      if (!program || !wallet.publicKey) {
        throw new Error('Wallet not connected');
      }

      setLoading(true);
      setError(null);

      try {
        const [offerPda] = PublicKey.findProgramAddressSync(
          [Buffer.from('nft_offer'), nftMint.toBuffer(), buyerAddress.toBuffer()],
          STARTER_PROGRAM_ID
        );

        const [metadataPda] = PublicKey.findProgramAddressSync(
          [Buffer.from('nft_metadata'), nftMint.toBuffer()],
          STARTER_PROGRAM_ID
        );

        const [sellerNftAccount] = PublicKey.findProgramAddressSync(
          [wallet.publicKey.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), nftMint.toBuffer()],
          ASSOCIATED_TOKEN_PROGRAM_ID
        );

        const [buyerNftAccount] = PublicKey.findProgramAddressSync(
          [buyerAddress.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), nftMint.toBuffer()],
          ASSOCIATED_TOKEN_PROGRAM_ID
        );

        const escrowAccount = wallet.publicKey;

        const tx = await program.methods
          .acceptNftOffer()
          .accountsPartial({
            offer: offerPda,
            nftMetadata: metadataPda,
            nftMint,
            sellerNftAccount,
            buyerNftAccount,
            escrowAccount,
            owner: wallet.publicKey,
            buyer: buyerAddress,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
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

  const listNFT = useCallback(
    async (
      nftMint: PublicKey,
      nftTokenAccount: PublicKey,
      priceLamports: number,
      currencyMint: PublicKey | null,
      expiresAt: number | null
    ) => {
      if (!program || !wallet.publicKey) {
        throw new Error('Wallet not connected');
      }

      setLoading(true);
      setError(null);

      try {
        const [listingPda] = PublicKey.findProgramAddressSync(
          [Buffer.from('nft_listing'), nftMint.toBuffer()],
          STARTER_PROGRAM_ID
        );

        const [metadataPda] = PublicKey.findProgramAddressSync(
          [Buffer.from('nft_metadata'), nftMint.toBuffer()],
          STARTER_PROGRAM_ID
        );

        const tx = await program.methods
          .listNft(
            new BN(priceLamports),
            currencyMint,
            expiresAt !== null ? new BN(expiresAt) : null
          )
          .accountsPartial({
            listing: listingPda,
            nftMetadata: metadataPda,
            nftMint,
            nftTokenAccount,
            seller: wallet.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .rpc();

        setLoading(false);
        return { signature: tx, listing: listingPda };
      } catch (err: any) {
        const errorMsg = parseProgramError(err);
        setError(errorMsg);
        setLoading(false);
        throw new Error(errorMsg);
      }
    },
    [program, wallet.publicKey]
  );

  const buyNFT = useCallback(
    async (nftMint: PublicKey, sellerAddress: PublicKey) => {
      if (!program || !wallet.publicKey) {
        throw new Error('Wallet not connected');
      }

      setLoading(true);
      setError(null);

      try {
        const [listingPda] = PublicKey.findProgramAddressSync(
          [Buffer.from('nft_listing'), nftMint.toBuffer()],
          STARTER_PROGRAM_ID
        );

        const [metadataPda] = PublicKey.findProgramAddressSync(
          [Buffer.from('nft_metadata'), nftMint.toBuffer()],
          STARTER_PROGRAM_ID
        );

        const [sellerNftAccount] = PublicKey.findProgramAddressSync(
          [sellerAddress.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), nftMint.toBuffer()],
          ASSOCIATED_TOKEN_PROGRAM_ID
        );

        const [buyerNftAccount] = PublicKey.findProgramAddressSync(
          [wallet.publicKey.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), nftMint.toBuffer()],
          ASSOCIATED_TOKEN_PROGRAM_ID
        );

        const tx = await program.methods
          .buyNft()
          .accountsPartial({
            listing: listingPda,
            nftMetadata: metadataPda,
            nftMint,
            sellerNftAccount,
            buyerNftAccount,
            buyer: wallet.publicKey,
            seller: sellerAddress,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
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

  const cancelListing = useCallback(
    async (nftMint: PublicKey) => {
      if (!program || !wallet.publicKey) {
        throw new Error('Wallet not connected');
      }

      setLoading(true);
      setError(null);

      try {
        const [listingPda] = PublicKey.findProgramAddressSync(
          [Buffer.from('nft_listing'), nftMint.toBuffer()],
          STARTER_PROGRAM_ID
        );

        const tx = await program.methods
          .cancelNftListing()
          .accountsPartial({
            listing: listingPda,
            nftMint,
            seller: wallet.publicKey,
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
    createOffer,
    acceptOffer,
    listNFT,
    buyNFT,
    cancelListing,
  };
}
