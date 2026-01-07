# Solana Web3 Starter

A modern Next.js 16.1.1 starter with optimized Solana Web3.js integration, featuring real-time data fetching, wallet connection, and transaction handling.

## Features

- ✅ **Next.js 16.1.1** with App Router and React 19
- ✅ **Solana Web3.js** with full wallet adapter support
- ✅ **TypeScript** strict mode for type safety
- ✅ **Tailwind CSS** for styling
- ✅ **SWR** for optimized data fetching and caching
- ✅ **Real-time balance updates** via WebSocket subscriptions
- ✅ **Multiple wallet support** (Phantom, Solflare, Torus)
- ✅ **Transaction handling** with loading states
- ✅ **Responsive UI** with loading skeletons

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
├── app/                      # Next.js app directory
│   ├── dashboard/           # Dashboard page
│   ├── layout.tsx          # Root layout with WalletProvider
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles
├── components/
│   ├── features/
│   │   └── wallet/         # Wallet-related components
│   │       ├── wallet-provider.tsx
│   │       ├── wallet-button.tsx
│   │       └── wallet-balance.tsx
│   └── ui/                 # Reusable UI components
│       ├── button.tsx
│       ├── card.tsx
│       ├── loading-spinner.tsx
│       └── skeleton.tsx
├── lib/
│   ├── hooks/              # Custom React hooks
│   │   ├── use-balance.ts
│   │   ├── use-account.ts
│   │   ├── use-transaction-history.ts
│   │   └── use-send-transaction.ts
│   ├── solana/             # Solana configuration
│   │   └── connection.ts
│   └── utils/              # Utility functions
│       └── format.ts
└── public/                 # Static assets
```

## Key Features Explained

### Optimized Data Fetching

All Solana data fetching is handled through custom hooks with SWR for caching and automatic revalidation:

```typescript
// Example: Fetch balance with caching
const { balance, isLoading, refetch } = useBalance(publicKey, {
  refreshInterval: 30000, // Auto-refresh every 30s
  revalidateOnFocus: true, // Refresh when window gains focus
});
```

### Real-time Balance Updates

The `WalletBalance` component subscribes to account changes via WebSocket for instant balance updates:

```typescript
connection.onAccountChange(publicKey, (accountInfo) => {
  setBalance(lamportsToSol(accountInfo.lamports));
}, 'confirmed');
```

### Transaction Handling

Send transactions with built-in loading states and error handling:

```typescript
const { send, loading, error } = useSendTransaction({
  onSuccess: (signature) => console.log('Success:', signature),
  onError: (error) => console.error('Error:', error),
});

await send(recipientAddress, amount);
```

## Custom Hooks

### `useBalance`

Fetch and cache wallet balance with auto-refresh:

```typescript
const { balance, isLoading, error, refetch } = useBalance(publicKey, {
  refreshInterval: 30000,
  revalidateOnFocus: true,
});
```

### `useAccount`

Fetch account information:

```typescript
const { account, isLoading, error, refetch } = useAccount(publicKey);
```

### `useTransactionHistory`

Fetch recent transactions:

```typescript
const { transactions, isLoading, error, refetch } = useTransactionHistory(publicKey, {
  limit: 10,
  refreshInterval: 60000,
});
```

### `useSendTransaction`

Send SOL with loading states:

```typescript
const { send, loading, error } = useSendTransaction({
  onSuccess: (signature) => {},
  onError: (error) => {},
});
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

- **Next.js 16.1.1** - React framework
- **React 19** - UI library
- **TypeScript 5.9** - Type safety
- **Solana Web3.js** - Solana blockchain interaction
- **Wallet Adapter** - Multi-wallet support
- **SWR** - Data fetching and caching
- **Tailwind CSS 4** - Styling
- **pnpm** - Package manager

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

- [Next.js Documentation](https://nextjs.org/docs)
- [Solana Documentation](https://docs.solana.com)
- [Wallet Adapter Documentation](https://github.com/solana-labs/wallet-adapter)
- [SWR Documentation](https://swr.vercel.app)
