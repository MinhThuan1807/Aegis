// src/app/components/SwapInterface.tsx
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Badge } from '@/src/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import { Separator } from '@/src/components/ui/separator';
import { ArrowDownUp, Settings, Info, AlertCircle, RefreshCw } from 'lucide-react';
import { Slider } from '@/src/components/ui/slider';
import { useSwap } from '@/src/hooks/useSwap';
import { useWallet } from '@/src/hooks/useWallet';
import { TransactionModal } from '@/src/components/transaction/TransactionModal';

interface Token {
  symbol: string;
  name: string;
  icon: string;
  balance: number;
  price: number;
  color: string;
}

const tokens: Token[] = [
  {
    symbol: 'ETH',
    name: 'Ethereum',
    icon: '⟠',
    balance: 25.5,
    price: 3240.58,
    color: 'from-purple-500 to-purple-600'
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    icon: '💵',
    balance: 50000,
    price: 1.00,
    color: 'from-blue-500 to-blue-600'
  },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    icon: '₮',
    balance: 75000,
    price: 1.00,
    color: 'from-green-500 to-green-600'
  },
  {
    symbol: 'WBTC',
    name: 'Wrapped Bitcoin',
    icon: '₿',
    balance: 1.25,
    price: 43250.00,
    color: 'from-orange-500 to-orange-600'
  }
];

