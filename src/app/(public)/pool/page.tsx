"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import { Plus, ExternalLink, Shield, Users, Coins, TrendingUp } from 'lucide-react';
import { Separator } from '@/src/components/ui/separator';

interface PoolData {
  id: string;
  name: string;
  address: string;
  totalSupply: number;
  totalBorrow: number;
  owner: string;
  extension: string;
  markets: string[];
  fee: number;
  verified: boolean;
  tokens: {
    icon: string;
    symbol: string;
    color: string;
  }[];
}

const poolsData: PoolData[] = [
  {
    id: '1',
    name: 'Genesis',
    address: '0xd4c4...bf28',
    totalSupply: 38921000,
    totalBorrow: 17370000,
    owner: 'Vesu',
    extension: 'Pragma',
    markets: ['USDC', 'ETH', 'WBTC', 'wstETH'],
    fee: 0,
    verified: true,
    tokens: [
      { icon: '💵', symbol: 'USDC', color: 'from-blue-500 to-blue-600' },
      { icon: '⟠', symbol: 'ETH', color: 'from-purple-500 to-purple-600' },
      { icon: '₿', symbol: 'WBTC', color: 'from-orange-500 to-orange-600' },
      { icon: '🔷', symbol: 'wstETH', color: 'from-blue-400 to-purple-500' }
    ]
  },
  {
    id: '2',
    name: 'Re7 xSTRK',
    address: '0x52fb...f161',
    totalSupply: 3060000,
    totalBorrow: 609370000,
    owner: 'Re7 Labs',
    extension: 'Pragma',
    markets: ['STRK'],
    fee: 20,
    verified: false,
    tokens: [
      { icon: '⚡', symbol: 'STRK', color: 'from-purple-600 to-pink-600' }
    ]
  },
  {
    id: '3',
    name: 'Re7 Starknet Ecosystem',
    address: '0x6feb...148d',
    totalSupply: 1610000,
    totalBorrow: 221890000,
    owner: 'Re7 Labs',
    extension: 'Pragma',
    markets: ['LORDS', 'NSTR'],
    fee: 20,
    verified: false,
    tokens: [
      { icon: '👑', symbol: 'LORDS', color: 'from-yellow-500 to-orange-500' },
      { icon: '🌟', symbol: 'NSTR', color: 'from-green-500 to-blue-500' }
    ]
  },
  {
    id: '4',
    name: 'Braavos Vault',
    address: '0x43f4...7e6e',
    totalSupply: 359120000,
    totalBorrow: 331010000,
    owner: 'Braavos',
    extension: 'Pragma',
    markets: ['USDC', 'ETH'],
    fee: 15,
    verified: true,
    tokens: [
      { icon: '💵', symbol: 'USDC', color: 'from-blue-500 to-blue-600' },
      { icon: '⟠', symbol: 'ETH', color: 'from-purple-500 to-purple-600' }
    ]
  },
  {
    id: '5',
    name: 'Re7 wstETH',
    address: '0x234a...9b2c',
    totalSupply: 236100000,
    totalBorrow: 56850000,
    owner: 'Re7 Labs',
    extension: 'Pragma',
    markets: ['wstETH'],
    fee: 25,
    verified: false,
    tokens: [
      { icon: '🔷', symbol: 'wstETH', color: 'from-blue-400 to-purple-500' }
    ]
  }
];

const totalStats = {
  totalSupplied: 44930000,
  totalBorrowed: 18360000
};

