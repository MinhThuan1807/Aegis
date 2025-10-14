import { toast as sonnerToast } from 'sonner';
import { CheckCircle, XCircle, Loader2, ExternalLink } from 'lucide-react';

export const transactionToast = {
  pending: (message: string) => {
    sonnerToast.loading(message, {
      icon: <Loader2 className="h-4 w-4 animate-spin" />,
    });
  },

  success: (message: string, txHash?: string) => {
    sonnerToast.success(message, {
      icon: <CheckCircle className="h-4 w-4" />,
      action: txHash
        ? {
            label: 'View',
            onClick: () => window.open(`https://explorer.cedra.io/tx/${txHash}`, '_blank'),
          }
        : undefined,
    });
  },

  error: (message: string) => {
    sonnerToast.error(message, {
      icon: <XCircle className="h-4 w-4" />,
    });
  },
};