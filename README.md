# Solana Full-Stack Frontend

A production-ready Next.js 16.1.1 frontend with comprehensive Solana integration, featuring wallet connection, program interactions, real-time data fetching, and complete UI for Starter and Counter programs.

## Features

- ✅ **Next.js 16.1.1** with App Router and React 19
- ✅ **Complete Program Integration** - Full UI for all 17 Starter + 6 Counter instructions
- ✅ **Multi-Wallet Support** - Phantom, Solflare, Backpack, Torus
- ✅ **13 Custom Hooks** - Reusable hooks for all Solana operations
- ✅ **TypeScript Strict** - Type-safe with auto-generated Anchor types
- ✅ **Tailwind CSS 4** - Modern styling with custom components
- ✅ **SWR Integration** - Optimized data fetching and caching
- ✅ **Real-time Updates** - WebSocket subscriptions for balance changes
- ✅ **Transaction Handling** - Loading states and error handling
- ✅ **Responsive UI** - Mobile-first design with loading skeletons

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- pnpm (recommended) or npm/yarn

### Installation

1. Clone the repository and navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
pnpm install
# or
npm install
# or
yarn install
```

3. Copy the environment variables:

```bash
cp .env.local.example .env.local
```

4. Update `.env.local` with your Solana RPC endpoint (optional):

```env
NEXT_PUBLIC_SOLANA_RPC_HOST=https://api.devnet.solana.com
NEXT_PUBLIC_SOLANA_NETWORK=devnet
```

### Development

Run the development server:

```bash
pnpm dev
# or
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### Build

Build for production:

```bash
pnpm build
pnpm start
```

## Project Structure

```
frontend/
├── app/                         # Next.js app directory
│   ├── dashboard/              # Main dashboard page
│   ├── programs/               # Program interactions page
│   ├── layout.tsx             # Root layout with WalletProvider
│   ├── page.tsx               # Landing page
│   └── globals.css            # Global styles
├── components/
│   ├── features/
│   │   ├── wallet/            # Wallet components
│   │   │   ├── wallet-provider.tsx
│   │   │   ├── wallet-button.tsx
│   │   │   └── wallet-balance.tsx
│   │   ├── starter/           # Starter program features
│   │   │   ├── token-operations.tsx    # Mint, transfer, burn
│   │   │   ├── user-account.tsx        # User account management
│   │   │   ├── governance.tsx          # Proposal voting
│   │   │   ├── role-management.tsx     # RBAC system
│   │   │   ├── treasury-management.tsx # Multi-sig treasury
│   │   │   ├── nft-collection.tsx      # NFT minting
│   │   │   ├── nft-marketplace.tsx     # NFT trading
│   │   │   ├── cross-program-demo.tsx  # CPI examples
│   │   │   └── index.ts                # Exports
│   │   └── counter/           # Counter program UI
│   │       └── counter-display.tsx
│   └── ui/                    # Reusable UI components
│       ├── button.tsx
│       ├── card.tsx
│       ├── loading-spinner.tsx
│       └── skeleton.tsx
├── lib/
│   ├── hooks/                 # 13 custom React hooks
│   │   ├── use-balance.ts
│   │   ├── use-account.ts
│   │   ├── use-send-transaction.ts
│   │   ├── use-transaction-history.ts
│   │   ├── use-starter-program.ts      # Core program ops
│   │   ├── use-counter-program.ts      # Counter ops
│   │   ├── use-token-operations.ts     # Token ops
│   │   ├── use-governance.ts           # Governance
│   │   ├── use-role-management.ts      # RBAC
│   │   ├── use-treasury.ts             # Treasury
│   │   ├── use-nft-collection.ts       # NFT creation
│   │   ├── use-nft-marketplace.ts      # NFT trading
│   │   └── index.ts
│   ├── anchor/                # Anchor integration
│   │   ├── idl/              # JSON IDL files
│   │   │   ├── starter_program.json
│   │   │   └── counter_program.json
│   │   ├── types/            # Auto-generated types
│   │   │   ├── starter_program.ts
│   │   │   └── counter_program.ts
│   │   └── program.ts        # Program instances
│   ├── solana/               # Solana configuration
│   │   └── connection.ts
│   └── utils/                # Utility functions
│       └── format.ts
└── public/                   # Static assets
```

