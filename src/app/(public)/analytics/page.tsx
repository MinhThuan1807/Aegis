'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { ChartContainer, ChartConfig } from '@/src/components/ui/chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

// Mock data
const tvlData = [
  { date: 'Jan', value: 1200000 },
  { date: 'Feb', value: 1450000 },
  { date: 'Mar', value: 1650000 },
  { date: 'Apr', value: 1850000 },
  { date: 'May', value: 2100000 },
  { date: 'Jun', value: 2500000 },
];

const volumeData = [
  { date: 'Mon', supply: 450000, borrow: 320000 },
  { date: 'Tue', supply: 520000, borrow: 380000 },
  { date: 'Wed', supply: 480000, borrow: 350000 },
  { date: 'Thu', supply: 580000, borrow: 420000 },
  { date: 'Fri', supply: 620000, borrow: 460000 },
  { date: 'Sat', supply: 550000, borrow: 400000 },
  { date: 'Sun', supply: 490000, borrow: 360000 },
];

const userActivityData = [
  { date: 'Jan', users: 1200 },
  { date: 'Feb', users: 1800 },
  { date: 'Mar', users: 2400 },
  { date: 'Apr', users: 3200 },
  { date: 'May', users: 4100 },
  { date: 'Jun', users: 5000 },
];

const marketShareData = [
  { name: 'USDC', value: 35 },
  { name: 'ETH', value: 28 },
  { name: 'WBTC', value: 20 },
  { name: 'USDT', value: 12 },
  { name: 'Others', value: 5 },
];

const COLORS = ['#3b82f6', '#8b5cf6', '#f97316', '#10b981', '#6b7280'];

const topSupplyData = [
  { market: 'USDC', value: 620000 },
  { market: 'ETH', value: 580000 },
  { market: 'WBTC', value: 520000 },
  { market: 'USDT', value: 480000 },
  { market: 'DAI', value: 450000 },
];

const topBorrowData = [
  { market: 'ETH', value: 460000 },
  { market: 'WBTC', value: 420000 },
  { market: 'USDC', value: 400000 },
  { market: 'USDT', value: 360000 },
  { market: 'DAI', value: 320000 },
];

// Chart configurations
const tvlChartConfig = {
  value: {
    label: "Total Value Locked",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const volumeChartConfig = {
  supply: {
    label: "Supply",
    color: "hsl(var(--chart-2))",
  },
  borrow: {
    label: "Borrow",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

const userChartConfig = {
  users: {
    label: "Active Users",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

const marketChartConfig = {
  value: {
    label: "Market Share",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const topMarketsChartConfig = {
  value: {
    label: "Volume",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function AnalyticsPage() {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">
          Track protocol metrics and market performance
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="tvl" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tvl">TVL & Volume</TabsTrigger>
          <TabsTrigger value="user">User Activity</TabsTrigger>
          <TabsTrigger value="market">Market Share</TabsTrigger>
          <TabsTrigger value="top">Top Markets</TabsTrigger>
        </TabsList>

        {/* TVL & Volume Tab */}
        <TabsContent value="tvl" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Value Locked (TVL)</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={tvlChartConfig} className="h-[400px] w-full">
                <AreaChart data={tvlData}>
                  <defs>
                    <linearGradient id="colorTVL" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [`$${(value / 1000000).toFixed(2)}M`, 'TVL']}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#3b82f6"
                    fillOpacity={1}
                    fill="url(#colorTVL)"
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transaction Volume by Type</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={volumeChartConfig} className="h-[350px] w-full">
                <BarChart data={volumeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <Legend />
                  <Bar dataKey="supply" fill="#10b981" name="Supply" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="borrow" fill="#f59e0b" name="Borrow" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Activity Tab */}
        <TabsContent value="user" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Users Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={userChartConfig} className="h-[400px] w-full">
                <LineChart data={userActivityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
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
                    dataKey="users"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Active Users"
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Market Share Tab */}
        <TabsContent value="market" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Market Share by Asset</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={marketChartConfig} className="h-[400px] w-full">
                <PieChart>
                  <Pie
                    data={marketShareData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {marketShareData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => `${value}%`}
                  />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Top Markets Tab */}
        <TabsContent value="top" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Supply Markets</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={topMarketsChartConfig} className="h-[300px] w-full">
                  <BarChart data={topSupplyData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      type="number" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis 
                      type="category" 
                      dataKey="market" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => `$${(value / 1000).toFixed(0)}k`}
                    />
                    <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Borrow Markets</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={topMarketsChartConfig} className="h-[300px] w-full">
                  <BarChart data={topBorrowData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      type="number" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis 
                      type="category" 
                      dataKey="market" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => `$${(value / 1000).toFixed(0)}k`}
                    />
                    <Bar dataKey="value" fill="#f59e0b" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}