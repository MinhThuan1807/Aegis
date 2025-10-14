import { Token, MarketData, UserPosition, Transaction } from "@/src/types";

class MockDataService {
  private delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Simulate API call with delay
  async getMarkets(): Promise<MarketData[]> {
    await this.delay(500); // Simulate network delay
    
    return [
      {
        tokenAddress: '0x...', // Placeholder
        symbol: 'USDC',
        totalSupply: BigInt('12500000000000'), // 12.5M with 6 decimals
        totalBorrow: BigInt('8750000000000'),
        supplyAPY: 6.875,
        borrowAPR: 5.51,
        utilizationRate: 70,
        collateralFactor: 0.75,
        liquidationThreshold: 0.80
      },
      {
        tokenAddress: '0x...',
        symbol: 'ETH',
        totalSupply: BigInt('5000000000000000000000'), // 5000 ETH
        totalBorrow: BigInt('2500000000000000000000'),
        supplyAPY: 4.25,
        borrowAPR: 6.50,
        utilizationRate: 50,
        collateralFactor: 0.80,
        liquidationThreshold: 0.85
      }
    ];
  }

  async getUserPosition(address: string): Promise<UserPosition> {
    await this.delay(300);
    
    return {
      totalSupplied: BigInt('100000000000'), // $100k
      totalBorrowed: BigInt('50000000000'), // $50k
      healthFactor: 2.5,
      availableToBorrow: BigInt('25000000000'),
      netAPY: 3.45
    };
  }

  async getTokenBalance(address: string, tokenSymbol: string): Promise<bigint> {
    await this.delay(200);
    
    const balances: Record<string, bigint> = {
      'USDC': BigInt('50000000000'), // 50k USDC
      'ETH': BigInt('25500000000000000000'), // 25.5 ETH
      'USDT': BigInt('75000000000') // 75k USDT
    };
    
    return balances[tokenSymbol] || BigInt(0);
  }

  async getTransactionHistory(address: string): Promise<Transaction[]> {
    await this.delay(400);
    
    return [
      {
        hash: '0xabc123...',
        type: 'supply',
        token: 'USDC',
        amount: BigInt('10000000000'),
        timestamp: Date.now() - 86400000, // 1 day ago
        status: 'success'
      },
      {
        hash: '0xdef456...',
        type: 'borrow',
        token: 'ETH',
        amount: BigInt('5000000000000000000'),
        timestamp: Date.now() - 172800000, // 2 days ago
        status: 'success'
      }
    ];
  }

  // Simulate blockchain transaction
  async supplyToken(
    tokenSymbol: string, 
    amount: bigint
  ): Promise<{ hash: string; status: 'pending' | 'success' | 'failed' }> {
    await this.delay(1000); // Simulate tx confirmation time
    
    // 90% success rate for testing
    const success = Math.random() > 0.1;
    
    return {
      hash: `0x${Math.random().toString(16).slice(2, 66)}`,
      status: success ? 'success' : 'failed'
    };
  }

  async borrowToken(
    tokenSymbol: string, 
    amount: bigint
  ): Promise<{ hash: string; status: 'pending' | 'success' | 'failed' }> {
    await this.delay(1000);
    
    const success = Math.random() > 0.1;
    
    return {
      hash: `0x${Math.random().toString(16).slice(2, 66)}`,
      status: success ? 'success' : 'failed'
    };
  }

  async withdrawToken(
    tokenSymbol: string, 
    amount: bigint
  ): Promise<{ hash: string; status: 'pending' | 'success' | 'failed' }> {
    await this.delay(1000);
    
    const success = Math.random() > 0.1;
    
    return {
      hash: `0x${Math.random().toString(16).slice(2, 66)}`,
      status: success ? 'success' : 'failed'
    };
  }

  async repayToken(
    tokenSymbol: string, 
    amount: bigint
  ): Promise<{ hash: string; status: 'pending' | 'success' | 'failed' }> {
    await this.delay(1000);
    
    const success = Math.random() > 0.1;
    
    return {
      hash: `0x${Math.random().toString(16).slice(2, 66)}`,
      status: success ? 'success' : 'failed'
    };
  }

  // Swap simulation
  async getSwapQuote(
    fromToken: string,
    toToken: string,
    amount: bigint
  ): Promise<{ rate: number; priceImpact: number; estimatedOutput: bigint }> {
    await this.delay(300);
    
    // Simple mock calculation
    const mockRate = 1.0 + (Math.random() - 0.5) * 0.01; // ±0.5% variance
    const priceImpact = Number(amount) / 1e18 * 0.001; // 0.1% per 1 ETH
    
    return {
      rate: mockRate,
      priceImpact,
      estimatedOutput: BigInt(Math.floor(Number(amount) * mockRate))
    };
  }

  async executeSwap(
    fromToken: string,
    toToken: string,
    amount: bigint,
    minOutput: bigint
  ): Promise<{ hash: string; status: 'pending' | 'success' | 'failed' }> {
    await this.delay(1500);
    
    const success = Math.random() > 0.1;
    
    return {
      hash: `0x${Math.random().toString(16).slice(2, 66)}`,
      status: success ? 'success' : 'failed'
    };
  }

  // Helper: Format bigint to readable string
  formatAmount(amount: bigint, decimals: number = 18): string {
    const value = Number(amount) / Math.pow(10, decimals);
    return value.toLocaleString('en-US', { maximumFractionDigits: 6 });
  }

  // Helper: Parse string to bigint
  parseAmount(amount: string, decimals: number = 18): bigint {
    const value = parseFloat(amount) * Math.pow(10, decimals);
    return BigInt(Math.floor(value));
  }
}

export const mockDataService = new MockDataService();