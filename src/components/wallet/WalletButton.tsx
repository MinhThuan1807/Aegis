"use client";
import { useWallet } from "@/src/components/provider/WalletProvider";
import { useState, useEffect } from "react";
import type { AdapterWallet } from "@cedra-labs/wallet-adapter-core";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Card, CardContent } from "@/src/components/ui/card";
import { Wallet, ExternalLink, X } from "lucide-react";

export default function WalletButton() {
  const walletCore = useWallet();
  const [isConnected, setIsConnected] = useState(false);
  const [accountAddress, setAccountAddress] = useState<string | null>(null);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [availableWallets, setAvailableWallets] = useState<AdapterWallet[]>([]);

  // Thêm useEffect để check connection state khi component mount
  useEffect(() => {
    const initWalletState = () => {
      const connected = walletCore.isConnected();
      const address = walletCore.account?.address.toString() || null;

      setIsConnected(connected);
      setAccountAddress(address);

      console.log("Wallet state initialized:", { connected, address });
    };

    const updateWalletState = () => {
      const connected = walletCore.isConnected();
      const address = walletCore.account?.address.toString() || null;

      setIsConnected(connected);
      setAccountAddress(address);

      console.log("Wallet state updated:", { connected, address });
    };

    const updateAvailableWallets = () => {
      const wallets = walletCore.wallets as AdapterWallet[];
      setAvailableWallets(wallets);
      console.log("Available wallets:", wallets.length);
    };

    // Khởi tạo state ngay khi component mount
    initWalletState();
    updateAvailableWallets();

    // Đăng ký listeners
    walletCore.on("connect", updateWalletState);
    walletCore.on("disconnect", updateWalletState);
    walletCore.on("accountChange", updateWalletState);
    walletCore.on("standardWalletsAdded", updateAvailableWallets);

    // Cleanup
    return () => {
      walletCore.off("connect", updateWalletState);
      walletCore.off("disconnect", updateWalletState);
      walletCore.off("accountChange", updateWalletState);
      walletCore.off("standardWalletsAdded", updateAvailableWallets);
    };
  }, [walletCore]); // Thêm walletCore vào dependencies

  const handleConnectWallet = async (walletName: string) => {
    try {
      console.log(`Connecting to ${walletName}...`);
      await walletCore.connect(walletName);
      setShowWalletModal(false);
      console.log("Connected successfully!");
    } catch (error) {
      console.error("Connect error:", error);
      alert(
        `Failed to connect: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const handleDisconnect = async () => {
    try {
      await walletCore.disconnect();
      console.log("Disconnected successfully!");
    } catch (error) {
      console.error("Disconnect error:", error);
    }
  };

  const handleOpenModal = () => {
    if (availableWallets.length === 0) {
      alert(
        "No wallets detected. Please install a wallet extension (Petra, Nightly, Zedra, etc.)"
      );
      return;
    }
    setShowWalletModal(true);
  };

  return (
    <div>
      {/* Connect/Disconnect Button */}
      {isConnected && accountAddress ? (
        <Button onClick={handleDisconnect} variant="outline" className="gap-2">
          <Wallet className="w-4 h-4" />
          {accountAddress.slice(0, 6)}...{accountAddress.slice(-4)}
        </Button>
      ) : (
        <Button onClick={handleOpenModal} className="gap-2">
          <Wallet className="w-4 h-4" />
          Connect Wallet
        </Button>
      )}

      {/* Wallet Selection Dialog */}
      <Dialog open={showWalletModal} onOpenChange={setShowWalletModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              Select Wallet
            </DialogTitle>
            <DialogDescription>
              Choose a wallet to connect to your account
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Available Wallets */}
            {availableWallets.length > 0 ? (
              <div className="space-y-2">
                {availableWallets.map((wallet) => (
                  <Card
                    key={wallet.name}
                    className="cursor-pointer transition-all hover:shadow-md hover:border-primary"
                    onClick={() => handleConnectWallet(wallet.name)}
                  >
                    <CardContent className="flex items-center gap-4 p-4">
                      {wallet.icon && (
                        <div className="flex-shrink-0">
                          <img
                            src={wallet.icon}
                            alt={wallet.name}
                            className="w-10 h-10 rounded-lg"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-base">{wallet.name}</p>
                        {wallet.readyState && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {wallet.readyState}
                          </p>
                        )}
                      </div>
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <Wallet className="w-12 h-12 text-muted-foreground mb-4" />
                  <p className="font-medium text-muted-foreground">
                    No wallets detected
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Please install Petra, Nightly, or Zedra wallet
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Not Detected Wallets */}
            {walletCore.notDetectedWallets.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-px bg-border flex-1" />
                  <p className="text-sm font-medium text-muted-foreground">
                    Available to Install
                  </p>
                  <div className="h-px bg-border flex-1" />
                </div>

                <div className="space-y-2">
                  {walletCore.notDetectedWallets.map((wallet) => (
                    <Card
                      key={wallet.name}
                      className="cursor-pointer transition-all hover:shadow-md hover:border-primary"
                    >
                      <a
                        href={wallet.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <CardContent className="flex items-center gap-4 p-4">
                          {wallet.icon && (
                            <div className="flex-shrink-0">
                              <img
                                src={wallet.icon}
                                alt={wallet.name}
                                className="w-10 h-10 rounded-lg opacity-50"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-base">
                              {wallet.name}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Not installed
                            </p>
                          </div>
                          <div className="flex-shrink-0">
                            <ExternalLink className="w-4 h-4 text-primary" />
                          </div>
                        </CardContent>
                      </a>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
