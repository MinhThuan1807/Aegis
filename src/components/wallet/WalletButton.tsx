import { Button } from '@/src/components/ui/button';
import { useWallet } from '@/src/hooks/useWallet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu';
import { Wallet, LogOut, RefreshCw } from 'lucide-react';

export function WalletButton() {
  const { address, isConnected, connect, disconnect, switchWallet, formatAddress } = useWallet();

  if (!isConnected) {
    return (
      <Button onClick={connect} className="gap-2">
        <Wallet className="h-4 w-4" />
        Connect Wallet
      </Button>
    );
  }

  return (
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
          <p className="text-xs text-muted-foreground">{address}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={switchWallet}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Switch Wallet
        </DropdownMenuItem>
        <DropdownMenuItem onClick={disconnect} className="text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}