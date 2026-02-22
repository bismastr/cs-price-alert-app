export interface CaseItem {
    item_id: number;
    change_pct: number;
    name: string;
    old_sell_price: number;
    latest_sell_price: number;
    icon_url: string;
    sparkline?: number[];
}

export interface PriceChangesResponse {
    data: {
        items: CaseItem[];
        total: number;
    };
    success: boolean;
}

export type SortOption = 'gainers' | 'losers';

export interface SearchParams {
    query: string;
    page: number;
    sort_by: SortOption;
}

// Chart data types
export interface ChartDataPoint {
    timestamp: string;
    price: number;
    change_pct: number;
}

export interface ChartResponse {
    data: ChartDataPoint[];
    success: boolean;
}

export type ChartInterval = '7d' | '1m' | '3m' | '6m';

// Price stats types
export interface PriceStat {
    interval: string;
    label: string;
    high_price: number;
    low_price: number;
}

export interface PriceStatsResponse {
    data: PriceStat[];
    success: boolean;
}
