"use client";

import { useCallback, useEffect } from "react";
import { useWallet as useAptosWallet } from "@aptos-labs/wallet-adapter-react";
import { useStore } from "@/src/store/useStore";
import { toast } from "sonner";
import { getCedraBalance, CEDRA_CONTRACTS } from "../lib/cedraTransaction";

const STORAGE_KEY = "cedra_wallet_connected";

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

        // toast.success("Wallet connected successfully", { id: "wallet-connect" });
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
      const balance = await getCedraBalance(String(account.address), CEDRA_CONTRACTS.USDC_TOKEN);
      return (Number(balance) / 1e8).toFixed(4);
    } catch (error) {
      console.error("Failed to get balance:", error);
      return "0";
    }
  }, [account]);

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

  // Update store when wallet state changes
  useEffect(() => {
    if (connected && account?.address) {
      setWallet({
        address: String(account.address),
        isConnected: true,
        chainId: "cedra-testnet",
      });

      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, "true");
      }
    }
  }, [connected, account, setWallet]);

  return {
    address: account?.address ? String(account.address) : null,
    isConnected: connected,
    wallet,
    wallets: wallets || [],
    connect,
    disconnect,
    formatAddress,
    getBalance,
    copyAddress,
    submitTransaction,
    signMessage,
  };
}