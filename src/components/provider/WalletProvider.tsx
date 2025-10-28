"use client";

import { PropsWithChildren } from "react";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { Network } from "@aptos-labs/ts-sdk";

export const WalletProvider = ({ children }: PropsWithChildren) => {

  return (
    <AptosWalletAdapterProvider
      autoConnect={true}
      optInWallets={["Petra", "Nightly"]}
      dappConfig={{
        network: process.env.NEXT_PUBLIC_APTOS_NETWORK === "mainnet" 
          ? Network.MAINNET 
          : Network.TESTNET,
        aptosConnectDappId: process.env.NEXT_PUBLIC_DAPP_ID,
      }}
      onError={(error) => {
        console.error("Wallet error:", error);
      }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
};