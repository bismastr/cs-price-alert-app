import { useQuery } from '@tanstack/react-query';
import { fetchTopGainers, fetchTopLosers } from '../services/api';

export const useTopGainers = (limit: number = 10) => {
    return useQuery({
        queryKey: ['topGainers', limit],
        queryFn: () => fetchTopGainers(limit),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

export const useTopLosers = (limit: number = 10) => {
    return useQuery({
        queryKey: ['topLosers', limit],
        queryFn: () => fetchTopLosers(limit),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};
