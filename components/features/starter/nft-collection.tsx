'use client';

import { useNFTCollection } from '@/lib/hooks/use-nft-collection';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWallet } from '@solana/wallet-adapter-react';
import { useState } from 'react';
import { PublicKey } from '@solana/web3.js';

export function NFTCollection() {
  const { publicKey } = useWallet();
  const { loading, error, createCollection, mintNFT } = useNFTCollection();

  const [collectionMint, setCollectionMint] = useState('');
  const [collectionName, setCollectionName] = useState('');
  const [collectionSymbol, setCollectionSymbol] = useState('');
  const [collectionUri, setCollectionUri] = useState('');
  const [sellerFee, setSellerFee] = useState(500);
  const [totalSupply, setTotalSupply] = useState(10000);
  const [isMutable, setIsMutable] = useState(true);

  const [mintCollectionAddress, setMintCollectionAddress] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [nftName, setNftName] = useState('');
  const [nftUri, setNftUri] = useState('');
  const [creatorAddress, setCreatorAddress] = useState('');
  const [creatorShare, setCreatorShare] = useState(100);

  if (!publicKey) {
    return (
      <Card title="NFT Collection Management">
        <p className="text-gray-600">Connect your wallet to manage NFT collections</p>
      </Card>
    );
  }

  return (
    <Card title="NFT Collection Management">
      <div className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Collection Features</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Create NFT collections with metadata</li>
            <li>• Set royalty fees and total supply</li>
            <li>• Mint NFTs within collections</li>
            <li>• Assign multiple creators with revenue shares</li>
            <li>• Control mutability settings</li>
          </ul>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">Create NFT Collection</h3>
          <input
            type="text"
            placeholder="Collection Mint Address (existing mint)"
            value={collectionMint}
            onChange={(e) => setCollectionMint(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          <input
            type="text"
            placeholder="Collection Name"
            value={collectionName}
            onChange={(e) => setCollectionName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          <input
            type="text"
            placeholder="Symbol (e.g., NFT)"
            value={collectionSymbol}
            onChange={(e) => setCollectionSymbol(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          <input
            type="text"
            placeholder="Metadata URI"
            value={collectionUri}
            onChange={(e) => setCollectionUri(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          <input
            type="number"
            placeholder="Seller Fee Basis Points (500 = 5%)"
            value={sellerFee}
            onChange={(e) => setSellerFee(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          <input
            type="number"
            placeholder="Total Supply"
            value={totalSupply}
            onChange={(e) => setTotalSupply(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isMutable}
              onChange={(e) => setIsMutable(e.target.checked)}
            />
            <span>Mutable (can update metadata)</span>
          </label>
          <Button
            onClick={async () => {
              try {
                const result = await createCollection(
                  new PublicKey(collectionMint),
                  collectionName,
                  collectionSymbol,
                  collectionUri,
                  sellerFee,
                  totalSupply,
                  isMutable
                );
                console.log('Collection created:', result);
                alert(
                  'Collection created successfully!\n' +
                    'PDA: ' +
                    result.collection.toBase58() +
                    '\nTx: ' +
                    result.signature
                );
              } catch (err) {
                console.error('Create collection failed:', err);
              }
            }}
            loading={loading}
            className="w-full"
          >
            Create Collection
          </Button>
        </div>

        <div className="pt-4 border-t border-gray-200 space-y-2">
          <h3 className="font-semibold">Mint NFT in Collection</h3>
          <input
            type="text"
            placeholder="Collection Mint Address"
            value={mintCollectionAddress}
            onChange={(e) => setMintCollectionAddress(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          <input
            type="text"
            placeholder="Recipient Address"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          <input
            type="text"
            placeholder="NFT Name"
            value={nftName}
            onChange={(e) => setNftName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          <input
            type="text"
            placeholder="NFT Metadata URI"
            value={nftUri}
            onChange={(e) => setNftUri(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          <div className="bg-gray-50 p-3 rounded-lg space-y-2">
            <label className="text-sm font-medium">Creator Info</label>
            <input
              type="text"
              placeholder="Creator Address"
              value={creatorAddress}
              onChange={(e) => setCreatorAddress(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
            <input
              type="number"
              placeholder="Creator Share (0-100)"
              value={creatorShare}
              onChange={(e) => setCreatorShare(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
            <p className="text-xs text-gray-600">
              Note: For multiple creators, you'll need to modify the code to support an array
            </p>
          </div>
          <Button
            onClick={async () => {
              try {
                const creators = creatorAddress
                  ? [
                      {
                        address: new PublicKey(creatorAddress),
                        share: creatorShare,
                        verified: false,
                      },
                    ]
                  : [];

                const result = await mintNFT(
                  new PublicKey(mintCollectionAddress),
                  new PublicKey(recipientAddress),
                  nftName,
                  nftUri,
                  creators
                );
                console.log('NFT minted:', result);
                alert(
                  'NFT minted successfully!\n' +
                    'NFT Mint: ' +
                    result.nftMint.toBase58() +
                    '\nMetadata: ' +
                    result.metadata.toBase58() +
                    '\nTx: ' +
                    result.signature
                );
              } catch (err) {
                console.error('Mint NFT failed:', err);
              }
            }}
            loading={loading}
            variant="secondary"
            className="w-full"
          >
            Mint NFT
          </Button>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-900 mb-2">Important Notes</h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Collection mint must be created first (use Token Operations)</li>
              <li>• NFT mint is auto-generated when minting</li>
              <li>• Seller fee is in basis points (100 = 1%, 500 = 5%)</li>
              <li>• Creator shares must add up to 100</li>
              <li>• Authority must match collection creator</li>
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
}