const SwapInterface = () => {
  const { isConnected, connect } = useWallet();
  const { getQuote, executeSwap, quote, isLoading } = useSwap();

  const [fromToken, setFromToken] = useState<Token>(tokens[0]);
  const [toToken, setToToken] = useState<Token>(tokens[1]);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [slippage, setSlippage] = useState(0.5);
  const [showSettings, setShowSettings] = useState(false);
  
  // Transaction modal
  const [showTxModal, setShowTxModal] = useState(false);
  const [txStatus, setTxStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const [txHash, setTxHash] = useState('');

  // Get quote when amount changes
  useEffect(() => {
    if (fromAmount && parseFloat(fromAmount) > 0) {
      const fetchQuote = async () => {
        try {
          const result = await getQuote(fromToken.symbol, toToken.symbol, fromAmount);
          const outputAmount = Number(result.estimatedOutput) / 1e18;
          setToAmount(outputAmount.toFixed(6));
        } catch (error) {
          console.error('Failed to get quote:', error);
        }
      };
      
      const debounce = setTimeout(fetchQuote, 500);
      return () => clearTimeout(debounce);
    } else {
      setToAmount('');
    }
  }, [fromAmount, fromToken, toToken, getQuote]);

  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  const handleMaxAmount = () => {
    setFromAmount(fromToken.balance.toString());
  };

  const handleSwap = async () => {
    if (!isConnected) {
      connect();
      return;
    }

    if (!fromAmount || !toAmount || parseFloat(fromAmount) <= 0) {
      return;
    }

    try {
      setShowTxModal(true);
      setTxStatus('pending');
      
      // Calculate minimum output with slippage
      const minOutput = (parseFloat(toAmount) * (1 - slippage / 100)).toFixed(6);
      
      const result = await executeSwap(
        fromToken.symbol,
        toToken.symbol,
        fromAmount,
        minOutput
      );
      
      setTxHash(result.hash);
      setTxStatus(result.status as 'success' | 'failed');
      
      if (result.status === 'success') {
        setTimeout(() => {
          setFromAmount('');
          setToAmount('');
          setShowTxModal(false);
        }, 3000);
      }
    } catch (error) {
      setTxStatus('failed');
    }
  };

  const exchangeRate = quote ? quote.rate : (toToken.price / fromToken.price);
  const priceImpact = quote ? quote.priceImpact : 0;
  const minimumReceived = parseFloat(toAmount || '0') * (1 - slippage / 100);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Token Swap
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Swap tokens instantly with the best rates on Cedra Chain
        </p>
      </div>

      {/* Wallet Warning */}
      {!isConnected && (
        <div className="flex items-center gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800 max-w-2xl mx-auto">
          <AlertCircle className="h-5 w-5 text-yellow-600" />
          <div className="flex-1">
            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              Connect your wallet to swap tokens
            </p>
          </div>
          <Button onClick={connect} size="sm" variant="outline">
            Connect Wallet
          </Button>
        </div>
      )}

      <div className="max-w-2xl mx-auto">
        <Card className="border-2">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle>Swap Tokens</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Settings Panel */}
            {showSettings && (
              <Card className="bg-muted/50">
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Slippage Tolerance</span>
                      <span className="text-sm font-bold">{slippage}%</span>
                    </div>
                    <Slider
                      value={[slippage]}
                      onValueChange={(value) => setSlippage(value[0])}
                      min={0.1}
                      max={5}
                      step={0.1}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0.1%</span>
                      <span>2.5%</span>
                      <span>5%</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[0.5, 1.0, 2.0, 3.0].map((value) => (
                      <Button
                        key={value}
                        variant={slippage === value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSlippage(value)}
                        className="text-xs"
                      >
                        {value}%
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* From Token */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">From</label>
                <span className="text-xs text-muted-foreground">
                  Balance: {fromToken.balance.toLocaleString()} {fromToken.symbol}
                </span>
              </div>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Input
                      type="number"
                      value={fromAmount}
                      onChange={(e) => setFromAmount(e.target.value)}
                      placeholder="0.0"
                      className="text-2xl font-semibold border-0 focus-visible:ring-0 p-0"
                      disabled={!isConnected}
                    />
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleMaxAmount}
                        disabled={!isConnected}
                      >
                        MAX
                      </Button>
                      <Select
                        value={fromToken.symbol}
                        onValueChange={(value) =>
                          setFromToken(tokens.find((t) => t.symbol === value)!)
                        }
                        disabled={!isConnected}
                      >
                        <SelectTrigger className="w-32">
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
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    ≈ ${(parseFloat(fromAmount || '0') * fromToken.price).toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Swap Direction Button */}
            <div className="flex justify-center -my-2 relative z-10">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-10 w-10 border-2 bg-background"
                onClick={handleSwapTokens}
                disabled={!isConnected}
              >
                <ArrowDownUp className="h-4 w-4" />
              </Button>
            </div>

            {/* To Token */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">To</label>
                <span className="text-xs text-muted-foreground">
                  Balance: {toToken.balance.toLocaleString()} {toToken.symbol}
                </span>
              </div>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Input
                      type="number"
                      value={toAmount}
                      readOnly
                      placeholder="0.0"
                      className="text-2xl font-semibold border-0 focus-visible:ring-0 p-0 bg-transparent"
                    />
                    <Select
                      value={toToken.symbol}
                      onValueChange={(value) =>
                        setToToken(tokens.find((t) => t.symbol === value)!)
                      }
                      disabled={!isConnected}
                    >
                      <SelectTrigger className="w-32">
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
                  <div className="text-sm text-muted-foreground mt-2">
                    ≈ ${(parseFloat(toAmount || '0') * toToken.price).toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Swap Details */}
            {fromAmount && toAmount && (
              <Card className="bg-muted/50">
                <CardContent className="pt-6 space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Exchange Rate</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        1 {fromToken.symbol} = {exchangeRate.toFixed(6)} {toToken.symbol}
                      </span>
                      <RefreshCw className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Price Impact</span>
                    <Badge
                      variant={priceImpact > 3 ? 'destructive' : priceImpact > 1 ? 'default' : 'secondary'}
                    >
                      {priceImpact.toFixed(2)}%
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Minimum Received</span>
                    <span className="font-medium">
                      {minimumReceived.toFixed(6)} {toToken.symbol}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Network Fee</span>
                    <span className="font-medium">~$0.50</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Swap Button */}
            <Button
              className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={handleSwap}
              disabled={!fromAmount || !toAmount || parseFloat(fromAmount) <= 0 || isLoading}
            >
              {!isConnected
                ? 'Connect Wallet'
                : isLoading
                ? 'Getting Quote...'
                : 'Swap Tokens'}
            </Button>

            {/* Warning for high price impact */}
            {priceImpact > 3 && fromAmount && (
              <div className="flex items-start gap-2 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                    High Price Impact
                  </p>
                  <p className="text-xs text-orange-700 dark:text-orange-300">
                    This swap has a price impact of {priceImpact.toFixed(2)}%. Consider reducing the amount.
                  </p>
                </div>
              </div>
            )}

            {/* Info */}
            <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Best Price Guaranteed
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Our smart routing finds the best exchange rate across all liquidity pools on Cedra Chain.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={showTxModal}
        onClose={() => setShowTxModal(false)}
        status={txStatus}
        txHash={txHash}
        type="swap"
        amount={fromAmount}
        token={`${fromToken.symbol} → ${toToken.symbol}`}
      />
    </div>
  );
}
export default SwapInterface;