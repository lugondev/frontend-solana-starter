'use client';

import { useStarterProgram } from '@/lib/hooks/use-starter-program';
import { useCounterProgram } from '@/lib/hooks/use-counter-program';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWallet } from '@solana/wallet-adapter-react';
import { useState } from 'react';

export function CrossProgramDemo() {
  const { publicKey } = useWallet();
  const {
    loading: starterLoading,
    error: starterError,
    incrementCounter,
    addToCounter,
  } = useStarterProgram();
  const { counter, refetch } = useCounterProgram();

  const [addValue, setAddValue] = useState(10);

  if (!publicKey) {
    return (
      <Card title="Cross-Program Invocation (CPI)">
        <p className="text-gray-600">Connect your wallet to try CPI patterns</p>
      </Card>
    );
  }

  if (!counter) {
    return (
      <Card title="Cross-Program Invocation (CPI)">
        <p className="text-gray-600">
          Initialize your counter first in the Counter section above
        </p>
      </Card>
    );
  }

  return (
    <Card title="Cross-Program Invocation (CPI)">
      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">What is CPI?</h3>
          <p className="text-sm text-blue-800">
            Cross-Program Invocation allows one program (starter_program) to call
            instructions on another program (counter_program). This demonstrates
            how Solana programs can compose and interact with each other.
          </p>
        </div>

        {starterError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm">{starterError}</p>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Current Counter Value</p>
              <p className="text-3xl font-bold text-blue-600">{counter.count}</p>
            </div>
            <Button
              onClick={() => refetch()}
              variant="secondary"
              size="sm"
            >
              Refresh
            </Button>
          </div>

          <div>
            <h4 className="font-semibold mb-3">CPI Pattern #1: Simple Increment</h4>
            <p className="text-sm text-gray-600 mb-3">
              starter_program calls counter_program.increment() via CPI
            </p>
            <Button
              onClick={async () => {
                try {
                  await incrementCounter();
                  await refetch();
                } catch (err) {
                  console.error('CPI increment failed:', err);
                }
              }}
              loading={starterLoading}
              className="w-full"
            >
              CPI: Increment +1
            </Button>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <h4 className="font-semibold mb-3">CPI Pattern #2: With Parameters</h4>
            <p className="text-sm text-gray-600 mb-3">
              starter_program calls counter_program.add(value) with custom amount
            </p>
            <div className="flex gap-2">
              <input
                type="number"
                value={addValue}
                onChange={(e) => setAddValue(Number(e.target.value))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Value to add"
              />
              <Button
                onClick={async () => {
                  try {
                    await addToCounter(addValue);
                    await refetch();
                  } catch (err) {
                    console.error('CPI add failed:', err);
                  }
                }}
                loading={starterLoading}
              >
                CPI: Add +{addValue}
              </Button>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 bg-green-50 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-2">Benefits of CPI</h4>
            <ul className="space-y-1 text-sm text-green-800">
              <li>✓ Program composability - build on existing programs</li>
              <li>✓ Code reusability - don't duplicate logic</li>
              <li>✓ Atomic transactions - all succeed or all fail</li>
              <li>✓ Secure delegation - maintain access control</li>
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
}
