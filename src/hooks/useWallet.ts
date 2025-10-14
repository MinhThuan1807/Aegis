import { useCallback, useEffect } from 'react';
import { useStore } from '@/src/store/useStore';
import { toast } from 'sonner';

// Mock wallet addresses for testing
const MOCK_WALLETS = [
  {
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    name: 'Test Wallet 1',
  },
  {
    address: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
    name: 'Test Wallet 2',
  },
  {
    address: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
    name: 'Test Wallet 3',
  },
];

export function useWallet() {
  const { wallet, setWallet, disconnectWallet } = useStore();

  // Simulate wallet connection
  const connect = useCallback(async () => {
    try {
      toast.loading('Connecting wallet...', { id: 'wallet' });
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Randomly select a mock wallet
      const mockWallet = MOCK_WALLETS[Math.floor(Math.random() * MOCK_WALLETS.length)];
      
      setWallet({
        address: mockWallet.address,
        isConnected: true,
        chainId: 'cedra-testnet', // Mock chain ID
      });
      
      toast.success(`Connected to ${mockWallet.name}`, { id: 'wallet' });
      
      // Store in localStorage for persistence
      if (typeof window !== 'undefined') {
        localStorage.setItem('mock_wallet_address', mockWallet.address);
      }
    } catch (error) {
      toast.error('Failed to connect wallet', { id: 'wallet' });
      throw error;
    }
  }, [setWallet]);

  // Simulate wallet disconnection
  const disconnect = useCallback(() => {
    disconnectWallet();
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mock_wallet_address');
    }
    
    toast.success('Wallet disconnected');
  }, [disconnectWallet]);

  // Auto-reconnect on page load if wallet was connected before
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedAddress = localStorage.getItem('mock_wallet_address');
      
      if (savedAddress && !wallet.isConnected) {
        setWallet({
          address: savedAddress,
          isConnected: true,
          chainId: 'cedra-testnet',
        });
      }
    }
  }, [setWallet, wallet.isConnected]);

  // Simulate switching wallet
  const switchWallet = useCallback(async () => {
    if (!wallet.isConnected) {
      toast.error('No wallet connected');
      return;
    }
    
    try {
      toast.loading('Switching wallet...', { id: 'switch' });
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get current wallet index and switch to next
      const currentIndex = MOCK_WALLETS.findIndex(w => w.address === wallet.address);
      const nextIndex = (currentIndex + 1) % MOCK_WALLETS.length;
      const nextWallet = MOCK_WALLETS[nextIndex];
      
      setWallet({
        address: nextWallet.address,
      });
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('mock_wallet_address', nextWallet.address);
      }
      
      toast.success(`Switched to ${nextWallet.name}`, { id: 'switch' });
    } catch (error) {
      toast.error('Failed to switch wallet', { id: 'switch' });
    }
  }, [wallet, setWallet]);

  // Format address for display
  const formatAddress = useCallback((address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, []);

  // Get balance (mock)
  const getBalance = useCallback(async (tokenSymbol: string) => {
    if (!wallet.address) return '0';
    
    // Mock balances
    const balances: Record<string, string> = {
      ETH: '25.5',
      USDC: '50000',
      USDT: '75000',
      WBTC: '1.25',
    };
    
    return balances[tokenSymbol] || '0';
  }, [wallet.address]);

  return {
    address: wallet.address,
    isConnected: wallet.isConnected,
    chainId: wallet.chainId,
    connect,
    disconnect,
    switchWallet,
    formatAddress,
    getBalance,
  };
}
