import axios from 'axios';
import type { 
    PriceChangesResponse, 
    SearchParams, 
    ChartResponse, 
    ChartInterval,
    PriceStatsResponse 
} from '../types';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const api = axios.create({
    baseURL: API_URL,
});

export const fetchPriceChanges = async (params: SearchParams): Promise<PriceChangesResponse> => {
    const { data } = await api.get<PriceChangesResponse>('/api/price-changes/search', {
        params,
    });
    return data;
};

export const fetchTopGainers = async (limit: number = 10): Promise<PriceChangesResponse> => {
    const { data } = await api.get<PriceChangesResponse>('/api/price-changes/search', {
        params: { sort_by: 'gainers', page: 1, limit },
    });
    return data;
};

export const fetchTopLosers = async (limit: number = 10): Promise<PriceChangesResponse> => {
    const { data } = await api.get<PriceChangesResponse>('/api/price-changes/search', {
        params: { sort_by: 'losers', page: 1, limit },
    });
    return data;
};

export const fetchPriceChart = async (
    itemId: number, 
    interval: ChartInterval = '3m'
): Promise<ChartResponse> => {
    const { data } = await api.get<ChartResponse>('/api/price-changes/chart', {
        params: { item_id: itemId, interval },
    });
    return data;
};

export const fetchPriceStats = async (itemId: number): Promise<PriceStatsResponse> => {
    const { data } = await api.get<PriceStatsResponse>('/api/price-changes/price-stats', {
        params: { item_id: itemId },
    });
    return data;
};

export const fetchItemById = async (itemId: number): Promise<PriceChangesResponse> => {
    const { data } = await api.get<PriceChangesResponse>('/api/price-changes/search', {
        params: { item_id: itemId },
    });
    return data;
};
