"use client";

import { useState } from 'react';
import { useWallet } from '@/src/hooks/useWallet';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { toast } from 'sonner';
import { borrowAsset } from '@/src/lib/aegis-borrowing';
import { SUPPORTED_COINS } from '@/src/lib/aegis-contract';

export function BorrowingForm() {
  const { isConnected, submitTransaction } = useWallet();
  const [borrowAmount, setBorrowAmount] = useState<string>("");
  const [collateralAmount, setCollateralAmount] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleBorrow = async () => {
    if (!isConnected || !borrowAmount || !collateralAmount) {
      toast.error("Please enter all amounts");
      return;
    }

    setLoading(true);
    try {
      const borrowAmountSmallest = (
        parseFloat(borrowAmount) * 100_000_000
      ).toString();
      const collateralAmountSmallest = (
        parseFloat(collateralAmount) * 100_000_000
      ).toString();

      await borrowAsset(
        submitTransaction,
        SUPPORTED_COINS.CEDRA, // Borrow coin
        SUPPORTED_COINS.CEDRA, // Collateral coin
        borrowAmountSmallest,
        collateralAmountSmallest
      );

      toast.success("Borrow successful!");
      setBorrowAmount("");
      setCollateralAmount("");
    } catch (error: any) {
      toast.error(`Borrow failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Borrow Assets</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Borrow Amount</label>
          <Input
            type="number"
            placeholder="0.0"
            value={borrowAmount}
            onChange={(e) => setBorrowAmount(e.target.value)}
            disabled={!isConnected || loading}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Collateral Amount</label>
          <Input
            type="number"
            placeholder="0.0"
            value={collateralAmount}
            onChange={(e) => setCollateralAmount(e.target.value)}
            disabled={!isConnected || loading}
          />
          <p className="text-xs text-muted-foreground">
            Required: {borrowAmount ? (parseFloat(borrowAmount) * 1.5).toFixed(2) : "0"} CEDRA
          </p>
        </div>

        <Button
          onClick={handleBorrow}
          disabled={!isConnected || loading || !borrowAmount || !collateralAmount}
          className="w-full"
        >
          {loading ? "Processing..." : "Borrow"}
        </Button>
      </CardContent>
    </Card>
  );
}