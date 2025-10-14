import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/src/components/ui/dialog';
import { Button } from '@/src/components/ui/button';
import { Loader2, CheckCircle, XCircle, ExternalLink } from 'lucide-react';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: 'pending' | 'success' | 'failed';
  txHash?: string;
  type?: 'supply' | 'borrow' | 'withdraw' | 'repay' | 'swap';
  amount?: string;
  token?: string;
}

export function TransactionModal({
  isOpen,
  onClose,
  status,
  txHash,
  type,
  amount,
  token,
}: TransactionModalProps) {
  const explorerUrl = txHash ? `https://explorer.cedra.io/tx/${txHash}` : '#';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Transaction Status</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          {status === 'pending' && (
            <>
              <Loader2 className="h-16 w-16 animate-spin text-blue-500" />
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold">Processing Transaction</h3>
                <p className="text-sm text-muted-foreground">
                  Please wait while your transaction is being processed...
                </p>
              </div>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="relative">
                <CheckCircle className="h-16 w-16 text-green-500" />
                <div className="absolute inset-0 animate-ping">
                  <CheckCircle className="h-16 w-16 text-green-500 opacity-75" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold text-green-600">Transaction Successful!</h3>
                {type && amount && token && (
                  <p className="text-sm text-muted-foreground">
                    Successfully {type}ed {amount} {token}
                  </p>
                )}
              </div>
            </>
          )}

          {status === 'failed' && (
            <>
              <XCircle className="h-16 w-16 text-red-500" />
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold text-red-600">Transaction Failed</h3>
                <p className="text-sm text-muted-foreground">
                  Your transaction could not be completed. Please try again.
                </p>
              </div>
            </>
          )}

          {txHash && txHash !== 'pending' && (
            <div className="w-full pt-4 space-y-2">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm text-muted-foreground">Transaction Hash</span>
                <code className="text-xs font-mono">
                  {txHash.slice(0, 8)}...{txHash.slice(-6)}
                </code>
              </div>
              
              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.open(explorerUrl, '_blank')}
              >
                View on Explorer
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {status !== 'pending' && (
          <div className="flex justify-end">
            <Button onClick={onClose}>Close</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}