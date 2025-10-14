// src/store/useStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MarketData, UserPosition, Transaction } from '@/src/types';

interface WalletState {
  address: string | null;
  isConnected: boolean;
  chainId: string | null;
}

interface AppState {
  // Wallet
  wallet: WalletState;
  setWallet: (wallet: Partial<WalletState>) => void;
  disconnectWallet: () => void;

  // Markets
  markets: MarketData[];
  setMarkets: (markets: MarketData[]) => void;
  selectedMarket: string | null;
  setSelectedMarket: (symbol: string) => void;

  // User
  userPosition: UserPosition | null;
  setUserPosition: (position: UserPosition) => void;
  
  // Transactions
  transactions: Transaction[];
  addTransaction: (tx: Transaction) => void;
  updateTransaction: (hash: string, updates: Partial<Transaction>) => void;

  // UI State
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;

  // Theme
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial Wallet State
      wallet: {
        address: null,
        isConnected: false,
        chainId: null,
      },
      setWallet: (wallet) =>
        set((state) => ({
          wallet: { ...state.wallet, ...wallet },
        })),
      disconnectWallet: () =>
        set({
          wallet: { address: null, isConnected: false, chainId: null },
          userPosition: null,
          transactions: [],
        }),

      // Markets
      markets: [],
      setMarkets: (markets) => set({ markets }),
      selectedMarket: null,
      setSelectedMarket: (symbol) => set({ selectedMarket: symbol }),

      // User
      userPosition: null,
      setUserPosition: (position) => set({ userPosition: position }),

      // Transactions
      transactions: [],
      addTransaction: (tx) =>
        set((state) => ({
          transactions: [tx, ...state.transactions],
        })),
      updateTransaction: (hash, updates) =>
        set((state) => ({
          transactions: state.transactions.map((tx) =>
            tx.hash === hash ? { ...tx, ...updates } : tx
          ),
        })),

      // UI State
      isLoading: false,
      setIsLoading: (loading) => set({ isLoading: loading }),
      error: null,
      setError: (error) => set({ error }),

      // Theme
      theme: 'system',
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'aegis-storage',
      partialize: (state) => ({
        wallet: state.wallet,
        theme: state.theme,
        transactions: state.transactions.slice(0, 50), // Only persist last 50 txs
      }),
    }
  )
);