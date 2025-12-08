import { ArrowDown, ArrowUp } from 'lucide-react';
import type { CaseItem } from '../types';
import { cn } from '../lib/utils';

const STEAM_IMAGE_BASE_URL = 'https://community.fastly.steamstatic.com/economy/image/';

interface CaseCardProps {
    item: CaseItem;
}

export const CaseCard = ({ item }: CaseCardProps) => {
    const isPositive = item.change_pct >= 0;

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-4 flex flex-col gap-4 hover:shadow-md transition-shadow">
            <div className="aspect-square relative bg-zinc-100 dark:bg-zinc-800 rounded-lg overflow-hidden flex items-center justify-center p-4">
                <img
                    src={`${STEAM_IMAGE_BASE_URL}${item.icon_url}/128fx128f`}
                    alt={item.name}
                    className="w-full h-full object-contain hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                />
            </div>

            <div className="flex flex-col gap-2">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-2 min-h-12">
                    {item.name}
                </h3>
                <div className="flex items-end justify-between mt-auto">
                    <div className="flex flex-col">
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">Price</span>
                        <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                            ${(item.latest_sell_price / 100).toFixed(2)}
                        </span>
                    </div>

                    <div className={cn(
                        "flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium",
                        isPositive
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    )}>
                        {isPositive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                        {Math.abs(item.change_pct).toFixed(2)}%
                    </div>
                </div>
            </div>
        </div>
    );
};
