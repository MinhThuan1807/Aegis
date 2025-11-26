"use client";

import { PropsWithChildren } from "react";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { Network } from "@cedra-labs/ts-sdk";

export const WalletProvider = ({ children }: PropsWithChildren) => {
  const network = process.env.NEXT_PUBLIC_CEDRA_NETWORK === "mainnet" 
    ? Network.MAINNET 
    : Network.TESTNET;
  return (
    <AptosWalletAdapterProvider
      autoConnect={true}
      optInWallets={["Petra", "Nightly"]}
      dappConfig={{
       network: network,
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