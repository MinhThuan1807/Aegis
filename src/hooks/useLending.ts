import { useState, useCallback } from 'react';
import { mockDataService } from '@/src/services/mockDataService';
import { useStore } from '@/src/store/useStore';
import { toast } from 'sonner';

export function useLending() {
  const [isLoading, setIsLoading] = useState(false);
  const { addTransaction, updateTransaction } = useStore();

  const supply = useCallback(async (tokenSymbol: string, amount: string) => {
    setIsLoading(true);
    
    try {
      const amountBigInt = mockDataService.parseAmount(amount);
      
      // Create pending transaction
      const pendingTx = {
        hash: 'pending',
        type: 'supply' as const,
        token: tokenSymbol,
        amount: amountBigInt,
        timestamp: Date.now(),
        status: 'pending' as const,
      };
      
      addTransaction(pendingTx);
      toast.loading('Supplying tokens...', { id: 'supply' });
      
      // Execute transaction
      const result = await mockDataService.supplyToken(tokenSymbol, amountBigInt);
      
      // Update transaction
      updateTransaction('pending', {
        hash: result.hash,
        status: result.status,
      });
      
      if (result.status === 'success') {
        toast.success(`Successfully supplied ${amount} ${tokenSymbol}`, { id: 'supply' });
        return result;
      } else {
        toast.error('Transaction failed', { id: 'supply' });
        throw new Error('Transaction failed');
      }
    } catch (error) {
      toast.error('Failed to supply tokens', { id: 'supply' });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [addTransaction, updateTransaction]);

  const borrow = useCallback(async (tokenSymbol: string, amount: string) => {
    setIsLoading(true);
    
    try {
      const amountBigInt = mockDataService.parseAmount(amount);
      
      const pendingTx = {
        hash: 'pending',
        type: 'borrow' as const,
        token: tokenSymbol,
        amount: amountBigInt,
        timestamp: Date.now(),
        status: 'pending' as const,
      };
      
      addTransaction(pendingTx);
      toast.loading('Borrowing tokens...', { id: 'borrow' });
      
      const result = await mockDataService.borrowToken(tokenSymbol, amountBigInt);
      
      updateTransaction('pending', {
        hash: result.hash,
        status: result.status,
      });
      
      if (result.status === 'success') {
        toast.success(`Successfully borrowed ${amount} ${tokenSymbol}`, { id: 'borrow' });
        return result;
      } else {
        toast.error('Transaction failed', { id: 'borrow' });
        throw new Error('Transaction failed');
      }
    } catch (error) {
      toast.error('Failed to borrow tokens', { id: 'borrow' });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [addTransaction, updateTransaction]);

  const withdraw = useCallback(async (tokenSymbol: string, amount: string) => {
    setIsLoading(true);
    
    try {
      const amountBigInt = mockDataService.parseAmount(amount);
      
      const pendingTx = {
        hash: 'pending',
        type: 'withdraw' as const,
        token: tokenSymbol,
        amount: amountBigInt,
        timestamp: Date.now(),
        status: 'pending' as const,
      };
      
      addTransaction(pendingTx);
      toast.loading('Withdrawing tokens...', { id: 'withdraw' });
      
      const result = await mockDataService.withdrawToken(tokenSymbol, amountBigInt);
      
      updateTransaction('pending', {
        hash: result.hash,
        status: result.status,
      });
      
      if (result.status === 'success') {
        toast.success(`Successfully withdrew ${amount} ${tokenSymbol}`, { id: 'withdraw' });
        return result;
      } else {
        toast.error('Transaction failed', { id: 'withdraw' });
        throw new Error('Transaction failed');
      }
    } catch (error) {
      toast.error('Failed to withdraw tokens', { id: 'withdraw' });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [addTransaction, updateTransaction]);

  const repay = useCallback(async (tokenSymbol: string, amount: string) => {
    setIsLoading(true);
    
    try {
      const amountBigInt = mockDataService.parseAmount(amount);
      
      const pendingTx = {
        hash: 'pending',
        type: 'repay' as const,
        token: tokenSymbol,
        amount: amountBigInt,
        timestamp: Date.now(),
        status: 'pending' as const,
      };
      
      addTransaction(pendingTx);
      toast.loading('Repaying loan...', { id: 'repay' });
      
      const result = await mockDataService.repayToken(tokenSymbol, amountBigInt);
      
      updateTransaction('pending', {
        hash: result.hash,
        status: result.status,
      });
      
      if (result.status === 'success') {
        toast.success(`Successfully repaid ${amount} ${tokenSymbol}`, { id: 'repay' });
        return result;
      } else {
        toast.error('Transaction failed', { id: 'repay' });
        throw new Error('Transaction failed');
      }
    } catch (error) {
      toast.error('Failed to repay loan', { id: 'repay' });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [addTransaction, updateTransaction]);

  return {
    supply,
    borrow,
    withdraw,
    repay,
    isLoading,
  };
}