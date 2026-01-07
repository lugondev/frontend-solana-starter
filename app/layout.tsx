import type { Metadata } from "next";
import { WalletProvider } from "@/components/features/wallet/wallet-provider";
import "./globals.css";
import "./wallet-adapter.css";

export const metadata: Metadata = {
  title: "Solana Web3 Starter",
  description: "A Next.js starter with Solana Web3.js integration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}
