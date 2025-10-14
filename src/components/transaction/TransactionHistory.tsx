import { useStore } from '@/src/store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table';
import { Badge } from '@/src/components/ui/badge';
import { ExternalLink, ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { mockDataService } from '@/src/services/mockDataService';

export function TransactionHistory() {
  const { transactions } = useStore();

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'supply':
      case 'repay':
        return <ArrowUpRight className="h-4 w-4 text-green-500" />;
      case 'borrow':
      case 'withdraw':
        return <ArrowDownRight className="h-4 w-4 text-red-500" />;
      case 'swap':
        return <RefreshCw className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'success':
        return <Badge variant="default" className="bg-green-600">Success</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return null;
    }
  };

  if (transactions.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground">
            <p>No transactions yet</p>
            <p className="text-sm mt-2">Your transaction history will appear here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Token</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Hash</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow key={tx.hash}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getTypeIcon(tx.type)}
                    <span className="capitalize">{tx.type}</span>
                  </div>
                </TableCell>
                <TableCell>{tx.token}</TableCell>
                <TableCell className="text-right font-mono">
                  {mockDataService.formatAmount(tx.amount)}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {formatDistanceToNow(tx.timestamp, { addSuffix: true })}
                </TableCell>
                <TableCell>{getStatusBadge(tx.status)}</TableCell>
                <TableCell>
                  {tx.hash !== 'pending' ? (
                    <a
                      href={`https://explorer.cedra.io/tx/${tx.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 hover:underline"
                    >
                      <span className="font-mono text-xs">
                        {tx.hash.slice(0, 6)}...{tx.hash.slice(-4)}
                      </span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <span className="text-muted-foreground text-xs">Pending...</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
