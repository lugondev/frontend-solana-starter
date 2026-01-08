'use client';

import { useRoleManagement, RoleType } from '@/lib/hooks/use-role-management';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWallet } from '@solana/wallet-adapter-react';
import { useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import useSWR from 'swr';

export function RoleManagement() {
  const { publicKey } = useWallet();
  const {
    loading,
    error,
    assignRole,
    checkPermission,
    getRoleInfo,
  } = useRoleManagement();

  const [targetAddress, setTargetAddress] = useState('');
  const [selectedRole, setSelectedRole] = useState<RoleType>(RoleType.User);
  const [permissionLevel, setPermissionLevel] = useState(1);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const { data: roleInfo } = useSWR(
    publicKey ? ['role', publicKey.toBase58()] : null,
    () => publicKey ? getRoleInfo(publicKey) : null,
    { refreshInterval: 5000 }
  );

  if (!publicKey) {
    return (
      <Card title="Role & Permission Management">
        <p className="text-gray-600">Connect your wallet to manage roles</p>
      </Card>
    );
  }

  return (
    <Card title="Role & Permission Management">
      <div className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {roleInfo && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Your Role</h4>
            <div className="space-y-2 text-sm text-blue-800">
              <p>
                <span className="font-semibold">Type:</span>{' '}
                {JSON.stringify(roleInfo.roleType)}
              </p>
              <p>
                <span className="font-semibold">Permissions:</span>{' '}
                {roleInfo.permissions}
              </p>
              <p className="text-xs font-mono break-all">
                {roleInfo.address.toBase58()}
              </p>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <h3 className="font-semibold">Assign Role to User</h3>
          <input
            type="text"
            placeholder="Target Authority Address"
            value={targetAddress}
            onChange={(e) => setTargetAddress(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as RoleType)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value={RoleType.Admin}>Admin</option>
            <option value={RoleType.Moderator}>Moderator</option>
            <option value={RoleType.User}>User</option>
          </select>
          <Button
            onClick={async () => {
              try {
                const result = await assignRole(
                  new PublicKey(targetAddress),
                  selectedRole
                );
                console.log('Role assigned:', result);
              } catch (err) {
                console.error('Assign role failed:', err);
              }
            }}
            loading={loading}
            className="w-full"
          >
            Assign Role (Admin Only)
          </Button>
        </div>

        <div className="pt-4 border-t border-gray-200 space-y-2">
          <h3 className="font-semibold">Check Permission</h3>
          <input
            type="number"
            placeholder="Permission Level (0-255)"
            value={permissionLevel}
            onChange={(e) => setPermissionLevel(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          <Button
            onClick={async () => {
              try {
                const result = await checkPermission(permissionLevel);
                setHasPermission(result);
              } catch (err) {
                console.error('Check permission failed:', err);
                setHasPermission(false);
              }
            }}
            loading={loading}
            variant="secondary"
            className="w-full"
          >
            Check Permission
          </Button>
          {hasPermission !== null && (
            <div
              className={`p-3 rounded-lg ${
                hasPermission
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              <p
                className={`text-sm font-semibold ${
                  hasPermission ? 'text-green-800' : 'text-red-800'
                }`}
              >
                {hasPermission ? '✓ Permission Granted' : '✗ Permission Denied'}
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
