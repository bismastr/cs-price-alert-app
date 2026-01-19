import axios from 'axios';
import type { PriceChangesResponse, SearchParams } from '../types';

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
