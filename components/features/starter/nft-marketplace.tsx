'use client';

import { useNFTMarketplace } from '@/lib/hooks/use-nft-marketplace';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWallet } from '@solana/wallet-adapter-react';
import { useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

export function NFTMarketplace() {
  const { publicKey } = useWallet();
  const {
    loading,
    error,
    createOffer,
    acceptOffer,
    listNFT,
    buyNFT,
    cancelListing,
  } = useNFTMarketplace();

  const [nftMintAddress, setNftMintAddress] = useState('');
  const [offerAmount, setOfferAmount] = useState(1);
  const [buyerAddress, setBuyerAddress] = useState('');
  const [sellerAddress, setSellerAddress] = useState('');
  const [nftTokenAccount, setNftTokenAccount] = useState('');
  const [listPrice, setListPrice] = useState(1);
  const [expiresInDays, setExpiresInDays] = useState(7);

  if (!publicKey) {
    return (
      <Card title="NFT Marketplace">
        <p className="text-gray-600">Connect your wallet to trade NFTs</p>
      </Card>
    );
  }

  return (
    <Card title="NFT Marketplace">
      <div className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">NFT Marketplace Features</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• List NFTs for direct sale</li>
            <li>• Buy listed NFTs instantly</li>
            <li>• Create offers for NFTs</li>
            <li>• Accept offers as seller</li>
            <li>• Cancel listings</li>
            <li>• Escrow-based secure trading</li>
          </ul>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">List NFT for Sale</h3>
          <input
            type="text"
            placeholder="NFT Mint Address"
            value={nftMintAddress}
            onChange={(e) => setNftMintAddress(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          <input
            type="text"
            placeholder="NFT Token Account Address"
            value={nftTokenAccount}
            onChange={(e) => setNftTokenAccount(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          <input
            type="number"
            step="0.1"
            placeholder="List Price (SOL)"
            value={listPrice}
            onChange={(e) => setListPrice(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          <input
            type="number"
            placeholder="Expires in Days (optional)"
            value={expiresInDays}
            onChange={(e) => setExpiresInDays(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          <Button
            onClick={async () => {
              try {
                const lamports = Math.floor(listPrice * LAMPORTS_PER_SOL);
                const expiresAt = expiresInDays > 0 
                  ? Math.floor(Date.now() / 1000) + expiresInDays * 24 * 60 * 60
                  : null;
                const result = await listNFT(
                  new PublicKey(nftMintAddress),
                  new PublicKey(nftTokenAccount),
                  lamports,
                  null,
                  expiresAt
                );
                console.log('NFT listed:', result);
                alert('NFT listed successfully! Listing: ' + result.listing.toBase58());
              } catch (err) {
                console.error('List NFT failed:', err);
              }
            }}
            loading={loading}
            className="w-full"
          >
            List NFT
          </Button>
        </div>

        <div className="pt-4 border-t border-gray-200 space-y-2">
          <h3 className="font-semibold">Buy NFT</h3>
          <input
            type="text"
            placeholder="NFT Mint Address"
            value={nftMintAddress}
            onChange={(e) => setNftMintAddress(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          <input
            type="text"
            placeholder="Seller Address"
            value={sellerAddress}
            onChange={(e) => setSellerAddress(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          <Button
            onClick={async () => {
              try {
                const tx = await buyNFT(
                  new PublicKey(nftMintAddress),
                  new PublicKey(sellerAddress)
                );
                console.log('NFT purchased:', tx);
                alert('NFT purchased successfully! Tx: ' + tx);
              } catch (err) {
                console.error('Buy NFT failed:', err);
              }
            }}
            loading={loading}
            variant="secondary"
            className="w-full"
          >
            Buy NFT
          </Button>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">Create NFT Offer</h3>
          <input
            type="text"
            placeholder="NFT Mint Address"
            value={nftMintAddress}
            onChange={(e) => setNftMintAddress(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          <input
            type="number"
            step="0.1"
            placeholder="Offer Amount (SOL)"
            value={offerAmount}
            onChange={(e) => setOfferAmount(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          <input
            type="number"
            placeholder="Expires in Days"
            value={expiresInDays}
            onChange={(e) => setExpiresInDays(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          <Button
            onClick={async () => {
              try {
                const lamports = Math.floor(offerAmount * LAMPORTS_PER_SOL);
                const expiresAt = Math.floor(Date.now() / 1000) + expiresInDays * 24 * 60 * 60;
                const result = await createOffer(
                  new PublicKey(nftMintAddress),
                  lamports,
                  null,
                  expiresAt
                );
                console.log('Offer created:', result);
              } catch (err) {
                console.error('Create offer failed:', err);
              }
            }}
            loading={loading}
            className="w-full"
          >
            Create Offer
          </Button>
        </div>

        <div className="pt-4 border-t border-gray-200 space-y-2">
          <h3 className="font-semibold">Accept Offer (Seller)</h3>
          <input
            type="text"
            placeholder="NFT Mint Address"
            value={nftMintAddress}
            onChange={(e) => setNftMintAddress(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          <input
            type="text"
            placeholder="Buyer Address"
            value={buyerAddress}
            onChange={(e) => setBuyerAddress(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          <Button
            onClick={async () => {
              try {
                await acceptOffer(
                  new PublicKey(nftMintAddress),
                  new PublicKey(buyerAddress)
                );
              } catch (err) {
                console.error('Accept offer failed:', err);
              }
            }}
            loading={loading}
            variant="secondary"
            className="w-full"
          >
            Accept Offer
          </Button>
        </div>

        <div className="pt-4 border-t border-gray-200 space-y-2">
          <h3 className="font-semibold">Cancel Listing</h3>
          <input
            type="text"
            placeholder="NFT Mint Address"
            value={nftMintAddress}
            onChange={(e) => setNftMintAddress(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          <Button
            onClick={async () => {
              try {
                await cancelListing(new PublicKey(nftMintAddress));
              } catch (err) {
                console.error('Cancel listing failed:', err);
              }
            }}
            loading={loading}
            variant="secondary"
            className="w-full"
          >
            Cancel Listing
          </Button>
        </div>
      </div>
    </Card>
  );
}
