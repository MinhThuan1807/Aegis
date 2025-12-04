"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@/src/components/provider/WalletProvider";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Loader2 } from "lucide-react";
import { buildSupplyTransaction } from "@/src/lib/transaction";

export default function SupplyForm() {
  const walletCore = useWallet();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // Theo dõi trạng thái kết nối
  useEffect(() => {
    if (!walletCore) return;

    const checkConnection = () => {
      setIsConnected(!!walletCore.account);
    };

    // Kiểm tra ban đầu
    checkConnection();

    // Lắng nghe sự kiện
    walletCore.on("connect", checkConnection);
    walletCore.on("disconnect", checkConnection);
    walletCore.on("accountChange", checkConnection);

    return () => {
      walletCore.off("connect", checkConnection);
      walletCore.off("disconnect", checkConnection);
      walletCore.off("accountChange", checkConnection);
    };
  }, [walletCore]);

  const handleSupply = async () => {
    try {
      // Validate wallet
      if (!walletCore || !walletCore.signAndSubmitTransaction) {
        alert("Wallet not ready. Please refresh the page.");
        return;
      }

      if (!walletCore.account) {
        alert("Please connect your wallet first");
        return;
      }

      if (!amount || parseFloat(amount) <= 0) {
        alert("Please enter a valid amount");
        return;
      }

      setLoading(true);

      const transactionPayload = buildSupplyTransaction(amount);

      console.log(
        "📤 Transaction payload:",
        JSON.stringify(transactionPayload, null, 2)
      );

      // Validate transaction structure
      if (!transactionPayload?.function) {
        throw new Error("Invalid transaction structure");
      }

      console.log("🔐 Requesting signature from wallet...");

      const transaction = {
        data: transactionPayload
      };

      const response = await walletCore.signAndSubmitTransaction(transaction);

      console.log("✅ Transaction response:", response);

      alert(`Supply successful! Hash: ${response.hash}`);
      setAmount("");
    } catch (error: any) {
      console.error("❌ Supply error:", error);

      let errorMsg = "Transaction failed";

      if (error?.message) {
        errorMsg = error.message;
      } else if (error?.toString) {
        errorMsg = error.toString();
      }

      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!walletCore) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Loading wallet...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Supply CEDRA</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isConnected && (
          <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-md text-sm">
            Please connect your wallet first
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium">Amount (CEDRA)</label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            disabled={!isConnected || loading}
            step="0.01"
            min="0"
          />
          <p className="text-xs text-muted-foreground">
            Enter amount in CEDRA (e.g., 1 or 0.5)
          </p>
        </div>

        <Button
          onClick={handleSupply}
          disabled={!isConnected || !amount || loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Supplying...
            </>
          ) : (
            "Supply"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