## Program Features

### Starter Program (17 Instructions)

**Token Operations**
- Mint tokens to any address
- Transfer tokens between accounts
- Burn tokens from wallet
- Approve and revoke delegates
- Freeze/thaw token accounts

**User Account Management**
- Create PDA-based user accounts
- Update user points and metadata
- Close accounts and reclaim rent

**Governance System**
- Create governance proposals
- Vote on proposals (Yes/No/Abstain)
- Execute approved proposals
- View proposal history

**Role-Based Access Control**
- Assign roles to users
- Update role permissions
- Revoke roles
- Check role permissions

**Treasury Management**
- Deposit SOL to treasury
- Withdraw with multi-sig
- Distribute to multiple recipients
- View treasury balance

**NFT Collection & Marketplace**
- Create NFT collections
- Mint NFTs with metadata
- List NFTs for sale
- Buy/sell NFTs
- Cancel listings
- Make/accept offers

**Cross-Program Invocation**
- Transfer SOL via CPI
- Transfer tokens with PDA signer
- Increment counter via CPI

### Counter Program (6 Instructions)

- Initialize counter account
- Increment counter (+1)
- Decrement counter (-1)
- Add arbitrary value
- Reset counter (authority only)
- Increment with SOL payment

## Custom Hooks API

### Wallet Hooks

**useBalance** - Fetch and cache wallet balance
```typescript
const { balance, isLoading, error, refetch } = useBalance(publicKey, {
  refreshInterval: 30000,
  revalidateOnFocus: true,
});
```

**useAccount** - Fetch account information
```typescript
const { account, isLoading, error } = useAccount(publicKey);
```

**useSendTransaction** - Send SOL with loading states
```typescript
const { send, loading, error } = useSendTransaction({
  onSuccess: (signature) => {},
  onError: (error) => {},
});
```

**useTransactionHistory** - Fetch recent transactions
```typescript
const { transactions, isLoading } = useTransactionHistory(publicKey, { limit: 10 });
```

### Starter Program Hooks

**useStarterProgram** - Core operations
```typescript
const { createUserAccount, updateUserAccount, closeUserAccount } = useStarterProgram();
```

**useTokenOperations** - Token management
```typescript
const { mintTokens, transferTokens, burnTokens, approveDelegate } = useTokenOperations();
```

**useGovernance** - Proposal voting
```typescript
const { createProposal, vote, executeProposal, proposals } = useGovernance();
```

**useRoleManagement** - RBAC system
```typescript
const { assignRole, revokeRole, updateRolePermissions } = useRoleManagement();
```

**useTreasury** - Treasury operations
```typescript
const { deposit, withdraw, distribute, balance } = useTreasury();
```

**useNftCollection** - NFT creation
```typescript
const { createCollection, mintNft, collections } = useNftCollection();
```

**useNftMarketplace** - NFT trading
```typescript
const { listNft, buyNft, cancelListing, createOffer } = useNftMarketplace();
```

### Counter Program Hooks

**useCounterProgram** - Counter operations
```typescript
const { initialize, increment, decrement, add, reset, counter } = useCounterProgram();
```

## Detailed Hook Documentation

### Wallet Hooks

#### `useBalance`

Fetch and monitor wallet balance with automatic caching and real-time updates.

**Features:**
- SWR-powered caching
- Automatic revalidation
- WebSocket subscription for real-time updates
- Configurable refresh intervals

