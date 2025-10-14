import { useState, useCallback } from 'react';
import { mockDataService } from '@/src/services/mockDataService';
import { useStore } from '@/src/store/useStore';
import { toast } from 'sonner';

export function useMarkets() {
  const { markets, setMarkets } = useStore();
  const [isLoading, setIsLoading] = useState(false);

  const fetchMarkets = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const data = await mockDataService.getMarkets();
      setMarkets(data);
    } catch (error) {
      toast.error('Failed to fetch markets');
    } finally {
      setIsLoading(false);
    }
  }, [setMarkets]);

  return {
    markets,
    fetchMarkets,
    isLoading,
  };
}
