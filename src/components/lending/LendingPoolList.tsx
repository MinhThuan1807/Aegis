"use client";
import { useState, useEffect } from "react";
import { useWallet } from "@/src/components/provider/WalletProvider";
import { Card, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { Input } from "@/src/components/ui/input";
import { Copy, X, TrendingUp, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  POOL_ADDRESS_RAW,
  CEDRA_COIN_TYPE,
  buildSupplyTransaction,
  buildWithdrawTransaction,
  buildBorrowTransaction,
  buildRepayTransaction,
  fromSmallestUnit,
  toSmallestUnit,
} from "@/src/lib/transaction";

interface PoolData {
  address: string;
  name: string;
  curator: string;
  totalSupplied: string;
  totalBorrowed: string;
  apr: string;
  available: string;
  // Pool parameters from contract
  depositLimit: string;
  borrowLimit: string;
  borrowFee: string;
  maxLTV: string;
  liquidationThreshold: string;
  liquidationBonus: string;
  optimalUtilization: string;
  optimalInterestRate: string;
  maxInterestRate: string;
  flashLoanFee: string;
}

export default function LendingPoolList() {
  const walletCore = useWallet();
  const [selectedPool, setSelectedPool] = useState<PoolData | null>(null);
  const [amount, setAmount] = useState("");
  const [sliderValue, setSliderValue] = useState([0]);
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [userBalance, setUserBalance] = useState("0");
  const [userPosition, setUserPosition] = useState({
    supplied: "0",
    borrowed: "0",
    ratio: "0",
  });

  // Pool data - hardcoded for now, should fetch from contract
  const POOL_DATA: PoolData = {
    address: POOL_ADDRESS_RAW,
    name: "Cedra",
    curator: "AEGIS",
    totalSupplied: "$0", // Will be fetched
    totalBorrowed: "$0", // Will be fetched
    apr: "5%", // Default from contract
    available: "$0",
    depositLimit: "200,000,000 CEDRA",
    borrowLimit: "100,000,000 CEDRA",
    borrowFee: "0.1%",
    maxLTV: "80%",
    liquidationThreshold: "85%",
    liquidationBonus: "5%",
    optimalUtilization: "80%",
    optimalInterestRate: "10%",
    maxInterestRate: "250%",
    flashLoanFee: "0.3%",
  };

  // Check wallet connection
  useEffect(() => {
    if (!walletCore) return;

    const checkConnection = () => {
      const connected = walletCore.isConnected();
      setIsConnected(connected);
    };

    checkConnection();

    walletCore.on("connect", checkConnection);
    walletCore.on("disconnect", checkConnection);
    walletCore.on("accountChange", checkConnection);

    return () => {
      walletCore.off("connect", checkConnection);
      walletCore.off("disconnect", checkConnection);
      walletCore.off("accountChange", checkConnection);
    };
  }, [walletCore]);

  const handlePoolClick = (pool: PoolData) => {
    setSelectedPool(pool);
  };

  const handleClose = () => {
    setSelectedPool(null);
    setAmount("");
    setSliderValue([0]);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Address copied to clipboard!");
  };

  const handleSupply = async () => {
    if (!walletCore || !amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    const toastId = toast.loading("Preparing transaction...");

    try {
      setLoading(true);
      const transaction = buildSupplyTransaction(amount);

      toast.loading("Waiting for wallet confirmation...", { id: toastId });

      const response = await walletCore.signAndSubmitTransaction({
        data: transaction,
      });

      toast.success(
        <div className="flex flex-col gap-1">
          <p className="font-semibold">Supply successful!</p>
          <p className="text-xs text-muted-foreground">
            Hash: {response.hash.slice(0, 10)}...{response.hash.slice(-8)}
          </p>
        </div>,
        { id: toastId, duration: 5000 }
      );

      setAmount("");
      handleClose();
    } catch (error: any) {
      console.error("Supply error:", error);
      toast.error(
        <div className="flex flex-col gap-1">
          <p className="font-semibold">Failed to supply</p>
          <p className="text-xs">{error.message || "Unknown error"}</p>
        </div>,
        { id: toastId }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!walletCore || !amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    const toastId = toast.loading("Preparing transaction...");

    try {
      setLoading(true);
      const transaction = buildWithdrawTransaction(amount);

      toast.loading("Waiting for wallet confirmation...", { id: toastId });

      const response = await walletCore.signAndSubmitTransaction({
        data: transaction,
      });

      toast.success(
        <div className="flex flex-col gap-1">
          <p className="font-semibold">Withdraw successful!</p>
          <p className="text-xs text-muted-foreground">
            Hash: {response.hash.slice(0, 10)}...{response.hash.slice(-8)}
          </p>
        </div>,
        { id: toastId, duration: 5000 }
      );

      setAmount("");
      handleClose();
    } catch (error: any) {
      console.error("Withdraw error:", error);
      toast.error(
        <div className="flex flex-col gap-1">
          <p className="font-semibold">Failed to withdraw</p>
          <p className="text-xs">{error.message || "Unknown error"}</p>
        </div>,
        { id: toastId }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBorrow = async () => {
    if (!walletCore || !amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    const toastId = toast.loading("Preparing transaction...");

    try {
      setLoading(true);
      const transaction = buildBorrowTransaction(amount);

      toast.loading("Waiting for wallet confirmation...", { id: toastId });

      const response = await walletCore.signAndSubmitTransaction({
        data: transaction,
      });

      toast.success(
        <div className="flex flex-col gap-1">
          <p className="font-semibold">Borrow successful!</p>
          <p className="text-xs text-muted-foreground">
            Hash: {response.hash.slice(0, 10)}...{response.hash.slice(-8)}
          </p>
        </div>,
        { id: toastId, duration: 5000 }
      );

      setAmount("");
      handleClose();
    } catch (error: any) {
      console.error("Borrow error:", error);
      toast.error(
        <div className="flex flex-col gap-1">
          <p className="font-semibold">Failed to borrow</p>
          <p className="text-xs">{error.message || "Unknown error"}</p>
        </div>,
        { id: toastId }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRepay = async () => {
    if (!walletCore || !amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    const toastId = toast.loading("Preparing transaction...");

    try {
      setLoading(true);
      const transaction = buildRepayTransaction(amount);

      toast.loading("Waiting for wallet confirmation...", { id: toastId });

      const response = await walletCore.signAndSubmitTransaction({
        data: transaction,
      });

      toast.success(
        <div className="flex flex-col gap-1">
          <p className="font-semibold">Repay successful!</p>
          <p className="text-xs text-muted-foreground">
            Hash: {response.hash.slice(0, 10)}...{response.hash.slice(-8)}
          </p>
        </div>,
        { id: toastId, duration: 5000 }
      );

      setAmount("");
      handleClose();
    } catch (error: any) {
      console.error("Repay error:", error);
      toast.error(
        <div className="flex flex-col gap-1">
          <p className="font-semibold">Failed to repay</p>
          <p className="text-xs">{error.message || "Unknown error"}</p>
        </div>,
        { id: toastId }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Earn</h1>
        <p className="text-muted-foreground">
          Deposit assets in a lending pool to earn interest and other yield.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Total supplied</p>
            <p className="text-3xl font-bold">{POOL_DATA.totalSupplied}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Total borrowed</p>
            <p className="text-3xl font-bold">{POOL_DATA.totalBorrowed}</p>
          </CardContent>
        </Card>
      </div>

      {/* Pool List */}
      <Card>
        <CardContent className="p-0">
          <div className="grid grid-cols-5 gap-4 p-4 border-b text-sm text-muted-foreground">
            <div>Asset & Pool</div>
            <div>Curator</div>
            <div>Total supplied</div>
            <div>APR</div>
            <div>Actions</div>
          </div>

          <div
            onClick={() => handlePoolClick(POOL_DATA)}
            className="grid grid-cols-5 gap-4 p-4 hover:bg-accent cursor-pointer transition-colors items-center"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-lg font-bold">C</span>
              </div>
              <div>
                <p className="font-semibold">{POOL_DATA.name}</p>
                <p className="text-sm text-muted-foreground">
                  {POOL_DATA.curator}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center">
                <span className="text-xs font-bold">A</span>
              </div>
              <span>{POOL_DATA.curator}</span>
            </div>
            <div className="font-semibold">{POOL_DATA.totalSupplied}</div>
            <div className="flex items-center gap-1 text-green-500 font-semibold">
              {POOL_DATA.apr}
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <Button size="sm">Manage</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pool Details Dialog */}
      <Dialog open={!!selectedPool} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-lg font-bold">C</span>
                </div>
                <DialogTitle>{selectedPool?.name}</DialogTitle>
              </div>
              <Button variant="ghost" size="icon" onClick={handleClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>

          <Tabs defaultValue="deposit" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="deposit">Deposit</TabsTrigger>
              <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
              <TabsTrigger value="borrow">Borrow</TabsTrigger>
              <TabsTrigger value="repay">Repay</TabsTrigger>
            </TabsList>

            {/* Deposit Tab */}
            <TabsContent value="deposit" className="space-y-6">
              {!isConnected && (
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-md text-sm">
                  Please connect your wallet first
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between bg-accent/50 p-4 rounded-lg">
                  <Input
                    type="number"
                    placeholder="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="text-2xl font-bold border-0 bg-transparent focus-visible:ring-0"
                    disabled={!isConnected || loading}
                  />
                  <span className="font-semibold">CEDRA</span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Wallet</span>
                    <span className="font-semibold">{userBalance} CEDRA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">APR</span>
                    <span className="font-semibold text-green-500">
                      {selectedPool?.apr}
                    </span>
                  </div>
                </div>

                <Button
                  className="w-full"
                  disabled={!isConnected || !amount || loading}
                  onClick={handleSupply}
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
              </div>

              {/* Pool Details */}
              <div className="space-y-3 text-sm border-t pt-4">
                <h3 className="font-semibold mb-3">Pool Information</h3>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pool Address</span>
                  <button
                    onClick={() => copyToClipboard(selectedPool?.address || "")}
                    className="flex items-center gap-1 text-primary hover:underline text-xs"
                  >
                    {selectedPool?.address.slice(0, 10)}...
                    {selectedPool?.address.slice(-8)}
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Maximum LTV</span>
                  <span className="font-semibold">{selectedPool?.maxLTV}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Liquidation Threshold
                  </span>
                  <span className="font-semibold">
                    {selectedPool?.liquidationThreshold}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Liquidation Bonus
                  </span>
                  <span className="font-semibold">
                    {selectedPool?.liquidationBonus}
                  </span>
                </div>
              </div>
            </TabsContent>

            {/* Withdraw Tab */}
            <TabsContent value="withdraw" className="space-y-6">
              {!isConnected && (
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-md text-sm">
                  Please connect your wallet first
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between bg-accent/50 p-4 rounded-lg">
                  <Input
                    type="number"
                    placeholder="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="text-2xl font-bold border-0 bg-transparent focus-visible:ring-0"
                    disabled={!isConnected || loading}
                  />
                  <span className="font-semibold">CEDRA</span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Supplied</span>
                    <span className="font-semibold">
                      {userPosition.supplied} CEDRA
                    </span>
                  </div>
                </div>

                <Button
                  className="w-full"
                  disabled={!isConnected || !amount || loading}
                  onClick={handleWithdraw}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Withdrawing...
                    </>
                  ) : (
                    "Withdraw"
                  )}
                </Button>
              </div>
            </TabsContent>

            {/* Borrow Tab */}
            <TabsContent value="borrow" className="space-y-6">
              {!isConnected && (
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-md text-sm">
                  Please connect your wallet first
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between bg-accent/50 p-4 rounded-lg">
                  <Input
                    type="number"
                    placeholder="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="text-2xl font-bold border-0 bg-transparent focus-visible:ring-0"
                    disabled={!isConnected || loading}
                  />
                  <span className="font-semibold">CEDRA</span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Collateral Ratio
                    </span>
                    <span className="font-semibold">{userPosition.ratio}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Min Required</span>
                    <span className="font-semibold">150%</span>
                  </div>
                </div>

                <Button
                  className="w-full"
                  disabled={!isConnected || !amount || loading}
                  onClick={handleBorrow}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Borrowing...
                    </>
                  ) : (
                    "Borrow"
                  )}
                </Button>
              </div>
            </TabsContent>

            {/* Repay Tab */}
            <TabsContent value="repay" className="space-y-6">
              {!isConnected && (
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-md text-sm">
                  Please connect your wallet first
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between bg-accent/50 p-4 rounded-lg">
                  <Input
                    type="number"
                    placeholder="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="text-2xl font-bold border-0 bg-transparent focus-visible:ring-0"
                    disabled={!isConnected || loading}
                  />
                  <span className="font-semibold">CEDRA</span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Borrowed</span>
                    <span className="font-semibold">
                      {userPosition.borrowed} CEDRA
                    </span>
                  </div>
                </div>

                <Button
                  className="w-full"
                  disabled={!isConnected || !amount || loading}
                  onClick={handleRepay}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Repaying...
                    </>
                  ) : (
                    "Repay"
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
