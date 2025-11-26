import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import { Separator } from '@/src/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/components/ui/table';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Info,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';

interface MarketDetailsProps {
  symbol: string;
  onBack: () => void;
}
export function MarketDetails({ symbol, onBack }: MarketDetailsProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');
  const [copiedAddress, setCopiedAddress] = useState(false);

  // Mock market data - in real app, this would come from props or API
  const marketData = {
    ETH: {
      name: 'Ethereum',
      symbol: 'ETH',
      icon: '🔷',
      price: 2340.50,
      change24h: 2.4,
      contract: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
      decimals: 18,
      totalSupply: '$1.2B',
      totalBorrow: '$850M',
      supplyAPY: 4.25,
      borrowAPR: 6.50,
      utilization: 71,
      liquidationThreshold: 82.5,
      ltv: 75,
      liquidationPenalty: 5,
      reserveFactor: 10
    },
    USDC: {
      name: 'USD Coin',
      symbol: 'USDC',
      icon: '💵',
      price: 1.00,
      change24h: 0.01,
      contract: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      decimals: 6,
      totalSupply: '$950M',
      totalBorrow: '$720M',
      supplyAPY: 8.75,
      borrowAPR: 12.30,
      utilization: 76,
      liquidationThreshold: 85,
      ltv: 80,
      liquidationPenalty: 4.5,
      reserveFactor: 8
    }
  };

  const market = marketData[symbol as keyof typeof marketData] || marketData.ETH;

  // APY/APR history data
  const apyHistory = {
    '7d': [
      { date: 'Oct 11', supplyAPY: 4.1, borrowAPR: 6.3 },
      { date: 'Oct 12', supplyAPY: 4.2, borrowAPR: 6.4 },
      { date: 'Oct 13', supplyAPY: 4.0, borrowAPR: 6.2 },
      { date: 'Oct 14', supplyAPY: 4.3, borrowAPR: 6.5 },
      { date: 'Oct 15', supplyAPY: 4.2, borrowAPR: 6.4 },
      { date: 'Oct 16', supplyAPY: 4.25, borrowAPR: 6.5 },
      { date: 'Oct 17', supplyAPY: 4.25, borrowAPR: 6.5 }
    ],
    '30d': [
      { date: 'Sep 18', supplyAPY: 3.8, borrowAPR: 6.0 },
      { date: 'Sep 25', supplyAPY: 3.9, borrowAPR: 6.1 },
      { date: 'Oct 2', supplyAPY: 4.0, borrowAPR: 6.2 },
      { date: 'Oct 9', supplyAPY: 4.1, borrowAPR: 6.4 },
      { date: 'Oct 16', supplyAPY: 4.25, borrowAPR: 6.5 }
    ],
    '90d': [
      { date: 'Jul 20', supplyAPY: 3.2, borrowAPR: 5.5 },
      { date: 'Aug 20', supplyAPY: 3.5, borrowAPR: 5.8 },
      { date: 'Sep 20', supplyAPY: 3.9, borrowAPR: 6.1 },
      { date: 'Oct 17', supplyAPY: 4.25, borrowAPR: 6.5 }
    ]
  };

  // Utilization rate history
  const utilizationHistory = {
    '7d': [
      { date: 'Oct 11', rate: 68 },
      { date: 'Oct 12', rate: 69 },
      { date: 'Oct 13', rate: 67 },
      { date: 'Oct 14', rate: 70 },
      { date: 'Oct 15', rate: 71 },
      { date: 'Oct 16', rate: 71 },
      { date: 'Oct 17', rate: 71 }
    ],
    '30d': [
      { date: 'Sep 18', rate: 65 },
      { date: 'Sep 25', rate: 66 },
      { date: 'Oct 2', rate: 68 },
      { date: 'Oct 9', rate: 69 },
      { date: 'Oct 16', rate: 71 }
    ],
    '90d': [
      { date: 'Jul 20', rate: 58 },
      { date: 'Aug 20', rate: 62 },
      { date: 'Sep 20', rate: 66 },
      { date: 'Oct 17', rate: 71 }
    ]
  };

  // Volume data
  const volumeData = [
    { date: 'Oct 11', supply: 45, borrow: 32 },
    { date: 'Oct 12', supply: 52, borrow: 38 },
    { date: 'Oct 13', supply: 48, borrow: 35 },
    { date: 'Oct 14', supply: 58, borrow: 42 },
    { date: 'Oct 15', supply: 55, borrow: 40 },
    { date: 'Oct 16', supply: 62, borrow: 45 },
    { date: 'Oct 17', supply: 68, borrow: 48 }
  ];

  // Recent transactions
  const recentTransactions = [
    { address: '0x742d...0bEb', type: 'Supply', amount: '2.5 ETH', value: '$5,850', time: '5 min ago' },
    { address: '0x8f3a...12cD', type: 'Borrow', amount: '1.2 ETH', value: '$2,808', time: '12 min ago' },
    { address: '0x1a2b...45ef', type: 'Repay', amount: '0.8 ETH', value: '$1,872', time: '25 min ago' },
    { address: '0x9c7d...89ab', type: 'Supply', amount: '5.0 ETH', value: '$11,702', time: '34 min ago' },
    { address: '0x4e5f...67cd', type: 'Withdraw', amount: '1.5 ETH', value: '$3,510', time: '48 min ago' }
  ];

  const copyAddress = () => {
    navigator.clipboard.writeText(market.contract);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  return (
    <div className="py-4">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <span className="text-5xl">{market.icon}</span>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl">{market.name}</h1>
                  <Badge variant="outline">{market.symbol}</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-2xl">${market.price.toLocaleString()}</p>
                  <Badge variant={market.change24h >= 0 ? 'default' : 'destructive'}>
                    {market.change24h >= 0 ? '+' : ''}{market.change24h}%
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button>Supply {market.symbol}</Button>
              <Button variant="outline">Borrow {market.symbol}</Button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">Supply APY</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <p className="text-2xl text-green-500">{market.supplyAPY}%</p>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">Borrow APR</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <p className="text-2xl text-red-500">{market.borrowAPR}%</p>
                <TrendingDown className="h-4 w-4 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">Total Supply</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl">{market.totalSupply}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">Total Borrowed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl">{market.totalBorrow}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="charts">Charts</TabsTrigger>
            <TabsTrigger value="transactions">Recent Activity</TabsTrigger>
            <TabsTrigger value="info">Token Info</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Market Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle>Market Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Utilization Rate</span>
                    <div className="flex items-center gap-2">
                      <span>{market.utilization}%</span>
                      <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary" 
                          style={{ width: `${market.utilization}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Supply</span>
                    <span>{market.totalSupply}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Borrowed</span>
                    <span>{market.totalBorrow}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Available Liquidity</span>
                    <span className="text-green-500">
                      ${((parseFloat(market.totalSupply.replace(/[$BM]/g, '')) - parseFloat(market.totalBorrow.replace(/[$BM]/g, ''))) * (market.totalSupply.includes('B') ? 1000 : 1)).toFixed(0)}M
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Risk Parameters */}
              <Card>
                <CardHeader>
                  <CardTitle>Risk Parameters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Max LTV</span>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <span>{market.ltv}%</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Liquidation Threshold</span>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <span>{market.liquidationThreshold}%</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Liquidation Penalty</span>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <span>{market.liquidationPenalty}%</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Reserve Factor</span>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <span>{market.reserveFactor}%</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Action Panel */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4>Supply {market.symbol}</h4>
                    <div className="flex gap-2">
                      <Input placeholder="0.0" type="number" />
                      <Button>Max</Button>
                    </div>
                    <Button className="w-full">Supply</Button>
                    <p className="text-sm text-muted-foreground">
                      You will earn {market.supplyAPY}% APY on your supplied {market.symbol}
                    </p>
                  </div>
                  <div className="space-y-4">
                    <h4>Borrow {market.symbol}</h4>
                    <div className="flex gap-2">
                      <Input placeholder="0.0" type="number" />
                      <Button>Max</Button>
                    </div>
                    <Button variant="outline" className="w-full">Borrow</Button>
                    <p className="text-sm text-muted-foreground">
                      You will pay {market.borrowAPR}% APR on your borrowed {market.symbol}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Charts Tab */}
          <TabsContent value="charts" className="space-y-6">
            {/* Time Range Selector */}
            <div className="flex justify-end gap-2">
              <Button
                size="sm"
                variant={timeRange === '7d' ? 'default' : 'outline'}
                onClick={() => setTimeRange('7d')}
              >
                7D
              </Button>
              <Button
                size="sm"
                variant={timeRange === '30d' ? 'default' : 'outline'}
                onClick={() => setTimeRange('30d')}
              >
                30D
              </Button>
              <Button
                size="sm"
                variant={timeRange === '90d' ? 'default' : 'outline'}
                onClick={() => setTimeRange('90d')}
              >
                90D
              </Button>
            </div>

            {/* APY/APR Chart */}
            <Card>
              <CardHeader>
                <CardTitle>APY/APR History</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={apyHistory[timeRange]}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="supplyAPY"
                      stroke="#10b981"
                      strokeWidth={2}
                      name="Supply APY"
                    />
                    <Line
                      type="monotone"
                      dataKey="borrowAPR"
                      stroke="#ef4444"
                      strokeWidth={2}
                      name="Borrow APR"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Utilization Rate Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Utilization Rate Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={utilizationHistory[timeRange]}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="rate"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      name="Utilization %"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Volume Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Supply/Borrow Volume</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={volumeData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="supply" fill="#10b981" name="Supply Volume (M)" />
                    <Bar dataKey="borrow" fill="#ef4444" name="Borrow Volume (M)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Address</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead className="text-right">Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentTransactions.map((tx, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <code className="text-sm">{tx.address}</code>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              tx.type === 'Supply' || tx.type === 'Repay'
                                ? 'default'
                                : 'secondary'
                            }
                          >
                            {tx.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{tx.amount}</TableCell>
                        <TableCell>{tx.value}</TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {tx.time}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Token Info Tab */}
          <TabsContent value="info">
            <Card>
              <CardHeader>
                <CardTitle>Token Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Token Name</p>
                    <p>{market.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Symbol</p>
                    <p>{market.symbol}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Decimals</p>
                    <p>{market.decimals}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Current Price</p>
                    <p>${market.price.toLocaleString()}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Contract Address</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 p-3 bg-muted rounded-lg text-sm">
                      {market.contract}
                    </code>
                    <Button size="sm" variant="outline" onClick={copyAddress}>
                      {copiedAddress ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(`https://etherscan.io/address/${market.contract}`, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm text-muted-foreground mb-3">Links</p>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Official Website
                    </Button>
                    <Button size="sm" variant="outline">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Whitepaper
                    </Button>
                    <Button size="sm" variant="outline">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      CoinGecko
                    </Button>
                    <Button size="sm" variant="outline">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      CoinMarketCap
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
