"use client";
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { Progress } from '@/src/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import { ChartContainer, ChartConfig } from '@/src/components/ui/chart';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  Plus
} from 'lucide-react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/components/ui/table';
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

// Chart configurations
const portfolioChartConfig = {
  ETH: {
    label: "ETH",
    color: "#627EEA",
  },
  USDC: {
    label: "USDC",
    color: "#2775CA",
  },
  Other: {
    label: "Other",
    color: "#8B5CF6",
  },
} satisfies ChartConfig;

const earningsChartConfig = {
  earnings: {
    label: "Supply Earnings",
    color: "#10b981",
  },
  borrows: {
    label: "Borrow Costs",
    color: "#ef4444",
  },
} satisfies ChartConfig;

export default function Portfolio() {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for portfolio overview
  const portfolioStats = [
    {
      title: 'Net Worth',
      value: '$12,485.50',
      change: '+5.2%',
      changeValue: '+$618.24',
      icon: <Wallet className="h-5 w-5" />,
      positive: true
    },
    {
      title: 'Total Supplied',
      value: '$8,250.00',
      change: '+2.1%',
      changeValue: '+$169.85',
      icon: <TrendingUp className="h-5 w-5" />,
      positive: true
    },
    {
      title: 'Total Borrowed',
      value: '$3,180.75',
      change: '-1.5%',
      changeValue: '-$48.47',
      icon: <TrendingDown className="h-5 w-5" />,
      positive: false
    },
    {
      title: 'Net APY',
      value: '4.85%',
      change: '+0.3%',
      changeValue: '+0.3%',
      icon: <DollarSign className="h-5 w-5" />,
      positive: true
    }
  ];

  // Supply positions mock data
  const supplyPositions = [
    {
      token: 'ETH',
      icon: '🔷',
      amount: '2.5',
      valueUSD: '$5,850.00',
      apy: 4.25,
      earnings: '$24.88',
      dailyEarnings: '$0.68'
    },
    {
      token: 'USDC',
      icon: '💵',
      amount: '2,400',
      valueUSD: '$2,400.00',
      apy: 8.75,
      earnings: '$21.00',
      dailyEarnings: '$0.58'
    }
  ];

  // Borrow positions mock data
  const borrowPositions = [
    {
      token: 'DAI',
      icon: '💰',
      amount: '2,000',
      valueUSD: '$2,000.00',
      apr: 6.50,
      cost: '$13.00',
      dailyCost: '$0.36',
      healthFactor: 2.45
    },
    {
      token: 'USDT',
      icon: '💵',
      amount: '1,180.75',
      valueUSD: '$1,180.75',
      apr: 7.25,
      cost: '$8.56',
      dailyCost: '$0.23',
      healthFactor: 2.45
    }
  ];

  // Calculate health factor
  const calculateHealthFactor = () => {
    const totalSupply = 8250;
    const totalBorrow = 3180.75;
    const collateralFactor = 0.75; // 75% LTV
    return ((totalSupply * collateralFactor) / totalBorrow).toFixed(2);
  };

  const healthFactor = parseFloat(calculateHealthFactor());
  
  const getHealthColor = (hf: number) => {
    if (hf >= 2.0) return 'text-green-500';
    if (hf >= 1.5) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getHealthStatus = (hf: number) => {
    if (hf >= 2.0) return 'Safe';
    if (hf >= 1.5) return 'Warning';
    return 'Danger';
  };

  // Portfolio composition data for pie chart
  const portfolioComposition = [
    { name: 'ETH', value: 5850, color: '#627EEA' },
    { name: 'USDC', value: 2400, color: '#2775CA' },
    { name: 'Other', value: 235.5, color: '#8B5CF6' }
  ];

  // Earnings history data for line chart
  const earningsHistory = [
    { date: 'Oct 10', earnings: 45, borrows: 18 },
    { date: 'Oct 11', earnings: 48, borrows: 19 },
    { date: 'Oct 12', earnings: 52, borrows: 20 },
    { date: 'Oct 13', earnings: 49, borrows: 21 },
    { date: 'Oct 14', earnings: 55, borrows: 22 },
    { date: 'Oct 15', earnings: 58, borrows: 21 },
    { date: 'Oct 16', earnings: 61, borrows: 20 },
    { date: 'Oct 17', earnings: 65, borrows: 22 }
  ];

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl mb-2">Portfolio</h1>
            <p className="text-muted-foreground">
              Track your positions, earnings, and health factor
            </p>
          </div>
          <Button size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {portfolioStats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={stat.positive ? 'text-green-500' : 'text-red-500'}>
                  {stat.icon}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl mb-1">{stat.value}</div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={stat.positive ? 'default' : 'destructive'}
                    className="text-xs"
                  >
                    {stat.change}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {stat.changeValue} this month
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Health Factor Monitor */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Health Factor</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Monitor your account safety and liquidation risk
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className={`text-3xl ${getHealthColor(healthFactor)}`}>
                  {healthFactor}
                </div>
                <Badge 
                  variant={healthFactor >= 2.0 ? 'default' : healthFactor >= 1.5 ? 'secondary' : 'destructive'}
                >
                  {getHealthStatus(healthFactor)}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Liquidation Risk</span>
                  <span className="text-muted-foreground">
                    {healthFactor >= 2.0 ? 'Low' : healthFactor >= 1.5 ? 'Medium' : 'High'}
                  </span>
                </div>
                <Progress 
                  value={Math.min((healthFactor / 3) * 100, 100)} 
                  className="h-2"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-muted-foreground">Collateral Value</p>
                  <p className="text-lg">$8,250.00</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Borrow Limit</p>
                  <p className="text-lg">$6,187.50</p>
                  <p className="text-xs text-muted-foreground">(75% LTV)</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Available to Borrow</p>
                  <p className="text-lg text-green-500">$3,006.75</p>
                </div>
              </div>

              {healthFactor < 2.0 && (
                <div className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg mt-4">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm">
                      Your health factor is below recommended levels. Consider adding more collateral or repaying some debt.
                    </p>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline">
                        <Plus className="h-3 w-3 mr-1" />
                        Add Collateral
                      </Button>
                      <Button size="sm" variant="outline">
                        Repay Debt
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="supply">Supply Positions</TabsTrigger>
            <TabsTrigger value="borrow">Borrow Positions</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Portfolio Composition */}
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Composition</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={portfolioChartConfig} className="h-[300px] w-full">
                    <PieChart>
                      <Pie
                        data={portfolioComposition}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {portfolioComposition.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => `$${value.toLocaleString()}`}
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                    </PieChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Earnings History */}
              <Card>
                <CardHeader>
                  <CardTitle>Earnings History</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={earningsChartConfig} className="h-[300px] w-full">
                    <LineChart data={earningsHistory}>
                      <CartesianGrid 
                        strokeDasharray="3 3" 
                        stroke="hsl(var(--border))"
                        opacity={0.3} 
                      />
                      <XAxis 
                        dataKey="date"
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                      />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="earnings" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        name="Supply Earnings"
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="borrows" 
                        stroke="#ef4444" 
                        strokeWidth={2}
                        name="Borrow Costs"
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button className="h-auto py-4 flex flex-col gap-2">
                    <ArrowUpRight className="h-5 w-5" />
                    Supply More
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                    <ArrowDownLeft className="h-5 w-5" />
                    Withdraw
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                    <TrendingDown className="h-5 w-5" />
                    Borrow
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                    <RefreshCw className="h-5 w-5" />
                    Repay
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Supply Positions Tab */}
          <TabsContent value="supply">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Supply Positions</CardTitle>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Supply
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Asset</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Value (USD)</TableHead>
                      <TableHead>APY</TableHead>
                      <TableHead>Earned</TableHead>
                      <TableHead>Daily Earnings</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {supplyPositions.map((position, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{position.icon}</span>
                            <span>{position.token}</span>
                          </div>
                        </TableCell>
                        <TableCell>{position.amount}</TableCell>
                        <TableCell>{position.valueUSD}</TableCell>
                        <TableCell>
                          <Badge variant="default" className="bg-green-500">
                            {position.apy}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-green-500">
                          {position.earnings}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {position.dailyEarnings}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline">
                              Withdraw
                            </Button>
                            <Button size="sm">
                              Supply More
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Supplied</p>
                      <p className="text-xl">$8,250.00</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Earned</p>
                      <p className="text-xl text-green-500">$45.88</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Avg APY</p>
                      <p className="text-xl">6.02%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Borrow Positions Tab */}
          <TabsContent value="borrow">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Borrow Positions</CardTitle>
                  <Button size="sm" variant="outline">
                    <TrendingDown className="h-4 w-4 mr-2" />
                    Borrow
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Asset</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Value (USD)</TableHead>
                      <TableHead>APR</TableHead>
                      <TableHead>Total Cost</TableHead>
                      <TableHead>Daily Cost</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {borrowPositions.map((position, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{position.icon}</span>
                            <span>{position.token}</span>
                          </div>
                        </TableCell>
                        <TableCell>{position.amount}</TableCell>
                        <TableCell>{position.valueUSD}</TableCell>
                        <TableCell>
                          <Badge variant="destructive">
                            {position.apr}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-red-500">
                          {position.cost}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {position.dailyCost}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm">
                              Repay
                            </Button>
                            <Button size="sm" variant="outline">
                              Borrow More
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Borrowed</p>
                      <p className="text-xl">$3,180.75</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Cost</p>
                      <p className="text-xl text-red-500">$21.56</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Avg APR</p>
                      <p className="text-xl">6.82%</p>
                    </div>
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