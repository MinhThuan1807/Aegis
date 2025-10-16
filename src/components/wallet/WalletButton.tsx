import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { useWallet } from "@/src/hooks/useWallet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Wallet, LogOut, RefreshCw, Copy, Info } from "lucide-react";

export function WalletButton() {
  const {
    address,
    isConnected,
    connect,
    disconnect,
    formatAddress,
    copyAddress,
    isValidCedraAddress,
  } = useWallet();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [inputAddress, setInputAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    setIsLoading(true);
    const success = await connect(inputAddress);
    setIsLoading(false);

    if (success) {
      setIsDialogOpen(false);
      setInputAddress("");
    }
  };

  const handleSwitchWallet = () => {
    setInputAddress("");
    setIsDialogOpen(true);
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setInputAddress("");
  };

  // Check if address is valid for button enable/disable
  const isValidInput = inputAddress && isValidCedraAddress(inputAddress);

  if (!isConnected) {
    return (
      <>
        <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
          <Wallet className="h-4 w-4" />
          Connect Wallet
        </Button>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Connect Cedra Wallet</DialogTitle>
              <DialogDescription>
                Enter your Cedra testnet wallet address to connect
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="address">Wallet Address</Label>
                <Input
                  id="address"
                  placeholder="0x1234567890abcdef..."
                  value={inputAddress}
                  onChange={(e) => setInputAddress(e.target.value)}
                  className="font-mono text-sm"
                />
                {inputAddress && !isValidCedraAddress(inputAddress) && (
                  <p className="text-xs text-red-500">
                    Invalid address format. Must start with 0x followed by 40
                    hex characters.
                  </p>
                )}
              </div>

              <div className="flex items-start gap-2 rounded-lg bg-blue-50 p-3 text-sm text-blue-900 dark:bg-blue-950 dark:text-blue-100">
                <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="font-medium">Need a Cedra testnet address?</p>
                  <p className="text-xs opacity-90">
                    Visit the Cedra testnet faucet to create a wallet and get
                    test tokens.
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConnect}
                disabled={!isValidInput || isLoading}
              >
                {isLoading ? "Connecting..." : "Connect"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Wallet className="h-4 w-4" />
            {formatAddress(address!)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-1.5">
            <p className="text-sm font-medium">Connected Wallet</p>
            <p className="text-xs text-muted-foreground font-mono break-all mt-1">
              {address}
            </p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={copyAddress}>
            <Copy className="mr-2 h-4 w-4" />
            Copy Address
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSwitchWallet}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Switch Wallet
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDisconnect} className="text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Switch Wallet</DialogTitle>
            <DialogDescription>
              Enter a different Cedra testnet wallet address
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="switch-address">New Wallet Address</Label>
              <Input
                id="switch-address"
                placeholder="0x1234567890abcdef..."
                value={inputAddress}
                onChange={(e) => setInputAddress(e.target.value)}
                className="font-mono text-sm"
              />
              {inputAddress && !isValidCedraAddress(inputAddress) && (
                <p className="text-xs text-red-500">
                  Invalid address format. Must start with 0x followed by 40 hex
                  characters.
                </p>
              )}
            </div>

            <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-950 dark:text-amber-100">
              <p className="font-medium mb-1">Current wallet</p>
              <p className="text-xs font-mono break-all opacity-90">
                {address}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConnect}
              disabled={!isValidInput || isLoading}
            >
              {isLoading ? "Switching..." : "Switch Wallet"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