**API:**
```typescript
const { balance, isLoading, error, refetch } = useBalance(
  publicKey,
  {
    refreshInterval: 30000,      // Auto-refresh every 30s
    revalidateOnFocus: true,     // Refresh on window focus
    revalidateOnReconnect: true, // Refresh on network reconnect
  }
);
```

**Return Values:**
- `balance: number | null` - Balance in SOL (null if loading)
- `isLoading: boolean` - Loading state
- `error: Error | null` - Error object if fetch fails
- `refetch: () => void` - Manual refresh function

**Example:**
```typescript
function WalletBalance() {
  const { publicKey } = useWallet();
  const { balance, isLoading, error, refetch } = useBalance(publicKey);

  if (isLoading) return <Skeleton className="h-8 w-32" />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <p>Balance: {balance?.toFixed(4)} SOL</p>
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
```

#### `useAccount`

Fetch detailed account information from the blockchain.

**API:**
```typescript
const { account, isLoading, error, refetch } = useAccount(publicKey);
```

**Return Values:**
- `account: AccountInfo<Buffer> | null` - Full account data
- `isLoading: boolean` - Loading state
- `error: Error | null` - Error object
- `refetch: () => void` - Manual refresh

**Example:**
```typescript
function AccountDetails({ address }: { address: PublicKey }) {
  const { account, isLoading } = useAccount(address);

  if (isLoading) return <LoadingSpinner />;
  if (!account) return <div>Account not found</div>;

  return (
    <div>
      <p>Lamports: {account.lamports}</p>
      <p>Owner: {account.owner.toString()}</p>
      <p>Executable: {account.executable ? 'Yes' : 'No'}</p>
    </div>
  );
}
```

#### `useSendTransaction`

Send SOL transactions with built-in loading states and error handling.

**API:**
```typescript
const { send, loading, error } = useSendTransaction({
  onSuccess: (signature: string) => void,
  onError: (error: Error) => void,
});
```

**Parameters:**
- `send(to: PublicKey, amount: number): Promise<string>` - Send transaction
  - `to`: Recipient public key
  - `amount`: Amount in SOL
  - Returns transaction signature

**Example:**
```typescript
function SendSolForm() {
  const { publicKey, sendTransaction } = useWallet();
  const { send, loading, error } = useSendTransaction({
    onSuccess: (sig) => {
      toast.success(`Transaction sent: ${sig}`);
    },
    onError: (err) => {
      toast.error(`Failed: ${err.message}`);
    },
  });

  const handleSend = async () => {
    const recipient = new PublicKey('...');
    const amount = 0.1;
    await send(recipient, amount);
  };

  return (
    <button onClick={handleSend} disabled={loading}>
      {loading ? 'Sending...' : 'Send 0.1 SOL'}
    </button>
  );
}
```

#### `useTransactionHistory`

Fetch transaction history with pagination support.

**API:**
```typescript
const { transactions, isLoading, error, refetch } = useTransactionHistory(
  publicKey,
  {
    limit: 10,
    refreshInterval: 60000,
  }
);
```

**Return Values:**
- `transactions: ParsedTransactionWithMeta[]` - Array of transactions
- `isLoading: boolean` - Loading state
- `error: Error | null` - Error object
- `refetch: () => void` - Manual refresh

**Example:**
```typescript
function TransactionList() {
  const { publicKey } = useWallet();
  const { transactions, isLoading } = useTransactionHistory(publicKey, {
    limit: 20,
  });

  if (isLoading) return <Skeleton count={5} />;

  return (
    <ul>
      {transactions?.map((tx) => (
        <li key={tx.transaction.signatures[0]}>
          {tx.transaction.signatures[0]}
        </li>
      ))}
    </ul>
  );
}
```

### Starter Program Hooks

#### `useStarterProgram`

Core operations for user account management.

**API:**
```typescript
const {
  createUserAccount,
  updateUserAccount,
  closeUserAccount,
  getUserAccount,
  isLoading,
  error,
} = useStarterProgram();
```

