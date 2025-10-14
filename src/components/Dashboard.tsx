"use client";
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import { MarketCard } from '@/src/components/MarketCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Wallet, TrendingUp, DollarSign, PieChart } from 'lucide-react';

export function Dashboard() {
  const [activeTab, setActiveTab] = useState('supply');

  // Mock data for demonstration
  const assets = [
    {
      name: 'Ethereum',
      symbol: 'ETH',
      icon: '🔷',
      supplyAPY: 4.25,
      borrowAPY: 6.50,
      totalSupply: '$1.2B',
      totalBorrow: '$850M',
      utilization: 71,
      price: 2340,
      change24h: 2.4
    },
    {
      name: 'USD Coin',
      symbol: 'USDC',
      icon: '💵',
      supplyAPY: 8.75,
      borrowAPY: 12.30,
      totalSupply: '$950M',
      totalBorrow: '$720M',
      utilization: 76,
      price: 1.00,
      change24h: 0.01
    },
    {
      name: 'Bitcoin',
      symbol: 'BTC',
      icon: '₿',
      supplyAPY: 3.15,
      borrowAPY: 5.80,
      totalSupply: '$800M',
      totalBorrow: '$450M',
      utilization: 56,
      price: 43250,
      change24h: -1.2
    },
    {
      name: 'Chainlink',
      symbol: 'LINK',
      icon: '🔗',
      supplyAPY: 6.80,
      borrowAPY: 9.45,
      totalSupply: '$125M',
      totalBorrow: '$78M',
      utilization: 62,
      price: 14.85,
      change24h: 5.7
    }
  ];

  const userStats = [
    {
      title: 'Net Worth',
      value: '$12,485.50',
      change: '+5.2%',
      icon: <Wallet className="h-4 w-4" />
    },
    {
      title: 'Supply Balance',
      value: '$8,250.00',
      change: '+2.1%',
      icon: <TrendingUp className="h-4 w-4" />
    },
    {
      title: 'Borrow Balance',
      value: '$3,180.75',
      change: '-1.5%',
      icon: <DollarSign className="h-4 w-4" />
    },
    {
      title: 'Net APY',
      value: '4.85%',
      change: '+0.3%',
      icon: <PieChart className="h-4 w-4" />
    }
  ];

  return (
    <section className="py-16" id="markets">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* User Portfolio Overview */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8">Your Portfolio</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {userStats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  {stat.icon}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge 
                      variant={stat.change.startsWith('+') ? 'default' : 'destructive'}
                      className="text-xs"
                    >
                      {stat.change}
                    </Badge>
                    <p className="text-xs text-muted-foreground">from last month</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Markets */}
        <div>
          <h2 className="text-3xl font-bold mb-8">Markets</h2>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="supply">Supply Markets</TabsTrigger>
              <TabsTrigger value="borrow">Borrow Markets</TabsTrigger>
            </TabsList>
            
            <TabsContent value="supply">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {assets.map((asset, index) => (
                  <MarketCard 
                    key={`supply-${index}`}
                    asset={asset}
                    type="supply"
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="borrow">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {assets.map((asset, index) => (
                  <MarketCard 
                    key={`borrow-${index}`}
                    asset={asset}
                    type="borrow"
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}