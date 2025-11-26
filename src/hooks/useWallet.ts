"use client";

import { useCallback, useEffect } from "react";
import { useWallet as useAptosWallet } from "@aptos-labs/wallet-adapter-react";
import { useStore } from "@/src/store/useStore";
import { Cedra, CedraConfig, Network } from "@cedra-labs/ts-sdk";
import { toast } from "sonner";
import { getCedraBalance, CEDRA_CONTRACTS, CoinType } from "../lib/cedraTransaction";

const STORAGE_KEY = "cedra_wallet_connected";

// Initialize Cedra client
const getCedraClient = () => {
  const network = process.env.NEXT_PUBLIC_CEDRA_NETWORK === "mainnet"
    ? Network.MAINNET
    : Network.TESTNET;
  
  const config = new CedraConfig({ network });
  return new Cedra(config);
};

export function useWallet() {
  const {
    account,
    connected,
    disconnect: aptosDisconnect,
    wallet,
    wallets,
    signAndSubmitTransaction,
    signMessage,
    connect: aptosConnect,
  } = useAptosWallet();

  const { setWallet, disconnectWallet } = useStore();
  const cedraClient = getCedraClient();

  // Connect wallet
  const connect = useCallback(
    async (walletName?: string): Promise<boolean> => {
      try {
        if (connected) {
          toast.info("Wallet already connected");
          return true;
        }

        if (walletName) {
          await aptosConnect(walletName);
        }

        const network = process.env.NEXT_PUBLIC_CEDRA_NETWORK || "testnet";
        toast.success(`Connected to Cedra ${network}`, { 
          id: "wallet-connect" 
        });
        return true;
      } catch (error) {
        console.error("Failed to connect wallet:", error);
        toast.error("Failed to connect wallet", { id: "wallet-connect" });
        return false;
      }
    },
    [connected, aptosConnect]
  );

  // Disconnect wallet
  const disconnect = useCallback(async () => {
    try {
      await aptosDisconnect();
      disconnectWallet();

      if (typeof window !== "undefined") {
        localStorage.removeItem(STORAGE_KEY);
      }

      toast.success("Wallet disconnected");
    } catch (error) {
      console.error("Failed to disconnect:", error);
      toast.error("Failed to disconnect wallet");
    }
  }, [aptosDisconnect, disconnectWallet]);

  // Format address for display - FIX: Add type check
  const formatAddress = useCallback((address: string | null | undefined) => {
    if (!address || typeof address !== "string") {
      return "";
    }
    if (address.length < 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, []);

  // Get balance
  const getBalance = useCallback(async (): Promise<string> => {
    if (!account?.address) return "0";

    try {
      const balance = await cedraClient.getAccountCoinAmount({
        accountAddress: account.address.toString(),
        coinType: "0x1::cedra_coin::CedraCoin", // Native Cedra coin
      });
      
      // Convert from sub-units to CEDRA (1 CEDRA = 100,000,000 sub-units)
      return (Number(balance) / 100_000_000).toFixed(4);
    } catch (error) {
      console.error("Failed to get balance:", error);
      return "0";
    }
  }, [account, cedraClient]);

  // Copy address to clipboard
  const copyAddress = useCallback(async () => {
    if (!account?.address) return;

    try {
      await navigator.clipboard.writeText(String(account.address));
      toast.success("Address copied to clipboard");
    } catch (error) {
      console.error("Copy failed:", error);
      toast.error("Failed to copy address");
    }
  }, [account]);
  // Get token balance
  const getTokenBalance = useCallback(
    async (tokenAddress: CoinType ): Promise<bigint> => {
      if (!account?.address) return BigInt(0);

      try {
        const balance = await cedraClient.getAccountCoinAmount({
          accountAddress: account.address.toString(),
          coinType: tokenAddress,
        });
        return BigInt(balance);
      } catch (error) {
        console.error("Failed to get token balance:", error);
        return BigInt(0);
      }
    },
    [account, cedraClient]
  );

  // Sign and submit transaction
  const submitTransaction = useCallback(
    async (payload: any) => {
      if (!connected || !account) {
        toast.error("Please connect wallet first");
        return null;
      }

      try {
        const response = await signAndSubmitTransaction({
          sender: String(account?.address || ""),
          data: payload,
        });

        return response;
      } catch (error) {
        console.error("Transaction failed:", error);
        toast.error("Transaction failed");
        throw error;
      }
    },
    [connected, account, signAndSubmitTransaction]
  );

  // Wait for transaction confirmation
  const waitForTransaction = useCallback(
    async (txHash: string) => {
      try {
        const result = await cedraClient.waitForTransaction({
          transactionHash: txHash,
        });
        return result;
      } catch (error) {
        console.error("Failed to wait for transaction:", error);
        throw error;
      }
    },
    [cedraClient]
  );

  // Update store when wallet state changes
  useEffect(() => {
    if (connected && account?.address) {
      const network = process.env.NEXT_PUBLIC_CEDRA_NETWORK || "testnet";
      setWallet({
         address: String(account.address),
        isConnected: true,
        chainId: network === "mainnet" ? "1" : "4",
      });

      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, "true");
      }
    }
  }, [connected, account, setWallet]);

  return {
     // Wallet info
    address: account?.address ? String(account.address) : null,
    isConnected: connected,
    wallet,
    wallets: wallets || [],
    
    // Actions
    connect,
    disconnect,
    formatAddress,
    copyAddress,
    
    // Balance
    getBalance,
    getTokenBalance,
    
    // Transactions
    submitTransaction,
    waitForTransaction,
    signMessage,
    
    // Cedra client
    cedraClient,
  };
}