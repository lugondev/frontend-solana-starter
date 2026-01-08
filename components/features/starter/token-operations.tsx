'use client';

import { useTokenOperations } from '@/lib/hooks/use-token-operations';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWallet } from '@solana/wallet-adapter-react';
import { useState } from 'react';
import { PublicKey } from '@solana/web3.js';

export function TokenOperations() {
  const { publicKey } = useWallet();
  const {
    loading,
    error,
    createMint,
    burnTokens,
    approveDelegate,
    freezeAccount,
    transferTokens,
    closeTokenAccount,
  } = useTokenOperations();

  const [mintAddress, setMintAddress] = useState('');
  const [tokenAccountAddress, setTokenAccountAddress] = useState('');
  const [burnAmount, setBurnAmount] = useState(100);
  const [delegateAddress, setDelegateAddress] = useState('');
  const [delegateAmount, setDelegateAmount] = useState(100);
  const [toTokenAccount, setToTokenAccount] = useState('');
  const [transferAmount, setTransferAmount] = useState(100);

  if (!publicKey) {
    return (
      <Card title="Token Operations">
        <p className="text-gray-600">Connect your wallet to manage tokens</p>
      </Card>
    );
  }

  return (
    <Card title="Token Operations">
      <div className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-2">
          <h3 className="font-semibold">Create Program Mint</h3>
          <Button
            onClick={async () => {
              try {
                const result = await createMint();
                setMintAddress(result.mint.toBase58());
                console.log('Mint created:', result);
              } catch (err) {
                console.error('Create mint failed:', err);
              }
            }}
            loading={loading}
            className="w-full"
          >
            Create Mint (PDA)
          </Button>
          {mintAddress && (
            <p className="text-xs font-mono bg-gray-100 p-2 rounded break-all">
              {mintAddress}
            </p>
          )}
        </div>

        <div className="pt-4 border-t border-gray-200 space-y-2">
          <h3 className="font-semibold">Burn Tokens</h3>
          <input
            type="text"
            placeholder="Token Account Address"
            value={tokenAccountAddress}
            onChange={(e) => setTokenAccountAddress(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          <input
            type="text"
            placeholder="Mint Address"
            value={mintAddress}
            onChange={(e) => setMintAddress(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          <input
            type="number"
            placeholder="Amount"
            value={burnAmount}
            onChange={(e) => setBurnAmount(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          <Button
            onClick={async () => {
              try {
                await burnTokens(
                  new PublicKey(tokenAccountAddress),
                  new PublicKey(mintAddress),
                  burnAmount
                );
              } catch (err) {
                console.error('Burn failed:', err);
              }
            }}
            loading={loading}
            variant="secondary"
            className="w-full"
          >
            Burn Tokens
          </Button>
        </div>

        <div className="pt-4 border-t border-gray-200 space-y-2">
          <h3 className="font-semibold">Approve Delegate</h3>
          <input
            type="text"
            placeholder="Token Account Address"
            value={tokenAccountAddress}
            onChange={(e) => setTokenAccountAddress(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          <input
            type="text"
            placeholder="Delegate Address"
            value={delegateAddress}
            onChange={(e) => setDelegateAddress(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          <input
            type="number"
            placeholder="Amount"
            value={delegateAmount}
            onChange={(e) => setDelegateAmount(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          <Button
            onClick={async () => {
              try {
                await approveDelegate(
                  new PublicKey(tokenAccountAddress),
                  new PublicKey(delegateAddress),
                  delegateAmount
                );
              } catch (err) {
                console.error('Approve failed:', err);
              }
            }}
            loading={loading}
            className="w-full"
          >
            Approve Delegate
          </Button>
        </div>

        <div className="pt-4 border-t border-gray-200 space-y-2">
          <h3 className="font-semibold">Transfer Tokens</h3>
          <input
            type="text"
            placeholder="From Token Account Address"
            value={tokenAccountAddress}
            onChange={(e) => setTokenAccountAddress(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          <input
            type="text"
            placeholder="To Token Account Address"
            value={toTokenAccount}
            onChange={(e) => setToTokenAccount(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          <input
            type="text"
            placeholder="Mint Address"
            value={mintAddress}
            onChange={(e) => setMintAddress(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          <input
            type="number"
            placeholder="Amount"
            value={transferAmount}
            onChange={(e) => setTransferAmount(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          <Button
            onClick={async () => {
              try {
                const tx = await transferTokens(
                  new PublicKey(tokenAccountAddress),
                  new PublicKey(toTokenAccount),
                  new PublicKey(mintAddress),
                  transferAmount
                );
                console.log('Transfer success:', tx);
                alert('Tokens transferred successfully! Tx: ' + tx);
              } catch (err) {
                console.error('Transfer failed:', err);
              }
            }}
            loading={loading}
            className="w-full"
          >
            Transfer Tokens
          </Button>
        </div>

        <div className="pt-4 border-t border-gray-200 space-y-2">
          <h3 className="font-semibold">Freeze Account</h3>
          <input
            type="text"
            placeholder="Token Account Address"
            value={tokenAccountAddress}
            onChange={(e) => setTokenAccountAddress(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          <input
            type="text"
            placeholder="Mint Address"
            value={mintAddress}
            onChange={(e) => setMintAddress(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          <Button
            onClick={async () => {
              try {
                await freezeAccount(
                  new PublicKey(tokenAccountAddress),
                  new PublicKey(mintAddress)
                );
              } catch (err) {
                console.error('Freeze failed:', err);
              }
            }}
            loading={loading}
            variant="secondary"
            className="w-full"
          >
            Freeze Account
          </Button>
        </div>
      </div>
    </Card>
  );
}
