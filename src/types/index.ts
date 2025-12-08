export interface CaseItem {
    item_id: number;
    change_pct: number;
    name: string;
    old_sell_price: number;
    latest_sell_price: number;
    icon_url: string;
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
