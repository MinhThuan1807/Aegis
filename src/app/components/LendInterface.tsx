"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { InfoIcon, TrendingUp, Coins, DollarSign, PiggyBank } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface TokenOption {
  symbol: string;
  name: string;
  icon: string;
  balance: number;
  price: number;
  color: string;
}

interface PoolData {
  name: string;
  totalSupply: number;
  totalBorrow: number;
  supplyApy: number;
  borrowApr: number;
  liquidationThreshold: number;
  utilizationRate: number;
  availableLiquidity: number;
}

const tokens: TokenOption[] = [
  {
    symbol: 'USDC',
    name: 'USD Coin',
    icon: '💵',
    balance: 50000,
    price: 1.00,
    color: 'from-blue-500 to-blue-600'
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    icon: '⟠',
    balance: 25.5,
    price: 3240.58,
    color: 'from-purple-500 to-purple-600'
  },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    icon: '₮',
    balance: 75000,
    price: 1.00,
    color: 'from-green-500 to-green-600'
  }
];

const poolData: PoolData = {
  name: 'AEGIS Lending Pool',
  totalSupply: 12500000,
  totalBorrow: 8750000,
  supplyApy: 6.875,
  borrowApr: 5.51,
  liquidationThreshold: 80,
  utilizationRate: 70,
  availableLiquidity: 3750000
};

