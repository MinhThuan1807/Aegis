'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/src/components/ui/dialog';
import {
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  Download,
  Search,
  ExternalLink,
  Filter,
  Calendar
} from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/src/components/ui/pagination';

type TransactionType = 'supply' | 'withdraw' | 'borrow' | 'repay' | 'swap';
type TransactionStatus = 'confirmed' | 'pending' | 'failed';

interface Transaction {
  id: string;
  type: TransactionType;
  token: string;
  icon: string;
  amount: string;
  valueUSD: string;
  txHash: string;
  timestamp: string;
  status: TransactionStatus;
  gasFee: string;
  apy?: string;
}

export default function TransactionHistory() {
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock transaction data
  const allTransactions: Transaction[] = [
    {
      id: '1',
      type: 'supply',
      token: 'ETH',
      icon: '🔷',
      amount: '2.5',
      valueUSD: '$5,850.00',
      txHash: '0x1234...5678',
      timestamp: '2024-10-17 14:23:11',
      status: 'confirmed',
      gasFee: '$2.34',
      apy: '4.25%'
    },
    {
      id: '2',
      type: 'borrow',
      token: 'DAI',
      icon: '💰',
      amount: '2,000',
      valueUSD: '$2,000.00',
      txHash: '0xabcd...efgh',
      timestamp: '2024-10-17 12:15:45',
      status: 'confirmed',
      gasFee: '$1.89',
      apy: '6.50%'
    },
    {
      id: '3',
      type: 'supply',
      token: 'USDC',
      icon: '💵',
      amount: '2,400',
      valueUSD: '$2,400.00',
      txHash: '0x9876...4321',
      timestamp: '2024-10-16 09:45:22',
      status: 'confirmed',
      gasFee: '$1.52',
      apy: '8.75%'
    },
    {
      id: '4',
      type: 'repay',
      token: 'DAI',
      icon: '💰',
      amount: '500',
      valueUSD: '$500.00',
      txHash: '0xdef1...2345',
      timestamp: '2024-10-15 16:30:18',
      status: 'confirmed',
      gasFee: '$1.23'
    },
    {
      id: '5',
      type: 'withdraw',
      token: 'USDC',
      icon: '💵',
      amount: '1,000',
      valueUSD: '$1,000.00',
      txHash: '0x5678...9abc',
      timestamp: '2024-10-15 11:20:05',
      status: 'confirmed',
      gasFee: '$1.67'
    },
    {
      id: '6',
      type: 'swap',
      token: 'ETH → USDC',
      icon: '🔄',
      amount: '0.5',
      valueUSD: '$1,170.00',
      txHash: '0xfedc...ba98',
      timestamp: '2024-10-14 14:55:33',
      status: 'confirmed',
      gasFee: '$3.45'
    },
    {
      id: '7',
      type: 'borrow',
      token: 'USDT',
      icon: '💵',
      amount: '1,180.75',
      valueUSD: '$1,180.75',
      txHash: '0x1111...2222',
      timestamp: '2024-10-13 08:12:47',
      status: 'confirmed',
      gasFee: '$1.98'
    },
    {
      id: '8',
      type: 'supply',
      token: 'LINK',
      icon: '🔗',
      amount: '150',
      valueUSD: '$2,227.50',
      txHash: '0x3333...4444',
      timestamp: '2024-10-12 19:42:15',
      status: 'confirmed',
      gasFee: '$2.11'
    },
    {
      id: '9',
      type: 'pending',
      token: 'ETH',
      icon: '🔷',
      amount: '0.25',
      valueUSD: '$585.00',
      txHash: '0x5555...6666',
      timestamp: '2024-10-17 15:01:23',
      status: 'pending',
      gasFee: '$2.05',
      apy: '4.25%'
    } as any,
    {
      id: '10',
      type: 'repay',
      token: 'USDT',
      icon: '💵',
      amount: '200',
      valueUSD: '$200.00',
      txHash: '0x7777...8888',
      timestamp: '2024-10-11 13:28:56',
      status: 'confirmed',
      gasFee: '$1.34'
    }
  ];

  // Filter transactions
  const filteredTransactions = allTransactions.filter((tx) => {
    const matchesSearch = 
      tx.txHash.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.token.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || tx.type === filterType;
    const matchesStatus = filterStatus === 'all' || tx.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const getTypeIcon = (type: TransactionType) => {
    switch (type) {
      case 'supply':
        return <ArrowUpRight className="h-4 w-4" />;
      case 'withdraw':
        return <ArrowDownLeft className="h-4 w-4" />;
      case 'borrow':
        return <ArrowDownLeft className="h-4 w-4" />;
      case 'repay':
        return <ArrowUpRight className="h-4 w-4" />;
      case 'swap':
        return <RefreshCw className="h-4 w-4" />;
    }
  };

  const getTypeBadgeVariant = (type: TransactionType) => {
    switch (type) {
      case 'supply':
      case 'repay':
        return 'default';
      case 'withdraw':
      case 'borrow':
        return 'secondary';
      case 'swap':
        return 'outline';
    }
  };

  const getStatusBadge = (status: TransactionStatus) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="default" className="bg-green-500">Confirmed</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
    }
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Type', 'Token', 'Amount', 'Value (USD)', 'Status', 'Gas Fee', 'Tx Hash'];
    const rows = filteredTransactions.map(tx => [
      tx.timestamp,
      tx.type,
      tx.token,
      tx.amount,
      tx.valueUSD,
      tx.status,
      tx.gasFee,
      tx.txHash
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aegis-transactions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl mb-2">Transaction History</h1>
            <p className="text-muted-foreground">
              View and manage all your protocol transactions
            </p>
          </div>
          <Button onClick={exportToCSV} size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by token or tx hash..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              {/* Type Filter */}
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Type" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="supply">Supply</SelectItem>
                  <SelectItem value="withdraw">Withdraw</SelectItem>
                  <SelectItem value="borrow">Borrow</SelectItem>
                  <SelectItem value="repay">Repay</SelectItem>
                  <SelectItem value="swap">Swap</SelectItem>
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <SelectValue placeholder="Status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Active Filters Summary */}
            {(searchTerm || filterType !== 'all' || filterStatus !== 'all') && (
              <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {searchTerm && (
                  <Badge variant="outline">Search: {searchTerm}</Badge>
                )}
                {filterType !== 'all' && (
                  <Badge variant="outline">Type: {filterType}</Badge>
                )}
                {filterStatus !== 'all' && (
                  <Badge variant="outline">Status: {filterStatus}</Badge>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setSearchTerm('');
                    setFilterType('all');
                    setFilterStatus('all');
                  }}
                >
                  Clear all
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              {filteredTransactions.length} Transaction{filteredTransactions.length !== 1 ? 's' : ''}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Token</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Value (USD)</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Gas Fee</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTransactions.length > 0 ? (
                  paginatedTransactions.map((tx) => (
                    <TableRow 
                      key={tx.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setSelectedTx(tx)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTypeIcon(tx.type)}
                          <Badge variant={getTypeBadgeVariant(tx.type)}>
                            {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{tx.icon}</span>
                          <span>{tx.token}</span>
                        </div>
                      </TableCell>
                      <TableCell>{tx.amount}</TableCell>
                      <TableCell>{tx.valueUSD}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {tx.timestamp}
                      </TableCell>
                      <TableCell>{getStatusBadge(tx.status)}</TableCell>
                      <TableCell className="text-muted-foreground">{tx.gasFee}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(`https://etherscan.io/tx/${tx.txHash}`, '_blank');
                          }}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No transactions found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        size="default"
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                          size="default"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        size="default"
                      />
                    </PaginationItem>

                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Transaction Details Modal */}
        <Dialog open={!!selectedTx} onOpenChange={() => setSelectedTx(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Transaction Details</DialogTitle>
            </DialogHeader>
            {selectedTx && (
              <div className="space-y-6">
                {/* Status Banner */}
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    {getTypeIcon(selectedTx.type)}
                    <div>
                      <p className="font-medium">
                        {selectedTx.type.charAt(0).toUpperCase() + selectedTx.type.slice(1)} Transaction
                      </p>
                      <p className="text-sm text-muted-foreground">{selectedTx.timestamp}</p>
                    </div>
                  </div>
                  {getStatusBadge(selectedTx.status)}
                </div>

                {/* Transaction Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Token</p>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{selectedTx.icon}</span>
                      <p>{selectedTx.token}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Amount</p>
                    <p>{selectedTx.amount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Value (USD)</p>
                    <p>{selectedTx.valueUSD}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Gas Fee</p>
                    <p>{selectedTx.gasFee}</p>
                  </div>
                  {selectedTx.apy && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {selectedTx.type === 'supply' ? 'APY' : 'APR'}
                      </p>
                      <Badge variant={selectedTx.type === 'supply' ? 'default' : 'destructive'}>
                        {selectedTx.apy}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Transaction Hash */}
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Transaction Hash</p>
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                    <code className="flex-1 text-sm">{selectedTx.txHash}</code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        window.open(`https://etherscan.io/tx/${selectedTx.txHash}`, '_blank');
                      }}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View on Etherscan
                    </Button>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="pt-4 border-t text-sm text-muted-foreground">
                  <p>
                    This transaction was {selectedTx.status === 'confirmed' ? 'confirmed' : 'submitted'} on {selectedTx.timestamp}
                  </p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
