'use client';

import { useCounterProgram } from '@/lib/hooks/use-counter-program';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useWallet } from '@solana/wallet-adapter-react';
import { useState } from 'react';

export function CounterDisplay() {
  const { publicKey } = useWallet();
  const {
    counter,
    loading,
    error,
    initialize,
    increment,
    decrement,
    add,
    reset,
    refetch,
  } = useCounterProgram();

  const [addValue, setAddValue] = useState(5);

  if (!publicKey) {
    return (
      <Card title="Counter Program">
        <p className="text-gray-600">Connect your wallet to use the counter</p>
      </Card>
    );
  }

  if (!counter) {
    return (
      <Card title="Counter Program">
        <div className="space-y-4">
          <p className="text-gray-600">Counter not initialized yet</p>
          <Button
            onClick={async () => {
              try {
                const result = await initialize();
                console.log('Counter initialized:', result);
              } catch (err) {
                console.error('Error initializing counter:', err);
              }
            }}
            loading={loading}
          >
            Initialize Counter
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Counter Program">
      <div className="space-y-6">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Current Count</p>
            <p className="text-6xl font-bold text-blue-600">{counter.count}</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={async () => {
              try {
                await increment();
              } catch (err) {
                console.error('Error incrementing:', err);
              }
            }}
            loading={loading}
            variant="primary"
          >
            +1 Increment
          </Button>

          <Button
            onClick={async () => {
              try {
                await decrement();
              } catch (err) {
                console.error('Error decrementing:', err);
              }
            }}
            loading={loading}
            variant="secondary"
          >
            -1 Decrement
          </Button>
        </div>

        <div className="space-y-2">
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
                  await add(addValue);
                } catch (err) {
                  console.error('Error adding to counter:', err);
                }
              }}
              loading={loading}
            >
              Add {addValue}
            </Button>
          </div>
        </div>

        <div className="flex gap-2 pt-2 border-t border-gray-200">
          <Button
            onClick={async () => {
              try {
                await reset();
              } catch (err) {
                console.error('Error resetting counter:', err);
              }
            }}
            loading={loading}
            variant="secondary"
            className="flex-1"
          >
            Reset to 0
          </Button>

          <Button
            onClick={() => refetch()}
            variant="secondary"
            className="flex-1"
          >
            Refresh
          </Button>
        </div>

        <div className="text-xs text-gray-500 space-y-1 pt-2 border-t border-gray-200">
          <p>Counter PDA: {counter.pda.toBase58().slice(0, 8)}...</p>
          <p>Authority: {counter.authority.toBase58().slice(0, 8)}...</p>
        </div>
      </div>
    </Card>
  );
}
