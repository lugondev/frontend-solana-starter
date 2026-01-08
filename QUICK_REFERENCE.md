# Quick Reference - Starter Program Hooks

## Import Hooks

```typescript
import {
  useTreasury,
  useTokenOperations,
  useRoleManagement,
  RoleType,
  useNFTMarketplace,
  useStarterProgram,
} from '@/lib/hooks';
```

## 1. Treasury Management

```typescript
const { loading, error, depositToTreasury, emergencyWithdraw, getTreasuryInfo } = useTreasury();

const handleDeposit = async () => {
  const lamports = 0.1 * LAMPORTS_PER_SOL;
  const result = await depositToTreasury(lamports);
  console.log('Deposited:', result.signature);
};

const handleWithdraw = async () => {
  await emergencyWithdraw(destinationPubkey);
};

const treasuryInfo = await getTreasuryInfo();
console.log('Balance:', treasuryInfo.balance);
```

## 2. Token Operations

```typescript
const {
  loading,
  error,
  createMint,
  burnTokens,
  approveDelegate,
  freezeAccount,
  closeTokenAccount,
} = useTokenOperations();

const handleCreateMint = async () => {
  const result = await createMint();
  console.log('Mint address:', result.mint.toBase58());
};

const handleBurn = async () => {
  await burnTokens(tokenAccountPubkey, mintPubkey, 100);
};

const handleApprove = async () => {
  await approveDelegate(tokenAccountPubkey, delegatePubkey, 100);
};

const handleFreeze = async () => {
  await freezeAccount(tokenAccountPubkey, mintPubkey);
};

const handleClose = async () => {
  await closeTokenAccount(tokenAccountPubkey, destinationPubkey);
};
```

## 3. Role Management

```typescript
const { loading, error, assignRole, checkPermission, getRoleInfo } = useRoleManagement();

const handleAssignRole = async () => {
  const result = await assignRole(
    targetAuthorityPubkey,
    RoleType.Moderator
  );
  console.log('Role assigned:', result.signature);
};

const hasPermission = await checkPermission(1);
console.log('Has permission:', hasPermission);

const roleInfo = await getRoleInfo(authorityPubkey);
console.log('Role type:', roleInfo.roleType);
console.log('Permissions:', roleInfo.permissions);
```

## 4. NFT Marketplace

```typescript
const { loading, error, createOffer, acceptOffer, cancelListing } = useNFTMarketplace();

const handleCreateOffer = async () => {
  const lamports = 1 * LAMPORTS_PER_SOL;
  const expiresAt = Math.floor(Date.now() / 1000) + 86400 * 7;
  const result = await createOffer(
    nftMintPubkey,
    lamports,
    null,
    expiresAt
  );
  console.log('Offer created:', result.signature);
};

const handleAcceptOffer = async () => {
  await acceptOffer(nftMintPubkey, buyerPubkey);
};

const handleCancelListing = async () => {
  await cancelListing(nftMintPubkey);
};
```

## 5. User Account (Starter Program)

```typescript
const {
  loading,
  error,
  createUserAccount,
  updateUserAccount,
  closeUserAccount,
  incrementCounter,
  addToCounter,
} = useStarterProgram();

const handleCreate = async () => {
  const result = await createUserAccount();
  console.log('User PDA:', result.userPda.toBase58());
};

const handleUpdate = async () => {
  await updateUserAccount(100);
};

const handleClose = async () => {
  await closeUserAccount();
};

const handleIncrement = async () => {
  await incrementCounter();
};

const handleAdd = async () => {
  await addToCounter(10);
};
```

## Common Patterns

### With SWR for Auto-refresh

```typescript
import useSWR from 'swr';

const { data: treasuryInfo, mutate } = useSWR(
  publicKey ? 'treasury' : null,
  getTreasuryInfo,
  { refreshInterval: 5000 }
);

const handleDeposit = async () => {
  await depositToTreasury(lamports);
  await mutate();
};
```

### With Loading States

```typescript
<Button
  onClick={handleDeposit}
  loading={loading}
  disabled={!publicKey}
>
  Deposit
</Button>
```

### With Error Display

```typescript
{error && (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
    <p className="text-red-800 text-sm">{error}</p>
  </div>
)}
```

### With Try-Catch

```typescript
const handleOperation = async () => {
  try {
    await someOperation();
    console.log('Success');
  } catch (err) {
    console.error('Failed:', err);
  }
};
```

## PDA Derivation Reference

```typescript
import { PublicKey } from '@solana/web3.js';
import { STARTER_PROGRAM_ID } from '@/lib/anchor/program';

const [treasuryPda] = PublicKey.findProgramAddressSync(
  [Buffer.from('treasury')],
  STARTER_PROGRAM_ID
);

const [userPda] = PublicKey.findProgramAddressSync(
  [Buffer.from('user_account'), authority.toBuffer()],
  STARTER_PROGRAM_ID
);

const [rolePda] = PublicKey.findProgramAddressSync(
  [Buffer.from('role'), authority.toBuffer()],
  STARTER_PROGRAM_ID
);

const [mintPda] = PublicKey.findProgramAddressSync(
  [Buffer.from('mint')],
  STARTER_PROGRAM_ID
);

const [offerPda] = PublicKey.findProgramAddressSync(
  [Buffer.from('nft_offer'), nftMint.toBuffer(), buyer.toBuffer()],
  STARTER_PROGRAM_ID
);
```

## Error Handling

```typescript
import { parseProgramError } from '@/lib/anchor/program';

try {
  await operation();
} catch (err: any) {
  const errorMsg = parseProgramError(err);
  setError(errorMsg);
  throw new Error(errorMsg);
}
```

## TypeScript Types

```typescript
import { PublicKey } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';

type DepositParams = {
  amount: number;
};

type RoleInfo = {
  address: PublicKey;
  authority: PublicKey;
  roleType: any;
  permissions: number;
  assignedAt: number;
};
```
