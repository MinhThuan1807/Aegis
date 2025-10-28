"use client";

import { useState } from "react";
import { useWallet } from "@/src/hooks/useWallet";
import { Button } from "@/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/src/components/ui/dropdown-menu";
import { Wallet, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";

export function WalletButton() {
  const {
    address,
    isConnected,
    disconnect,
    formatAddress,
    copyAddress,
    connect,
    wallets,
    wallet: currentWallet,
  } = useWallet();

  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  const handleWalletSelect = async (walletName: string) => {
    try {
      await connect(walletName);
      setIsWalletModalOpen(false);
    } catch (error) {
      console.error("Failed to connect:", error);
    }
  };

  // Get wallet icon URL
  const getWalletIcon = (walletName: string) => {
    const wallet = wallets?.find(w => w.name === walletName);
    return wallet?.icon || null;
  };

  if (!isConnected) {
    return (
      <>
        <Button
          onClick={() => setIsWalletModalOpen(true)}
          className="gap-2"
        >
          <Wallet className="h-4 w-4" />
        </Button>

        <Dialog open={isWalletModalOpen} onOpenChange={setIsWalletModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Select a Wallet</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              {wallets?.map((wallet) => {
                const isSelected = currentWallet?.name === wallet.name;
                return (
                  <Button
                    key={wallet.name}
                    onClick={() => handleWalletSelect(wallet.name)}
                    variant={isSelected ? "default" : "outline"}
                    className="w-full h-auto py-4 px-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      {wallet.icon && (
                        <img
                          src={wallet.icon}
                          alt={wallet.name}
                          className="h-8 w-8"
                        />
                      )}
                      <div className="text-left">
                        <div className="font-semibold">{wallet.name}</div>
                      </div>
                    </div>
                    {isSelected && <Check className="h-5 w-5" />}
                  </Button>
                );
              })}
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  const displayAddress = address ? formatAddress(address) : "Unknown";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Wallet className="h-4 w-4" />
          {displayAddress}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5">
          <div className="flex items-center gap-2">
            {currentWallet?.icon && (
              <img
                src={currentWallet.icon}
                alt={currentWallet.name}
                className="h-6 w-6"
              />
            )}
            <div>
              <div className="font-semibold text-sm">{currentWallet?.name}</div>
              <div className="text-xs text-muted-foreground">{displayAddress}</div>
            </div>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={copyAddress}>
          Copy Address
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={disconnect} className="text-red-600">
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}