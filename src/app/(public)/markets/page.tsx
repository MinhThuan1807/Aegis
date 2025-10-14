"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Badge } from '@/src/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table';
import { Search, TrendingUp, DollarSign, PieChart, Shield, Info, ChevronDown } from 'lucide-react';
import { Separator } from '@/src/components/ui/separator';

interface MarketData {
  asset: string;
  symbol: string;
  icon: string;
  pool: string;
  risk: 'Low' | 'Medium' | 'High';
  supplied: number;
  supplyApy: number;
  borrowed: number;
  borrowApr: number;
  utilization: number;
  color: string;
  category: string[];
}

const marketCategories = ['All', 'BTC', 'ETH', 'Stables', 'AEGIS', 'Altcoins'];

const marketData: MarketData[] = [
  {
    asset: 'Wrapped Staked Ether',
    symbol: 'wstETH',
    icon: '⟠',
    pool: 'Genesis',
    risk: 'Low',
    supplied: 14520000,
    supplyApy: 4.33,
    borrowed: 3550000,
    borrowApr: 6.43,
    utilization: 24.4,
    color: 'from-purple-500 to-purple-600',
    category: ['ETH']
  },
  {
    asset: 'Ether',
    symbol: 'ETH',
    icon: '⟠',
    pool: 'Genesis', 
    risk: 'Low',
    supplied: 12830000,
    supplyApy: 4.63,
    borrowed: 2780000,
    borrowApr: 6.92,
    utilization: 21.7,
    color: 'from-purple-500 to-purple-600',
    category: ['ETH']
  },
  {
    asset: 'USD Coin',
    symbol: 'USDC',
    icon: '💵',
    pool: 'Genesis',
    risk: 'Low',
    supplied: 6110000,
    supplyApy: 5.35,
    borrowed: 4630000,
    borrowApr: 7.34,
    utilization: 75.8,
    color: 'from-blue-500 to-blue-600',
    category: ['Stables']
  },
  {
    asset: 'Wrapped BTC',
    symbol: 'WBTC',
    icon: '₿',
    pool: 'Genesis',
    risk: 'Medium',
    supplied: 4700000,
    supplyApy: 3.09,
    borrowed: 980700,
    borrowApr: 5.26,
    utilization: 20.9,
    color: 'from-orange-500 to-orange-600',
    category: ['BTC']
  },
  {
    asset: 'Tether USD',
    symbol: 'USDT',
    icon: '₮',
    pool: 'AEGIS',
    risk: 'Low',
    supplied: 2350000,
    supplyApy: 8.07,
    borrowed: 0,
    borrowApr: 0,
    utilization: 0,
    color: 'from-green-500 to-green-600',
    category: ['Stables', 'AEGIS']
  },
  {
    asset: 'Chainlink',
    symbol: 'LINK',
    icon: '🔗',
    pool: 'AEGIS',
    risk: 'Medium',
    supplied: 1250000,
    supplyApy: 6.42,
    borrowed: 340000,
    borrowApr: 8.91,
    utilization: 27.2,
    color: 'from-blue-400 to-blue-500',
    category: ['Altcoins', 'AEGIS']
  }
];

const totalStats = {
  tvl: 45170000,
  totalSupplied: 26720000,
  totalBorrowed: 18440000
};

const Market = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{key: keyof MarketData; direction: 'asc' | 'desc'} | null>(null);

  const filteredData = marketData.filter(market => {
    const matchesCategory = activeCategory === 'All' || market.category.includes(activeCategory);
    const matchesSearch = market.asset.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         market.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig) return 0;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortConfig.direction === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    return 0;
  });

  const handleSort = (key: keyof MarketData) => {
    setSortConfig(current => ({
      key,
      direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'High': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* AEGIS DeFi Banner - Optional promotional banner */}
      <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-blue-800 dark:text-blue-200">
                AEGIS DeFi Platform
              </h3>
              <p className="text-blue-700 dark:text-blue-300 max-w-md">
                Experience next-generation DeFi lending with competitive rates and secure protocols.
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <Shield className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold">Markets</h1>
          <div className="flex gap-6 text-sm">
            <div className="text-center">
              <div className="text-muted-foreground">TVL</div>
              <div className="text-2xl font-bold">${(totalStats.tvl / 1000000).toFixed(1)}M</div>
            </div>
            <div className="text-center">
              <div className="text-muted-foreground">Total supplied</div>
              <div className="text-2xl font-bold">${(totalStats.totalSupplied / 1000000).toFixed(1)}M</div>
            </div>
            <div className="text-center">
              <div className="text-muted-foreground">Total borrowed</div>
              <div className="text-2xl font-bold">${(totalStats.totalBorrowed / 1000000).toFixed(1)}M</div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {marketCategories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category)}
                className={activeCategory === category ? 
                  "bg-blue-600 hover:bg-blue-700" : 
                  "hover:bg-blue-50 dark:hover:bg-blue-950"
                }
              >
                {category}
              </Button>
            ))}
          </div>
          
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search markets"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Markets Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleSort('asset')}
                >
                  <div className="flex items-center gap-1">
                    Asset
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleSort('pool')}
                >
                  <div className="flex items-center gap-1">
                    Pool
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Risk</TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50 transition-colors text-right"
                  onClick={() => handleSort('supplied')}
                >
                  <div className="flex items-center justify-end gap-1">
                    Supplied
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="text-right">Supply APY</TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50 transition-colors text-right"
                  onClick={() => handleSort('borrowed')}
                >
                  <div className="flex items-center justify-end gap-1">
                    Borrowed
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="text-right">Borrow APR</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((market) => (
                <TableRow 
                  key={`${market.symbol}-${market.pool}`}
                  className="hover:bg-muted/30 cursor-pointer transition-colors"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${market.color} flex items-center justify-center text-white font-bold`}>
                        {market.icon}
                      </div>
                      <div>
                        <div className="font-medium">{market.asset}</div>
                        <div className="text-sm text-muted-foreground">{market.symbol}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono">
                      {market.pool}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getRiskBadgeColor(market.risk)}>
                      {market.risk}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="space-y-1">
                      <div className="font-medium">
                        ${(market.supplied / 1000000).toFixed(2)}M
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {market.utilization.toFixed(1)}%
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <span className="font-medium text-green-600">
                        {market.supplyApy.toFixed(2)}%
                      </span>
                      <TrendingUp className="h-3 w-3 text-green-600" />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="space-y-1">
                      <div className="font-medium">
                        {market.borrowed > 0 ? `$${(market.borrowed / 1000000).toFixed(2)}M` : 'Not Available'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {market.borrowed > 0 ? `${((market.borrowed / market.supplied) * 100).toFixed(1)}%` : 'N/A'}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {market.borrowApr > 0 ? (
                      <div className="flex items-center justify-end gap-1">
                        <span className="font-medium text-red-600">
                          {market.borrowApr.toFixed(2)}%
                        </span>
                        <TrendingUp className="h-3 w-3 text-red-600" />
                      </div>
                    ) : (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <PieChart className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Average Supply APY</div>
                <div className="text-lg font-bold text-green-600">
                  {(marketData.reduce((acc, market) => acc + market.supplyApy, 0) / marketData.length).toFixed(2)}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                <TrendingUp className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Average Borrow APR</div>
                <div className="text-lg font-bold text-red-600">
                  {(marketData.filter(m => m.borrowApr > 0).reduce((acc, market) => acc + market.borrowApr, 0) / 
                    marketData.filter(m => m.borrowApr > 0).length).toFixed(2)}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total Markets</div>
                <div className="text-lg font-bold">
                  {marketData.length} Assets
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
export default Market;