**Methods:**
- `createUserAccount(): Promise<string>` - Create PDA user account
- `updateUserAccount(points: number): Promise<string>` - Update user points
- `closeUserAccount(): Promise<string>` - Close account and reclaim rent
- `getUserAccount(publicKey: PublicKey): Promise<UserAccount | null>` - Fetch user account

**Example:**
```typescript
function UserAccountManager() {
  const { publicKey } = useWallet();
  const {
    createUserAccount,
    updateUserAccount,
    getUserAccount,
    isLoading,
  } = useStarterProgram();

  const [userAccount, setUserAccount] = useState(null);

  useEffect(() => {
    if (publicKey) {
      getUserAccount(publicKey).then(setUserAccount);
    }
  }, [publicKey]);

  const handleCreate = async () => {
    const signature = await createUserAccount();
    console.log('User account created:', signature);
    // Refresh user account
    const account = await getUserAccount(publicKey);
    setUserAccount(account);
  };

  return (
    <div>
      {userAccount ? (
        <div>
          <p>Points: {userAccount.points.toString()}</p>
          <button onClick={() => updateUserAccount(100)}>
            Add 100 Points
          </button>
        </div>
      ) : (
        <button onClick={handleCreate} disabled={isLoading}>
          Create Account
        </button>
      )}
    </div>
  );
}
```

#### `useTokenOperations`

Comprehensive token operations (mint, transfer, burn).

**API:**
```typescript
const {
  mintTokens,
  transferTokens,
  burnTokens,
  approveDelegate,
  revokeDelegate,
  freezeAccount,
  thawAccount,
  isLoading,
  error,
} = useTokenOperations();
```

**Methods:**
- `mintTokens(amount: BN, recipient: PublicKey): Promise<string>`
- `transferTokens(recipient: PublicKey, amount: BN): Promise<string>`
- `burnTokens(amount: BN): Promise<string>`
- `approveDelegate(delegate: PublicKey, amount: BN): Promise<string>`
- `revokeDelegate(): Promise<string>`
- `freezeAccount(account: PublicKey): Promise<string>`
- `thawAccount(account: PublicKey): Promise<string>`

**Example:**
```typescript
function TokenManager() {
  const { publicKey } = useWallet();
  const { mintTokens, transferTokens, burnTokens, isLoading } = useTokenOperations();
  const [amount, setAmount] = useState('');

  const handleMint = async () => {
    const bn = new BN(parseFloat(amount) * 1e6); // 6 decimals
    const sig = await mintTokens(bn, publicKey!);
    toast.success(`Minted! Signature: ${sig}`);
  };

  const handleTransfer = async () => {
    const recipient = new PublicKey('...');
    const bn = new BN(parseFloat(amount) * 1e6);
    await transferTokens(recipient, bn);
  };

  const handleBurn = async () => {
    const bn = new BN(parseFloat(amount) * 1e6);
    await burnTokens(bn);
  };

  return (
    <div>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
      />
      <button onClick={handleMint} disabled={isLoading}>Mint</button>
      <button onClick={handleTransfer} disabled={isLoading}>Transfer</button>
      <button onClick={handleBurn} disabled={isLoading}>Burn</button>
    </div>
  );
}
```

#### `useGovernance`

Governance system for proposal creation and voting.

**API:**
```typescript
const {
  createProposal,
  vote,
  executeProposal,
  proposals,
  isLoading,
  error,
} = useGovernance();
```

**Methods:**
- `createProposal(title: string, description: string): Promise<string>`
- `vote(proposalId: PublicKey, voteType: 'yes' | 'no' | 'abstain'): Promise<string>`
- `executeProposal(proposalId: PublicKey): Promise<string>`
- `proposals: Proposal[]` - List of all proposals

