'use client';

import { CounterDisplay } from '@/components/features/counter/counter-display';
import { UserAccount } from '@/components/features/starter/user-account';
import { CrossProgramDemo } from '@/components/features/starter/cross-program-demo';
import { TreasuryManagement } from '@/components/features/starter/treasury-management';
import { TokenOperations } from '@/components/features/starter/token-operations';
import { RoleManagement } from '@/components/features/starter/role-management';
import { NFTMarketplace } from '@/components/features/starter/nft-marketplace';
import { NFTCollection } from '@/components/features/starter/nft-collection';
import { Governance } from '@/components/features/starter/governance';

export default function ProgramsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Solana Programs Demo</h1>
        <p className="text-gray-600">
          Interact with all starter_program features and counter_program
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Core Features</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <UserAccount />
          <CounterDisplay />
        </div>
        <div className="mb-6">
          <CrossProgramDemo />
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Treasury & Token Management</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TreasuryManagement />
          <TokenOperations />
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Role Management</h2>
        <div className="grid grid-cols-1 gap-6">
          <RoleManagement />
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">NFT Features</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <NFTCollection />
          <NFTMarketplace />
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Governance System</h2>
        <div className="grid grid-cols-1 gap-6">
          <Governance />
        </div>
      </div>

      <div className="p-6 bg-blue-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-3">About Starter Program</h2>
        <div className="space-y-2 text-sm text-gray-700">
          <p>
            <strong>User Account:</strong> PDA-based user account management with
            create, update, and close operations.
          </p>
          <p>
            <strong>Treasury:</strong> Deposit SOL to program treasury and emergency
            withdraw (admin only).
          </p>
          <p>
            <strong>Token Operations:</strong> Create mints, transfer tokens, burn tokens, 
            approve delegates, freeze accounts, and manage SPL tokens.
          </p>
          <p>
            <strong>Role Management:</strong> Assign roles (Admin, Moderator, User)
            and check permissions for access control.
          </p>
          <p>
            <strong>NFT Collection:</strong> Create NFT collections with metadata, royalties, 
            and mint NFTs with creator attribution.
          </p>
          <p>
            <strong>NFT Marketplace:</strong> List NFTs for sale, buy NFTs, create offers, 
            accept offers, and cancel listings with escrow-based secure trading.
          </p>
          <p>
            <strong>Governance:</strong> On-chain governance with proposal creation, voting, 
            execution, and upgrade authority management for program upgrades.
          </p>
          <p>
            <strong>Cross-Program Invocation:</strong> starter_program can call
            counter_program instructions via CPI for program composability.
          </p>
        </div>
      </div>
    </div>
  );
}