export function LendInterface() {
  const [selectedToken, setSelectedToken] = useState(tokens[0]);
  const [lendAmount, setLendAmount] = useState('');
  const [lendPercentage, setLendPercentage] = useState([0]);
  const [existingDeposit, setExistingDeposit] = useState('25000'); // Mock existing deposit

  const maxLendAmount = selectedToken.balance; // Can lend up to balance

  useEffect(() => {
    if (lendPercentage[0] > 0) {
      const amount = (maxLendAmount * lendPercentage[0] / 100).toFixed(2);
      setLendAmount(amount);
    }
  }, [lendPercentage, maxLendAmount]);

  const handleAmountChange = (value: string) => {
    setLendAmount(value);
    const percentage = (parseFloat(value) / maxLendAmount) * 100;
    setLendPercentage([Math.min(percentage, 100)]);
  };

  const dailyEarnings = parseFloat(lendAmount || '0') * (poolData.supplyApy / 100) / 365;
  const monthlyEarnings = parseFloat(lendAmount || '0') * (poolData.supplyApy / 100) / 12;
  const yearlyEarnings = parseFloat(lendAmount || '0') * (poolData.supplyApy / 100);
  const existingMonthlyEarnings = parseFloat(existingDeposit) * (poolData.supplyApy / 100) / 12;
  const totalSupplied = parseFloat(existingDeposit) + parseFloat(lendAmount || '0');
  const totalMonthlyEarnings = totalSupplied * (poolData.supplyApy / 100) / 12;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          Lend & Earn
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Supply your assets to earn competitive yields while maintaining full liquidity
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lend Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Position */}
          <Card className="border-2 hover:border-green-200 dark:hover:border-green-800 transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <PiggyBank className="h-5 w-5 text-green-600" />
                  Current Position
                </CardTitle>
                <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                  Earning
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Total Supplied</div>
                  <div className="text-2xl font-bold text-green-600">
                    ${parseFloat(existingDeposit).toLocaleString()}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Monthly Earnings</div>
                  <div className="text-2xl font-bold text-green-600">
                    ${existingMonthlyEarnings.toFixed(2)}
                  </div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground text-center">
                Current APY: {poolData.supplyApy}% • Withdrawable anytime
              </div>
            </CardContent>
          </Card>

          {/* Lend Input */}
          <Card className="border-2 hover:border-emerald-200 dark:hover:border-emerald-800 transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Coins className="h-5 w-5 text-emerald-600" />
                  Supply Amount
                </CardTitle>
                <Badge variant="outline" className="border-emerald-200 text-emerald-700">
                  Balance: {selectedToken.balance.toLocaleString()} {selectedToken.symbol}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Input
                    type="number"
                    value={lendAmount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    className="text-2xl h-14 font-semibold text-center border-2"
                    placeholder="0.00"
                  />
                </div>
                <Select 
                  value={selectedToken.symbol} 
                  onValueChange={(value) => setSelectedToken(tokens.find(t => t.symbol === value) || tokens[0])}
                >
                  <SelectTrigger className="w-40 h-14">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tokens.map((token) => (
                      <SelectItem key={token.symbol} value={token.symbol}>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{token.icon}</span>
                          <span>{token.symbol}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Supply Percentage</span>
                  <span className="font-medium">{lendPercentage[0].toFixed(1)}%</span>
                </div>
                <Slider
                  value={lendPercentage}
                  onValueChange={setLendPercentage}
                  max={100}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[25, 50, 75, 100].map((percentage) => (
                  <Button
                    key={percentage}
                    variant="outline"
                    size="sm"
                    onClick={() => setLendPercentage([percentage])}
                    className="text-xs"
                  >
                    {percentage}%
                  </Button>
                ))}
              </div>

              <div className="text-sm text-muted-foreground text-center">
                ≈ ${(parseFloat(lendAmount || '0') * selectedToken.price).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pool Information */}
        <div className="space-y-6">
          <Card className="border-2 border-emerald-200 dark:border-emerald-800">
            <CardHeader className="pb-4">
              <CardTitle className="text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                {poolData.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Supply APY</div>
                  <div className="text-2xl font-bold text-emerald-600">{poolData.supplyApy}%</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Borrow APR</div>
                  <div className="text-2xl font-bold text-blue-600">{poolData.borrowApr}%</div>
                </div>
              </div>

              <Separator />

              {/* Earnings Projection */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Earnings Projection
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Daily Earnings</span>
                    <span className="font-medium text-emerald-600">
                      ${dailyEarnings.toFixed(4)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Monthly Earnings</span>
                    <span className="font-medium text-emerald-600">
                      ${monthlyEarnings.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Yearly Earnings</span>
                    <span className="font-medium text-emerald-600">
                      ${yearlyEarnings.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Total Position After Supply */}
              {parseFloat(lendAmount || '0') > 0 && (
                <>
                  <div className="space-y-4">
                    <h3 className="font-semibold text-emerald-700 dark:text-emerald-300">After This Supply</h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Total Position</span>
                        <span className="font-medium text-emerald-600">
                          ${totalSupplied.toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Total Monthly Earnings</span>
                        <span className="font-medium text-emerald-600">
                          ${totalMonthlyEarnings.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Earnings Increase</span>
                        <span className="font-medium text-emerald-600">
                          +${(totalMonthlyEarnings - existingMonthlyEarnings).toFixed(2)}/month
                        </span>
                      </div>
                    </div>
                  </div>

                  <Separator />
                </>
              )}

              {/* Pool Stats */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  Pool Statistics
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoIcon className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Pool health and utilization metrics</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Supply</span>
                    <span className="font-medium">${poolData.totalSupply.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Available Liquidity</span>
                    <span className="font-medium text-green-600">${poolData.availableLiquidity.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Utilization Rate</span>
                    <Badge 
                      variant={poolData.utilizationRate > 80 ? "destructive" : poolData.utilizationRate > 60 ? "default" : "secondary"}
                    >
                      {poolData.utilizationRate}%
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Borrowed</span>
                    <span className="font-medium">${poolData.totalBorrow.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Button */}
          <Button 
            className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 transition-all duration-300"
            disabled={!lendAmount || parseFloat(lendAmount) <= 0}
          >
            Supply {selectedToken.symbol}
          </Button>

          {/* Info Box */}
          <div className="flex items-start gap-2 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
            <InfoIcon className="h-5 w-5 text-emerald-600 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                Instant Liquidity
              </p>
              <p className="text-xs text-emerald-700 dark:text-emerald-300">
                Your supplied assets can be withdrawn at any time, subject to available pool liquidity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}