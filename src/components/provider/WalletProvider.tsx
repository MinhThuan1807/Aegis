"use client";

import {  PropsWithChildren } from "react";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { PetraWallet } from "petra-plugin-wallet-adapter";
import { Network } from "@aptos-labs/ts-sdk";




const NETWORK = process.env.NEXT_PUBLIC_APTOS_NETWORK || "testnet";

export const WalletProvider = ({ children }: PropsWithChildren) => {
  return (
    <AptosWalletAdapterProvider
      autoConnect={true}
      optInWallets={["Petra"]}
      dappConfig={{
        network: (NETWORK === "mainnet" ? Network.MAINNET : Network.TESTNET) as Network,
        aptosConnectDappId: process.env.NEXT_PUBLIC_DAPP_ID || "cedra-dapp",
      }}
      onError={(error) => {
        console.error("Wallet error:", error);
      }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
};