const Pool = () => {
  const [activeTab, setActiveTab] = useState('verified');

  const filteredPools = poolsData.filter(pool => {
    switch (activeTab) {
      case 'verified':
        return pool.verified;
      case 'all':
        return true;
      case 'my':
        return false; // Mock: no user pools for now
      default:
        return true;
    }
  });

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Hero Banner */}
      <Card className="relative overflow-hidden border-2 border-blue-200 dark:border-blue-800">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950 dark:via-purple-950 dark:to-pink-950" />
        <div className="absolute top-0 right-0 w-1/2 h-full">
          <div className="w-full h-full bg-gradient-to-br from-yellow-200/30 via-blue-200/30 to-purple-200/30 dark:from-yellow-900/30 dark:via-blue-900/30 dark:to-purple-900/30 rounded-full transform translate-x-1/4 -translate-y-1/4 scale-150" />
          <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-to-br from-orange-300/40 to-red-300/40 dark:from-orange-900/40 dark:to-red-900/40 rounded-full" />
          <div className="absolute bottom-1/4 right-1/3 w-24 h-24 bg-gradient-to-br from-green-300/40 to-blue-300/40 dark:from-green-900/40 dark:to-blue-900/40 rounded-full" />
        </div>
        <CardContent className="relative p-8">
          <div className="max-w-md space-y-4">
            <h1 className="text-3xl font-bold">Create your own pool</h1>
            <p className="text-muted-foreground">
              Learn all about pool curation and timing in the{' '}
              <a href="#" className="text-blue-600 hover:text-blue-700 underline">
                Docs
              </a>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Pools Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Pools</h2>
            <div className="flex gap-8 mt-2 text-sm">
              <div>
                <span className="text-muted-foreground">Total supplied</span>
                <div className="text-2xl font-bold">${(totalStats.totalSupplied / 1000000).toFixed(2)}M</div>
              </div>
              <div>
                <span className="text-muted-foreground">Total borrowed</span>
                <div className="text-2xl font-bold">${(totalStats.totalBorrowed / 1000000).toFixed(2)}M</div>
              </div>
            </div>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 h-10 px-6">
            <Plus className="h-4 w-4 mr-2" />
            Create Pool
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-fit grid-cols-3">
            <TabsTrigger value="verified">Verified pools</TabsTrigger>
            <TabsTrigger value="all">All pools</TabsTrigger>
            <TabsTrigger value="my">My pools</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-[200px]">Name</TableHead>
                      <TableHead className="text-right">Total supply</TableHead>
                      <TableHead className="text-right">Total borrow</TableHead>
                      <TableHead>Owner & Extension</TableHead>
                      <TableHead>Markets</TableHead>
                      <TableHead className="text-right">Fee</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPools.map((pool) => (
                      <TableRow 
                        key={pool.id}
                        className="hover:bg-muted/30 cursor-pointer transition-colors"
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              {pool.verified && (
                                <Shield className="h-4 w-4 text-blue-600" />
                              )}
                              <span className="font-medium">{pool.name}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <span>{pool.address}</span>
                              <ExternalLink className="h-3 w-3" />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="font-medium">
                            ${(pool.totalSupply / 1000000).toFixed(2)}M
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="font-medium">
                            ${(pool.totalBorrow / 1000000).toFixed(2)}M
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                <Users className="h-3 w-3 text-white" />
                              </div>
                              <span className="font-medium text-sm">{pool.owner}</span>
                            </div>
                            <div className="text-xs text-muted-foreground ml-8">
                              {pool.extension}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {pool.tokens.slice(0, 4).map((token, index) => (
                              <div
                                key={index}
                                className={`w-6 h-6 rounded-full bg-gradient-to-r ${token.color} flex items-center justify-center text-xs -ml-1 first:ml-0 border-2 border-background`}
                                title={token.symbol}
                              >
                                {token.icon}
                              </div>
                            ))}
                            {pool.tokens.length > 4 && (
                              <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs -ml-1 border-2 border-background">
                                +{pool.tokens.length - 4}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge 
                            variant={pool.fee === 0 ? "secondary" : "outline"}
                            className={pool.fee === 0 ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : ""}
                          >
                            {pool.fee}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {filteredPools.length === 0 && (
                  <div className="p-8 text-center">
                    <div className="space-y-3">
                      <Coins className="h-12 w-12 text-muted-foreground mx-auto" />
                      <h3 className="text-lg font-medium">No pools found</h3>
                      <p className="text-sm text-muted-foreground">
                        {activeTab === 'my' 
                          ? "You haven't created any pools yet."
                          : "No pools match the current filter."
                        }
                      </p>
                      {activeTab === 'my' && (
                        <Button className="mt-4" variant="outline">
                          <Plus className="h-4 w-4 mr-2" />
                          Create your first pool
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Shield className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Verified Pools</div>
                  <div className="text-lg font-bold">
                    {poolsData.filter(p => p.verified).length}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Coins className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Total Pools</div>
                  <div className="text-lg font-bold">
                    {poolsData.length}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Avg Utilization</div>
                  <div className="text-lg font-bold">
                    {((totalStats.totalBorrowed / totalStats.totalSupplied) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
export default Pool;