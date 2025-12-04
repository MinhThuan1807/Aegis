"use client";
import { WalletCore } from "@cedra-labs/wallet-adapter-core";
import { Network } from "@cedra-labs/ts-sdk";
import { ReactNode, createContext, useContext } from "react";

const dappConfig = {
  network: Network.TESTNET,
};

// Để undefined hoặc empty array để hỗ trợ TẤT CẢ wallets
// Hoặc chỉ định các wallets cụ thể
const optInWallets = undefined; // Hỗ trợ tất cả

// Nếu muốn chỉ định cụ thể:
// const optInWallets = ["Petra", "Nightly", "Zedra", "T wallet", "Pontem Wallet"];

const walletCore = new WalletCore(optInWallets, dappConfig, false);

const WalletContext = createContext<WalletCore | null>(null);

interface WalletProviderProps {
  children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  return (
    <WalletContext.Provider value={walletCore}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within WalletProvider");
  }
  return context;
}
