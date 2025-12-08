import { useQuery } from '@tanstack/react-query';
import { fetchPriceChanges } from '../services/api';
import type { SearchParams } from '../types';

export const usePriceChanges = (params: SearchParams) => {
    return useQuery({
        queryKey: ['priceChanges', params],
        queryFn: () => fetchPriceChanges(params),
        placeholderData: (previousData) => previousData,
    });
};