**Example:**
```typescript
function GovernancePanel() {
  const { createProposal, vote, proposals, isLoading } = useGovernance();

  const handleCreateProposal = async () => {
    await createProposal(
      'Increase Treasury Allocation',
      'Proposal to increase treasury allocation by 10%'
    );
  };

  return (
    <div>
      <button onClick={handleCreateProposal}>Create Proposal</button>
      
      <div>
        {proposals.map((proposal) => (
          <div key={proposal.id.toString()}>
            <h3>{proposal.title}</h3>
            <p>{proposal.description}</p>
            <button onClick={() => vote(proposal.id, 'yes')}>
              Vote Yes
            </button>
            <button onClick={() => vote(proposal.id, 'no')}>
              Vote No
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

#### `useRoleManagement`

Role-based access control system.

**API:**
```typescript
const {
  assignRole,
  revokeRole,
  updateRolePermissions,
  getUserRole,
  isLoading,
  error,
} = useRoleManagement();
```

**Methods:**
- `assignRole(user: PublicKey, role: 'admin' | 'moderator' | 'user'): Promise<string>`
- `revokeRole(user: PublicKey): Promise<string>`
- `updateRolePermissions(role: string, permissions: string[]): Promise<string>`
- `getUserRole(user: PublicKey): Promise<Role | null>`

**Example:**
```typescript
function RoleManager() {
  const { assignRole, revokeRole, getUserRole } = useRoleManagement();
  const [userAddress, setUserAddress] = useState('');
  const [role, setRole] = useState<'admin' | 'moderator' | 'user'>('user');

  const handleAssignRole = async () => {
    const pubkey = new PublicKey(userAddress);
    await assignRole(pubkey, role);
    toast.success(`Role ${role} assigned to ${userAddress}`);
  };

  return (
    <div>
      <input
        value={userAddress}
        onChange={(e) => setUserAddress(e.target.value)}
        placeholder="User address"
      />
      <select value={role} onChange={(e) => setRole(e.target.value as any)}>
        <option value="user">User</option>
        <option value="moderator">Moderator</option>
        <option value="admin">Admin</option>
      </select>
      <button onClick={handleAssignRole}>Assign Role</button>
    </div>
  );
}
```

#### `useTreasury`

Treasury management with multi-sig support.

**API:**
```typescript
const {
  deposit,
  withdraw,
  distribute,
  balance,
  isLoading,
  error,
} = useTreasury();
```

**Methods:**
- `deposit(amount: number): Promise<string>` - Deposit SOL
- `withdraw(amount: number, recipient: PublicKey): Promise<string>` - Withdraw with multi-sig
- `distribute(recipients: PublicKey[], amounts: number[]): Promise<string>` - Multi-recipient distribution
- `balance: number | null` - Current treasury balance

**Example:**
```typescript
function TreasuryDashboard() {
  const { deposit, withdraw, distribute, balance } = useTreasury();

  const handleDeposit = async () => {
    await deposit(1.0); // Deposit 1 SOL
  };

  const handleDistribute = async () => {
    const recipients = [
      new PublicKey('...'),
      new PublicKey('...'),
    ];
    const amounts = [0.5, 0.5]; // 0.5 SOL each
    await distribute(recipients, amounts);
  };

  return (
    <div>
      <h2>Treasury Balance: {balance?.toFixed(2)} SOL</h2>
      <button onClick={handleDeposit}>Deposit 1 SOL</button>
      <button onClick={handleDistribute}>Distribute</button>
    </div>
  );
}
```

#### `useNftCollection`

NFT collection creation and minting.

**API:**
```typescript
const {
  createCollection,
  mintNft,
  collections,
  isLoading,
  error,
} = useNftCollection();
```

**Methods:**
- `createCollection(name: string, symbol: string, uri: string): Promise<string>`
- `mintNft(collectionId: PublicKey, metadata: NftMetadata): Promise<string>`
- `collections: Collection[]` - List of user's collections

**Example:**
```typescript
function NftCreator() {
  const { createCollection, mintNft, collections } = useNftCollection();

  const handleCreateCollection = async () => {
    await createCollection(
      'My NFT Collection',
      'MNC',
      'https://arweave.net/...'
    );
  };

  const handleMintNft = async (collectionId: PublicKey) => {
    const metadata = {
      name: 'NFT #1',
      symbol: 'MNC',
      uri: 'https://arweave.net/nft-1',
    };
    await mintNft(collectionId, metadata);
  };

  return (
    <div>
      <button onClick={handleCreateCollection}>Create Collection</button>
      
      {collections.map((col) => (
        <div key={col.id.toString()}>
          <h3>{col.name}</h3>
          <button onClick={() => handleMintNft(col.id)}>
            Mint NFT
          </button>
        </div>
      ))}
    </div>
  );
}
```

#### `useNftMarketplace`

NFT marketplace for listing, buying, and trading.

**API:**
```typescript
const {
  listNft,
  buyNft,
  cancelListing,
  createOffer,
  acceptOffer,
  listings,
  isLoading,
  error,
} = useNftMarketplace();
```

**Methods:**
- `listNft(nftMint: PublicKey, price: number): Promise<string>`
- `buyNft(listingId: PublicKey): Promise<string>`
- `cancelListing(listingId: PublicKey): Promise<string>`
- `createOffer(nftMint: PublicKey, price: number): Promise<string>`
- `acceptOffer(offerId: PublicKey): Promise<string>`
- `listings: Listing[]` - Active marketplace listings

**Example:**
```typescript
function NftMarketplace() {
  const { listNft, buyNft, cancelListing, listings } = useNftMarketplace();

  const handleList = async (nftMint: PublicKey) => {
    await listNft(nftMint, 2.5); // List for 2.5 SOL
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {listings.map((listing) => (
        <div key={listing.id.toString()} className="border p-4">
          <h3>{listing.name}</h3>
          <p>Price: {listing.price} SOL</p>
          <button onClick={() => buyNft(listing.id)}>
            Buy Now
          </button>
          {listing.seller.equals(publicKey!) && (
            <button onClick={() => cancelListing(listing.id)}>
              Cancel
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
```

### Counter Program Hooks

#### `useCounterProgram`

Simple counter operations with payment integration.

**API:**
```typescript
const {
  initialize,
  increment,
  decrement,
  add,
  reset,
  counter,
  isLoading,
  error,
} = useCounterProgram();
```

**Methods:**
- `initialize(): Promise<string>` - Initialize counter account
- `increment(): Promise<string>` - Increment by 1
- `decrement(): Promise<string>` - Decrement by 1
- `add(value: number): Promise<string>` - Add arbitrary value
- `reset(): Promise<string>` - Reset to 0 (authority only)
- `counter: number | null` - Current counter value

**Example:**
```typescript
function CounterDisplay() {
  const {
    initialize,
    increment,
    decrement,
    add,
    reset,
    counter,
    isLoading,
  } = useCounterProgram();

  return (
    <div>
      <h2>Counter: {counter ?? 'Not initialized'}</h2>
      
      {counter === null ? (
        <button onClick={initialize}>Initialize Counter</button>
      ) : (
        <div>
          <button onClick={increment} disabled={isLoading}>+1</button>
          <button onClick={decrement} disabled={isLoading}>-1</button>
          <button onClick={() => add(10)} disabled={isLoading}>
            +10
          </button>
          <button onClick={reset} disabled={isLoading}>Reset</button>
        </div>
      )}
    </div>
  );
}
```

## Complete Usage Example

Here's a comprehensive example combining multiple hooks:

```typescript
'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useState, useEffect } from 'react';
import {
  useBalance,
  useStarterProgram,
  useTokenOperations,
  useGovernance,
  useTransactionHistory,
} from '@/lib/hooks';
import { BN } from '@coral-xyz/anchor';

export default function DashboardPage() {
  const { publicKey, connected } = useWallet();
  
  // Wallet hooks
  const { balance, isLoading: balanceLoading, refetch: refetchBalance } = 
    useBalance(publicKey, { refreshInterval: 30000 });
  
  const { transactions, isLoading: txLoading } = 
    useTransactionHistory(publicKey, { limit: 5 });
  
  // Program hooks
  const { 
    createUserAccount, 
    getUserAccount, 
    isLoading: userLoading 
  } = useStarterProgram();
  
  const { 
    mintTokens, 
    transferTokens, 
    isLoading: tokenLoading 
  } = useTokenOperations();
  
  const { 
    proposals, 
    vote, 
    isLoading: govLoading 
  } = useGovernance();
  
  // Local state
  const [userAccount, setUserAccount] = useState(null);
  const [tokenAmount, setTokenAmount] = useState('100');

  // Fetch user account on mount
  useEffect(() => {
    if (publicKey) {
      getUserAccount(publicKey).then(setUserAccount);
    }
  }, [publicKey]);

  // Handle token mint
  const handleMint = async () => {
    try {
      const amount = new BN(parseFloat(tokenAmount) * 1e6);
      const signature = await mintTokens(amount, publicKey!);
      console.log('Minted tokens:', signature);
      refetchBalance(); // Refresh balance after mint
    } catch (error) {
      console.error('Mint failed:', error);
    }
  };

  // Handle proposal vote
  const handleVote = async (proposalId: PublicKey, voteType: 'yes' | 'no') => {
    try {
      await vote(proposalId, voteType);
      console.log('Vote submitted');
    } catch (error) {
      console.error('Vote failed:', error);
    }
  };

  if (!connected) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1>Please connect your wallet</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Wallet Info */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Wallet Address:</p>
          <p className="font-mono text-sm">{publicKey?.toString()}</p>
          <p className="mt-4 text-gray-600">Balance:</p>
          <p className="text-2xl font-bold">
            {balanceLoading ? '...' : `${balance?.toFixed(4)} SOL`}
          </p>
        </div>
      </div>

      {/* User Account */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">User Account</h2>
        {userAccount ? (
          <div className="bg-white rounded-lg shadow p-6">
            <p>Points: {userAccount.points.toString()}</p>
            <p>Created: {new Date(userAccount.createdAt * 1000).toLocaleDateString()}</p>
          </div>
        ) : (
          <button
            onClick={createUserAccount}
            disabled={userLoading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            {userLoading ? 'Creating...' : 'Create User Account'}
          </button>
        )}
      </div>

      {/* Token Operations */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Token Operations</h2>
        <div className="bg-white rounded-lg shadow p-6">
          <input
            type="number"
            value={tokenAmount}
            onChange={(e) => setTokenAmount(e.target.value)}
            className="border rounded px-4 py-2 mb-4 w-full"
            placeholder="Amount"
          />
          <button
            onClick={handleMint}
            disabled={tokenLoading}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
          >
            {tokenLoading ? 'Minting...' : 'Mint Tokens'}
          </button>
        </div>
      </div>

      {/* Governance */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Active Proposals</h2>
        {govLoading ? (
          <p>Loading proposals...</p>
        ) : (
          <div className="space-y-4">
            {proposals.map((proposal) => (
              <div key={proposal.id.toString()} className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-bold mb-2">{proposal.title}</h3>
                <p className="text-gray-600 mb-4">{proposal.description}</p>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleVote(proposal.id, 'yes')}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Vote Yes
                  </button>
                  <button
                    onClick={() => handleVote(proposal.id, 'no')}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Vote No
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Transaction History */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Recent Transactions</h2>
        {txLoading ? (
          <p>Loading transactions...</p>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Signature
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Slot
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions?.map((tx, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="px-6 py-4 font-mono text-sm">
                      {tx.transaction.signatures[0].slice(0, 20)}...
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {tx.slot}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
```

## Real-Time Features

### WebSocket Subscriptions

The frontend uses WebSocket subscriptions for real-time updates:

```typescript
// Automatic balance updates
useEffect(() => {
  if (!publicKey) return;

  const subscriptionId = connection.onAccountChange(
    publicKey,
    (accountInfo) => {
      setBalance(accountInfo.lamports / LAMPORTS_PER_SOL);
    },
    'confirmed'
  );

  return () => {
    connection.removeAccountChangeListener(subscriptionId);
  };
}, [publicKey]);
```

### Optimistic Updates

For better UX, UI updates optimistically before blockchain confirmation:

```typescript
const handleTransfer = async (recipient: PublicKey, amount: number) => {
  // Optimistically update UI
  setBalance((prev) => prev - amount);
  
  try {
    await transferTokens(recipient, new BN(amount * 1e6));
    // Transaction confirmed
  } catch (error) {
    // Revert on error
    setBalance((prev) => prev + amount);
    throw error;
  }
};
```

## UI Components

### Button

```typescript
<Button variant="primary" size="md" loading={isLoading}>
  Click Me
</Button>
```

### Card

```typescript
<Card title="My Card" description="Card description">
  Content here
</Card>
```

### LoadingSpinner

```typescript
<LoadingSpinner size="md" />
```

### Skeleton

```typescript
<Skeleton className="h-10 w-full" />
```

## Network Configuration

By default, the app connects to Solana Devnet. To switch networks:

1. Update `.env.local`:

```env
# Devnet
NEXT_PUBLIC_SOLANA_RPC_HOST=https://api.devnet.solana.com
NEXT_PUBLIC_SOLANA_NETWORK=devnet

# Mainnet Beta
# NEXT_PUBLIC_SOLANA_RPC_HOST=https://api.mainnet-beta.solana.com
# NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta

# Custom RPC (recommended for production)
# NEXT_PUBLIC_SOLANA_RPC_HOST=https://your-custom-rpc.com
# NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
```

2. Restart the development server

## Performance Optimization

- **SWR Caching**: All onchain data is cached and deduplicated
- **Automatic Revalidation**: Data refreshes on focus and at intervals
- **WebSocket Subscriptions**: Real-time updates without polling
- **Loading States**: Skeleton screens for better UX
- **Optimistic Updates**: UI updates before transaction confirmation

## Wallet Support

The starter supports multiple Solana wallets:

- Phantom
- Solflare
- Torus
- And more via Wallet Standard

## Tech Stack

- **Next.js 16.1.1** - React framework with App Router
- **React 19** - UI library with Server Components
- **TypeScript 5.9** - Type safety and strict mode
- **Solana Web3.js 1.95+** - Blockchain interaction
- **Anchor 0.31.1** - Program framework and type generation
- **Wallet Adapter** - Multi-wallet support (Phantom, Solflare, Backpack, Torus)
- **SWR 2.2+** - Data fetching, caching, and revalidation
- **Tailwind CSS 4** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **pnpm** - Fast, disk space efficient package manager

## Best Practices

- All code and comments in English
- TypeScript strict mode enabled
- Files under 500 lines
- Component-based architecture
- Custom hooks for reusability
- Error boundaries and loading states
- Responsive design first

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

MIT

## Resources

- [Next.js Documentation](https://nextjs.org/docs) - Next.js features and API
- [Solana Documentation](https://docs.solana.com) - Solana blockchain and development
- [Anchor Framework](https://www.anchor-lang.com/) - Solana program framework
- [Wallet Adapter](https://github.com/solana-labs/wallet-adapter) - Multi-wallet integration
- [SWR Documentation](https://swr.vercel.app) - Data fetching and caching
- [Tailwind CSS](https://tailwindcss.com/docs) - Utility-first CSS framework

## Related Documentation

- [Starter Program Guide](../starter_program/README.md) - Anchor program documentation
- [Cross-Program Invocation](../starter_program/CROSS_PROGRAM.md) - CPI patterns and examples
- [Go Indexer](../go_indexer/README.md) - Event indexing service
- [Root README](../README.md) - Full monorepo overview
