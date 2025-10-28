"use client";

import { useCallback } from "react";
import { useWallet } from "@/src/hooks/useWallet";
import {
  buildSupplyPayload,
  buildBorrowPayload,
  buildWithdrawPayload,
  buildRepayPayload,
} from "@/src/lib/cedraTransaction";
import { toast } from "sonner";

export const useCedraTransactions = () => {
  const { submitTransaction, isConnected } = useWallet();

  const supply = useCallback(
    async (tokenAddress: string, amount: bigint) => {
      if (!isConnected) {
        toast.error("Please connect wallet first");
        throw new Error("Wallet not connected");
      }

      try {
        const payload = buildSupplyPayload(tokenAddress, amount);
        const response = await submitTransaction(payload);
        toast.success("Supply successful");
        return response;
      } catch (error) {
        console.error("Supply failed:", error);
        toast.error("Supply failed");
        throw error;
      }
    },
    [isConnected, submitTransaction]
  );

  const borrow = useCallback(
    async (tokenAddress: string, amount: bigint) => {
      if (!isConnected) {
        toast.error("Please connect wallet first");
        throw new Error("Wallet not connected");
      }

      try {
        const payload = buildBorrowPayload(tokenAddress, amount);
        const response = await submitTransaction(payload);
        toast.success("Borrow successful");
        return response;
      } catch (error) {
        console.error("Borrow failed:", error);
        toast.error("Borrow failed");
        throw error;
      }
    },
    [isConnected, submitTransaction]
  );

  const withdraw = useCallback(
    async (tokenAddress: string, amount: bigint) => {
      if (!isConnected) {
        toast.error("Please connect wallet first");
        throw new Error("Wallet not connected");
      }

      try {
        const payload = buildWithdrawPayload(tokenAddress, amount);
        const response = await submitTransaction(payload);
        toast.success("Withdraw successful");
        return response;
      } catch (error) {
        console.error("Withdraw failed:", error);
        toast.error("Withdraw failed");
        throw error;
      }
    },
    [isConnected, submitTransaction]
  );

  const repay = useCallback(
    async (tokenAddress: string, amount: bigint) => {
      if (!isConnected) {
        toast.error("Please connect wallet first");
        throw new Error("Wallet not connected");
      }

      try {
        const payload = buildRepayPayload(tokenAddress, amount);
        const response = await submitTransaction(payload);
        toast.success("Repay successful");
        return response;
      } catch (error) {
        console.error("Repay failed:", error);
        toast.error("Repay failed");
        throw error;
      }
    },
    [isConnected, submitTransaction]
  );

  return {
    supply,
    borrow,
    withdraw,
    repay,
    isConnected,
  };
};