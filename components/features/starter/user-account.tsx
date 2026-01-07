'use client';

import { useStarterProgram } from '@/lib/hooks/use-starter-program';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWallet } from '@solana/wallet-adapter-react';
import { useState } from 'react';
import useSWR from 'swr';
import { PDAHelper, STARTER_PROGRAM_ID } from '@/lib/anchor/program';

export function UserAccount() {
  const { publicKey } = useWallet();
  const {
    program,
    loading,
    error,
    createUserAccount,
    updateUserAccount,
    closeUserAccount,
  } = useStarterProgram();

  const [points, setPoints] = useState(100);
  const [isEditing, setIsEditing] = useState(false);

  const { data: userData, mutate } = useSWR(
    publicKey ? ['user', publicKey.toBase58()] : null,
    async () => {
      if (!program || !publicKey) return null;

      const [userPda] = await PDAHelper.getUserPDA(
        publicKey,
        STARTER_PROGRAM_ID
      );

      try {
        const account = await program.account.userAccount.fetch(userPda);
        return {
          pda: userPda,
          points: account.points.toNumber(),
          authority: account.authority,
          createdAt: account.createdAt.toNumber(),
          updatedAt: account.updatedAt.toNumber(),
        };
      } catch (err) {
        return null;
      }
    },
    { refreshInterval: 5000 }
  );

  if (!publicKey) {
    return (
      <Card title="User Account">
        <p className="text-gray-600">Connect your wallet to manage your account</p>
      </Card>
    );
  }

  if (!userData) {
    return (
      <Card title="User Account">
        <div className="space-y-4">
          <p className="text-gray-600">No user account found</p>
          <div className="space-y-2">
            <Button
              onClick={async () => {
                try {
                  const result = await createUserAccount();
                  console.log('User created:', result);
                  await mutate();
                } catch (err) {
                  console.error('Error creating user:', err);
                }
              }}
              loading={loading}
              className="w-full"
            >
              Create Account
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card title="User Account">
      <div className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-600 mb-1">Points</p>
            {isEditing ? (
              <input
                type="number"
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-3xl font-bold text-blue-600">{userData.points}</p>
            )}
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-1">Account PDA</p>
            <p className="text-xs font-mono bg-gray-100 p-2 rounded break-all">
              {userData.pda.toBase58()}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
            <div>
              <p className="font-semibold">Created</p>
              <p>{new Date(userData.createdAt * 1000).toLocaleString()}</p>
            </div>
            <div>
              <p className="font-semibold">Updated</p>
              <p>{new Date(userData.updatedAt * 1000).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {isEditing ? (
          <div className="flex gap-2">
            <Button
              onClick={async () => {
                try {
                  await updateUserAccount(points);
                  setIsEditing(false);
                  await mutate();
                } catch (err) {
                  console.error('Error updating user:', err);
                }
              }}
              loading={loading}
              className="flex-1"
            >
              Save Points
            </Button>
            <Button
              onClick={() => {
                setIsEditing(false);
                setPoints(userData.points);
              }}
              variant="secondary"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button
              onClick={() => {
                setPoints(userData.points);
                setIsEditing(true);
              }}
              variant="primary"
              className="flex-1"
            >
              Update Points
            </Button>
            <Button
              onClick={async () => {
                if (
                  !confirm(
                    'Are you sure you want to close this account? This action cannot be undone.'
                  )
                ) {
                  return;
                }
                try {
                  await closeUserAccount();
                  await mutate();
                } catch (err) {
                  console.error('Error closing user:', err);
                }
              }}
              loading={loading}
              variant="secondary"
              className="flex-1"
            >
              Close Account
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
