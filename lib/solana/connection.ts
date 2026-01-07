import { Connection, clusterApiUrl, Cluster } from "@solana/web3.js";

const NETWORK = (process.env.NEXT_PUBLIC_SOLANA_NETWORK as Cluster) || "devnet";
const RPC_HOST = process.env.NEXT_PUBLIC_SOLANA_RPC_HOST || clusterApiUrl(NETWORK);

export const SOLANA_NETWORK = NETWORK;
export const SOLANA_RPC_HOST = RPC_HOST;

let connection: Connection | null = null;

export function getConnection(): Connection {
  if (!connection) {
    connection = new Connection(RPC_HOST, {
      commitment: "confirmed",
      wsEndpoint: RPC_HOST.replace("https://", "wss://").replace("http://", "ws://"),
    });
  }
  return connection;
}

export function createOptimizedConnection(customRpc?: string): Connection {
  return new Connection(customRpc || RPC_HOST, {
    commitment: "confirmed",
    confirmTransactionInitialTimeout: 60000,
  });
}
