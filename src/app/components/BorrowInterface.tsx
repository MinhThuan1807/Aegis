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
import { InfoIcon, TrendingUp, TrendingDown, Shield, AlertCircle } from 'lucide-react';
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
  utilizationRate: 70
};

export function BorrowInterface() {
  const [selectedToken, setSelectedToken] = useState(tokens[0]);
  const [borrowAmount, setBorrowAmount] = useState('');
  const [borrowPercentage, setBorrowPercentage] = useState([0]);
  const [collateralAmount, setCollateralAmount] = useState('100000');
  const [selectedCollateral, setSelectedCollateral] = useState(tokens[1]);

  const maxBorrowAmount = selectedCollateral.balance * selectedCollateral.price * 0.75; // 75% LTV

  useEffect(() => {
    if (borrowPercentage[0] > 0) {
      const amount = (maxBorrowAmount * borrowPercentage[0] / 100).toFixed(2);
      setBorrowAmount(amount);
    }
  }, [borrowPercentage, maxBorrowAmount]);

  const handleAmountChange = (value: string) => {
    setBorrowAmount(value);
    const percentage = (parseFloat(value) / maxBorrowAmount) * 100;
    setBorrowPercentage([Math.min(percentage, 100)]);
  };

  const monthlyCost = parseFloat(borrowAmount || '0') * (poolData.borrowApr / 100) / 12;
  const monthlyYield = parseFloat(collateralAmount) * selectedCollateral.price * (poolData.supplyApy / 100) / 12;
  const liquidationPrice = parseFloat(collateralAmount) > 0 
    ? (parseFloat(borrowAmount || '0') / parseFloat(collateralAmount)) / (poolData.liquidationThreshold / 100)
    : 0;
  const healthFactor = liquidationPrice > 0 ? (selectedCollateral.price / liquidationPrice) : Infinity;
  const ltv = parseFloat(borrowAmount || '0') / (parseFloat(collateralAmount) * selectedCollateral.price) * 100;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Borrow Assets
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Borrow assets against your collateral with competitive rates and flexible terms
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Borrow Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Collateral Input */}
          <Card className="border-2 hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  Collateral
                </CardTitle>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                  Deposited
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Input
                    type="number"
                    value={collateralAmount}
                    onChange={(e) => setCollateralAmount(e.target.value)}
                    className="text-2xl h-14 font-semibold text-center border-2"
                    placeholder="0.00"
                  />
                </div>
                <Select 
                  value={selectedCollateral.symbol} 
                  onValueChange={(value) => setSelectedCollateral(tokens.find(t => t.symbol === value) || tokens[0])}
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
              <div className="text-sm text-muted-foreground text-center">
                ≈ ${(parseFloat(collateralAmount) * selectedCollateral.price).toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground text-center">
                Balance: {selectedCollateral.balance.toLocaleString()} {selectedCollateral.symbol}
              </div>
            </CardContent>
          </Card>

          {/* Borrow Input */}
          <Card className="border-2 hover:border-purple-200 dark:hover:border-purple-800 transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-purple-600" />
                  Borrow Amount
                </CardTitle>
                <Badge variant="outline" className="border-purple-200 text-purple-700">
                  Max: ${maxBorrowAmount.toLocaleString()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Input
                    type="number"
                    value={borrowAmount}
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
                  <span>Borrow Percentage</span>
                  <span className="font-medium">{borrowPercentage[0].toFixed(1)}%</span>
                </div>
                <Slider
                  value={borrowPercentage}
                  onValueChange={setBorrowPercentage}
                  max={95}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>95%</span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[25, 50, 75, 95].map((percentage) => (
                  <Button
                    key={percentage}
                    variant="outline"
                    size="sm"
                    onClick={() => setBorrowPercentage([percentage])}
                    className="text-xs"
                  >
                    {percentage}%
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pool Information */}
        <div className="space-y-6">
          <Card className="border-2 border-green-200 dark:border-green-800">
            <CardHeader className="pb-4">
              <CardTitle className="text-green-700 dark:text-green-300 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                {poolData.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Borrow APR</div>
                  <div className="text-2xl font-bold text-red-600">{poolData.borrowApr}%</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Supply APY</div>
                  <div className="text-2xl font-bold text-green-600">{poolData.supplyApy}%</div>
                </div>
              </div>

              <Separator />

              {/* Loan Details */}
              <div className="space-y-4">
                <h3 className="font-semibold">Loan Details</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Monthly Cost</span>
                    <span className="font-medium text-red-600">
                      ${monthlyCost.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Monthly Yield</span>
                    <span className="font-medium text-green-600">
                      ${monthlyYield.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Net Monthly</span>
                    <span className={`font-medium ${monthlyYield - monthlyCost >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${(monthlyYield - monthlyCost).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Risk Metrics */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  Risk Metrics
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoIcon className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Monitor these metrics to avoid liquidation</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Loan-to-Value</span>
                    <Badge 
                      variant={ltv > 70 ? "destructive" : ltv > 50 ? "default" : "secondary"}
                      className="font-medium"
                    >
                      {ltv.toFixed(1)}%
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Health Factor</span>
                    <Badge 
                      variant={healthFactor < 1.2 ? "destructive" : healthFactor < 1.5 ? "default" : "secondary"}
                      className="font-medium"
                    >
                      {healthFactor === Infinity ? '∞' : healthFactor.toFixed(2)}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Liquidation Price</span>
                    <span className="font-medium">
                      ${liquidationPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Pool Stats */}
              <div className="space-y-4">
                <h3 className="font-semibold">Pool Statistics</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Supply</span>
                    <span className="font-medium">${poolData.totalSupply.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Borrowed</span>
                    <span className="font-medium">${poolData.totalBorrow.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Utilization Rate</span>
                    <Badge variant="outline">{poolData.utilizationRate}%</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Button */}
          <Button 
            className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
            disabled={!borrowAmount || parseFloat(borrowAmount) <= 0}
          >
            Borrow {selectedToken.symbol}
          </Button>

          {/* Warning */}
          {ltv > 70 && (
            <div className="flex items-start gap-2 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                  High Risk Warning
                </p>
                <p className="text-xs text-orange-700 dark:text-orange-300">
                  Your loan-to-value ratio is high. Consider reducing borrow amount to avoid liquidation risk.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}