import type { SortOption } from '../types';

interface SortSelectProps {
    value: SortOption;
    onChange: (value: SortOption) => void;
}

export const SortSelect = ({ value, onChange }: SortSelectProps) => {
    return (
        <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm font-medium text-zinc-700 dark:text-zinc-300 whitespace-nowrap">
                Sort by:
            </label>
            <select
                id="sort"
                value={value}
                onChange={(e) => onChange(e.target.value as SortOption)}
                className="block w-full pl-3 pr-10 py-2 text-base border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
            >
                <option value="gainers">Top Gainers</option>
                <option value="losers">Top Losers</option>
            </select>
        </div>
    );
};
