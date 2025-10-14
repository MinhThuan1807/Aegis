export interface Token {
  symbol: string;
  name: string;
  address?: string; // fill after
  decimals: number;
  icon: string;
  balance: number;
  price: number;
  color: string;
}

export interface MarketData {
  tokenAddress: string;
  symbol: string;
  totalSupply: bigint;
  totalBorrow: bigint;
  supplyAPY: number;
  borrowAPR: number;
  utilizationRate: number;
  collateralFactor: number;
  liquidationThreshold: number;
}

export interface UserPosition {
  totalSupplied: bigint;
  totalBorrowed: bigint;
  healthFactor: number;
  availableToBorrow: bigint;
  netAPY: number;
}

export interface Transaction {
  hash: string;
  type: 'supply' | 'borrow' | 'withdraw' | 'repay' | 'swap';
  token: string;
  amount: bigint;
  timestamp: number;
  status: 'pending' | 'success' | 'failed';
}