import { useQuery } from '@tanstack/react-query';
import { fetchPriceChart, fetchPriceStats, fetchItemById } from '../services/api';
import type { ChartInterval } from '../types';

export const usePriceChart = (itemId: number, interval: ChartInterval = '3m') => {
    return useQuery({
        queryKey: ['priceChart', itemId, interval],
        queryFn: () => fetchPriceChart(itemId, interval),
        enabled: !!itemId,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

export const usePriceStats = (itemId: number) => {
    return useQuery({
        queryKey: ['priceStats', itemId],
        queryFn: () => fetchPriceStats(itemId),
        enabled: !!itemId,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

export const useItem = (itemId: number) => {
    return useQuery({
        queryKey: ['item', itemId],
        queryFn: () => fetchItemById(itemId),
        enabled: !!itemId,
    });
};
