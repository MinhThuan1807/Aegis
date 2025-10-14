import { useState, useCallback } from 'react';
import { mockDataService } from '@/src/services/mockDataService';
import { useStore } from '@/src/store/useStore';
import { toast } from 'sonner';

export function useSwap() {
  const [isLoading, setIsLoading] = useState(false);
  const [quote, setQuote] = useState<{
    rate: number;
    priceImpact: number;
    estimatedOutput: bigint;
  } | null>(null);
  
  const { addTransaction, updateTransaction } = useStore();

  const getQuote = useCallback(async (
    fromToken: string,
    toToken: string,
    amount: string
  ) => {
    setIsLoading(true);
    
    try {
      const amountBigInt = mockDataService.parseAmount(amount);
      const result = await mockDataService.getSwapQuote(
        fromToken,
        toToken,
        amountBigInt
      );
      
      setQuote(result);
      return result;
    } catch (error) {
      toast.error('Failed to get quote');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const executeSwap = useCallback(async (
    fromToken: string,
    toToken: string,
    amount: string,
    minOutput: string
  ) => {
    setIsLoading(true);
    
    try {
      const amountBigInt = mockDataService.parseAmount(amount);
      const minOutputBigInt = mockDataService.parseAmount(minOutput);
      
      const pendingTx = {
        hash: 'pending',
        type: 'swap' as const,
        token: `${fromToken}-${toToken}`,
        amount: amountBigInt,
        timestamp: Date.now(),
        status: 'pending' as const,
      };
      
      addTransaction(pendingTx);
      toast.loading('Swapping tokens...', { id: 'swap' });
      
      const result = await mockDataService.executeSwap(
        fromToken,
        toToken,
        amountBigInt,
        minOutputBigInt
      );
      
      updateTransaction('pending', {
        hash: result.hash,
        status: result.status,
      });
      
      if (result.status === 'success') {
        toast.success(`Successfully swapped ${amount} ${fromToken}`, { id: 'swap' });
        return result;
      } else {
        toast.error('Swap failed', { id: 'swap' });
        throw new Error('Swap failed');
      }
    } catch (error) {
      toast.error('Failed to swap tokens', { id: 'swap' });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [addTransaction, updateTransaction]);

  return {
    getQuote,
    executeSwap,
    quote,
    isLoading,
  };
}