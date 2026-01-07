'use client';

import { CounterDisplay } from '@/components/features/counter/counter-display';
import { UserAccount } from '@/components/features/starter/user-account';
import { CrossProgramDemo } from '@/components/features/starter/cross-program-demo';

export default function ProgramsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Solana Programs Demo</h1>
        <p className="text-gray-600">
          Interact with starter_program and counter_program on Solana
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <UserAccount />
        <CounterDisplay />
      </div>

      <div className="mb-6">
        <CrossProgramDemo />
      </div>

      <div className="p-6 bg-blue-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-3">About These Programs</h2>
        <div className="space-y-2 text-sm text-gray-700">
          <p>
            <strong>User Account (starter_program):</strong> Demonstrates PDA
            (Program Derived Address) patterns for user account management.
            Create, update, and close your on-chain user account.
          </p>
          <p>
            <strong>Counter Program (counter_program):</strong> A simple counter
            with increment, decrement, add, and reset operations. Shows basic
            state management and cross-program invocation patterns.
          </p>
          <p>
            <strong>Cross-Program Invocation:</strong> Demonstrates how
            starter_program can call counter_program instructions via CPI,
            enabling program composability on Solana.
          </p>
        </div>
      </div>
    </div>
  );
}
