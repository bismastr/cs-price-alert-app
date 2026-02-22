import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { CaseItem } from '../types';
import { cn } from '../lib/utils';

const STEAM_IMAGE_BASE_URL = 'https://community.fastly.steamstatic.com/economy/image/';

interface TopMoversProps {
    items: CaseItem[];
    type: 'gainers' | 'losers';
    isLoading?: boolean;
}

interface MoverCardProps {
    item: CaseItem;
    rank: number;
    type: 'gainers' | 'losers';
}

const MoverCardSkeleton = () => (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-100/50 dark:bg-zinc-800/50 animate-pulse">
        <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700" />
        <div className="w-12 h-12 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
        <div className="flex-1 space-y-2">
            <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-700 rounded" />
            <div className="h-3 w-16 bg-zinc-200 dark:bg-zinc-700 rounded" />
        </div>
        <div className="h-6 w-16 bg-zinc-200 dark:bg-zinc-700 rounded" />
    </div>
);

const MoverCard = ({ item, rank, type }: MoverCardProps) => {
    const isPositive = type === 'gainers';
    
    return (
        <Link
            to={`/item/${item.item_id}`}
            className={cn(
                "flex items-center gap-3 p-3 rounded-xl transition-all duration-200",
                "hover:scale-[1.02] hover:shadow-lg cursor-pointer",
                "bg-gradient-to-r",
                isPositive 
                    ? "from-green-500/5 to-green-500/10 hover:from-green-500/10 hover:to-green-500/20 dark:from-green-500/10 dark:to-green-500/5"
                    : "from-red-500/5 to-red-500/10 hover:from-red-500/10 hover:to-red-500/20 dark:from-red-500/10 dark:to-red-500/5"
            )}
            aria-label={`View details for ${item.name}`}
            tabIndex={0}
        >
            <div className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold",
                isPositive 
                    ? "bg-green-500/20 text-green-600 dark:text-green-400" 
                    : "bg-red-500/20 text-red-600 dark:text-red-400"
            )}>
                {rank}
            </div>
            
            <div className="w-12 h-12 flex-shrink-0 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
                <img
                    src={`${STEAM_IMAGE_BASE_URL}${item.icon_url}/64fx64f`}
                    alt={item.name}
                    className="w-full h-full object-contain"
                    loading="lazy"
                />
            </div>
            
            <div className="flex-1 min-w-0">
                <p className="font-medium text-zinc-900 dark:text-zinc-100 truncate text-sm">
                    {item.name}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    ${(item.latest_sell_price / 100).toFixed(2)}
                </p>
            </div>
            
            <div className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-semibold",
                isPositive 
                    ? "bg-green-500/20 text-green-600 dark:text-green-400"
                    : "bg-red-500/20 text-red-600 dark:text-red-400"
            )}>
                {isPositive ? (
                    <ArrowUpRight className="w-4 h-4" />
                ) : (
                    <ArrowDownRight className="w-4 h-4" />
                )}
                {Math.abs(item.change_pct).toFixed(2)}%
            </div>
        </Link>
    );
};

export const TopMovers = ({ items, type, isLoading }: TopMoversProps) => {
    const isGainers = type === 'gainers';

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <div className={cn(
                "flex items-center gap-3 px-5 py-4 border-b",
                isGainers 
                    ? "border-green-500/20 bg-gradient-to-r from-green-500/5 to-transparent"
                    : "border-red-500/20 bg-gradient-to-r from-red-500/5 to-transparent"
            )}>
                <div className={cn(
                    "p-2 rounded-xl",
                    isGainers 
                        ? "bg-green-500/20 text-green-600 dark:text-green-400"
                        : "bg-red-500/20 text-red-600 dark:text-red-400"
                )}>
                    {isGainers ? (
                        <TrendingUp className="w-5 h-5" />
                    ) : (
                        <TrendingDown className="w-5 h-5" />
                    )}
                </div>
                <div>
                    <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                        Top 10 {isGainers ? 'Gainers' : 'Losers'}
                    </h2>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        24h price change
                    </p>
                </div>
            </div>
            
            <div className="p-3 space-y-2">
                {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <MoverCardSkeleton key={i} />
                    ))
                ) : items.length > 0 ? (
                    items.map((item, index) => (
                        <MoverCard 
                            key={item.item_id} 
                            item={item} 
                            rank={index + 1} 
                            type={type}
                        />
                    ))
                ) : (
                    <p className="text-center py-8 text-zinc-500 dark:text-zinc-400">
                        No data available
                    </p>
                )}
            </div>
        </div>
    );
};
