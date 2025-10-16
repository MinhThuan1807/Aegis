import { useCallback, useEffect } from "react";
import { useStore } from "@/src/store/useStore";
import { toast } from "sonner";

const STORAGE_KEY = "cedra_wallet_address";

// Validate Cedra address format (64 hex characters after 0x)
const isValidCedraAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{64}$/.test(address);
};

export function useWallet() {
  const { wallet, setWallet, disconnectWallet } = useStore();

  // Connect wallet with manual address input
  const connect = useCallback(
    async (address: string): Promise<boolean> => {
      try {
        const trimmedAddress = address.trim();

        if (!trimmedAddress) {
          toast.error("Please enter a wallet address");
          return false;
        }

        if (!isValidCedraAddress(trimmedAddress)) {
          toast.error("Invalid Cedra address format", {
            description:
              "Address must start with 0x followed by 64 hexadecimal characters",
          });
          return false;
        }

        toast.loading("Connecting wallet...", { id: "wallet-connect" });

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        setWallet({
          address: trimmedAddress,
          isConnected: true,
          chainId: "cedra-testnet",
        });

        // Save to localStorage for persistence
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY, trimmedAddress);
        }

        toast.success("Wallet connected successfully", {
          id: "wallet-connect",
        });
        return true;
      } catch (error) {
        console.error("Failed to connect wallet:", error);
        toast.error("Failed to connect wallet", { id: "wallet-connect" });
        return false;
      }
    },
    [setWallet]
  );

  // Disconnect wallet
  const disconnect = useCallback(() => {
    disconnectWallet();

    // Remove from localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }

    toast.success("Wallet disconnected");
  }, [disconnectWallet]);

  // Format address for display (show more characters for longer Cedra addresses)
  const formatAddress = useCallback((address: string) => {
    if (!address) return "";
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  }, []);

  // Get balance from Cedra testnet
  const getBalance = useCallback(async (): Promise<string> => {
    if (!wallet.address) return "0";

    try {
      // Call Cedra testnet API to get balance
      // Note: You may need to adjust the API endpoint based on Cedra's actual API
      const response = await fetch(`https://rpc.testnet.cedra.network`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "eth_getBalance",
          params: [wallet.address, "latest"],
          id: 1,
        }),
      });

      const data = await response.json();

      if (data.result) {
        // Convert from wei to CED (assuming 18 decimals like Ethereum)
        const balanceInWei = BigInt(data.result);
        const balanceInCED = Number(balanceInWei) / 1e18;
        return balanceInCED.toFixed(4);
      }

      return "0.00";
    } catch (error) {
      console.error("Failed to get balance:", error);
      return "0";
    }
  }, [wallet.address]);

  // Copy address to clipboard
  const copyAddress = useCallback(async () => {
    if (!wallet.address) return;

    try {
      await navigator.clipboard.writeText(wallet.address);
      toast.success("Address copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy address");
    }
  }, [wallet.address]);

  // Auto-reconnect on page load if wallet was connected before
  useEffect(() => {
    if (typeof window === "undefined" || wallet.isConnected) return;

    const savedAddress = localStorage.getItem(STORAGE_KEY);

    if (savedAddress && isValidCedraAddress(savedAddress)) {
      setWallet({
        address: savedAddress,
        isConnected: true,
        chainId: "cedra-testnet",
      });
    }
  }, [wallet.isConnected, setWallet]);

  return {
    address: wallet.address,
    isConnected: wallet.isConnected,
    chainId: wallet.chainId,
    connect,
    disconnect,
    formatAddress,
    getBalance,
    copyAddress,
    isValidCedraAddress,
  };
}
