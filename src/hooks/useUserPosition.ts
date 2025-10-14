import { useState, useCallback } from 'react';
import { mockDataService } from '@/src/services/mockDataService';
import { useStore } from '@/src/store/useStore';
import { toast } from 'sonner';

export function useUserPosition() {
  const { wallet, userPosition, setUserPosition } = useStore();
  const [isLoading, setIsLoading] = useState(false);

  const fetchUserPosition = useCallback(async () => {
    if (!wallet.address) return;
    
    setIsLoading(true);
    
    try {
      const position = await mockDataService.getUserPosition(wallet.address);
      setUserPosition(position);
    } catch (error) {
      toast.error('Failed to fetch user position');
    } finally {
      setIsLoading(false);
    }
  }, [wallet.address, setUserPosition]);

  return {
    userPosition,
    fetchUserPosition,
    isLoading,
  };
}