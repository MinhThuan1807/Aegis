"use client";

import { useState, useEffect } from 'react';
import { useWallet } from '@/src/hooks/useWallet';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { toast } from 'sonner';
import {
  supplyAsset,
} from '@/src/lib/aegis-lending';
import { getPoolInfo } from '@/src/lib/aegis-getPoolInfo';
import { SUPPORTED_COINS } from '@/src/lib/aegis-contract';
import { getUserDeposits } from '../lib/aegis-queries';

export function LendingDashboard() {
  const { isConnected, address, submitTransaction } = useWallet();
  const [deposits, setDeposits] = useState<string>("0");
  const [poolInfo, setPoolInfo] = useState<any>(null);
  const [supplyAmount, setSupplyAmount] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (address) {
      loadUserData();
      loadPoolData();
    }
  }, [address]);

  const loadUserData = async () => {
    if (!address) return;
    const userDeposits = await getUserDeposits(
      address,
      SUPPORTED_COINS.CEDRA
    );
    setDeposits(userDeposits);
  };

  const loadPoolData = async () => {
    const info = await getPoolInfo(SUPPORTED_COINS.CEDRA);
    setPoolInfo(info);
  };

  const handleSupply = async () => {
    if (!isConnected || !supplyAmount) {
      toast.error("Please connect wallet and enter amount");
      return;
    }

    setLoading(true);
    try {
      // Convert to smallest unit (8 decimals)
      const amountInSmallestUnit = (
        parseFloat(supplyAmount) * 100_000_000
      ).toString();

      await supplyAsset(
        submitTransaction,
        SUPPORTED_COINS.CEDRA,
        amountInSmallestUnit
      );

      toast.success("Supply successful!");
      setSupplyAmount("");
      await loadUserData();
      await loadPoolData();
    } catch (error: any) {
      toast.error(`Supply failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount: string) => {
    return (parseInt(amount) / 100_000_000).toFixed(2);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Pool Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Supply</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {poolInfo ? formatAmount(poolInfo.totalSupply) : "..."} CEDRA
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Borrowed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {poolInfo ? formatAmount(poolInfo.totalBorrowed) : "..."} CEDRA
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Deposits</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              {formatAmount(deposits)} CEDRA
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Supply Form */}
      <Card>
        <CardHeader>
          <CardTitle>Supply CEDRA</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Amount</label>
            <Input
              type="number"
              placeholder="0.0"
              value={supplyAmount}
              onChange={(e) => setSupplyAmount(e.target.value)}
              disabled={!isConnected || loading}
            />
          </div>

          <Button
            onClick={handleSupply}
            disabled={!isConnected || loading || !supplyAmount}
            className="w-full"
          >
            {loading ? "Processing..." : "Supply"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}