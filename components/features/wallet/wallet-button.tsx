'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useEffect, useState } from 'react';
import { formatAddress } from '@/lib/utils/format';

export function WalletButton() {
  const { publicKey, connected } = useWallet();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-10 w-32 animate-pulse rounded-lg bg-gray-700" />
    );
  }

  if (connected && publicKey) {
    return (
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-xs text-gray-400">Connected</span>
          <span className="text-sm font-medium">
            {formatAddress(publicKey.toString())}
          </span>
        </div>
        <WalletMultiButton />
      </div>
    );
  }

  return <WalletMultiButton />;
}
