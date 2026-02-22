import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { PriceStat } from '../types';
import { cn } from '../lib/utils';

interface PriceStatsProps {
    stats: PriceStat[];
    currentPrice: number;
    isLoading?: boolean;
}

const StatCardSkeleton = () => (
    <div className="p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 animate-pulse">
        <div className="h-4 w-16 bg-zinc-200 dark:bg-zinc-700 rounded mb-3" />
        <div className="space-y-2">
            <div className="h-6 w-20 bg-zinc-200 dark:bg-zinc-700 rounded" />
            <div className="h-6 w-20 bg-zinc-200 dark:bg-zinc-700 rounded" />
        </div>
    </div>
);

interface StatCardProps {
    stat: PriceStat;
    currentPrice: number;
}

const StatCard = ({ stat, currentPrice }: StatCardProps) => {
    const highPrice = stat.high_price / 100;
    const lowPrice = stat.low_price / 100;
    const current = currentPrice / 100;
    
    const range = highPrice - lowPrice;
    const position = range > 0 ? ((current - lowPrice) / range) * 100 : 50;
    const clampedPosition = Math.max(0, Math.min(100, position));

    const isNearHigh = position > 70;
    const isNearLow = position < 30;

    return (
        <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
            <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    {stat.label}
                </span>
                <div className={cn(
                    "p-1 rounded-lg",
                    isNearHigh 
                        ? "bg-green-500/10 text-green-600 dark:text-green-400"
                        : isNearLow 
                            ? "bg-red-500/10 text-red-600 dark:text-red-400"
                            : "bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400"
                )}>
                    {isNearHigh ? (
                        <TrendingUp className="w-4 h-4" />
                    ) : isNearLow ? (
                        <TrendingDown className="w-4 h-4" />
                    ) : (
                        <Minus className="w-4 h-4" />
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">High</p>
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                        ${highPrice.toFixed(2)}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Low</p>
                    <p className="text-lg font-bold text-red-600 dark:text-red-400">
                        ${lowPrice.toFixed(2)}
                    </p>
                </div>
            </div>

            <div className="mt-4">
                <div className="h-2 bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 rounded-full relative">
                    <div 
                        className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-white rounded-full shadow-lg transition-all duration-300"
                        style={{ left: `calc(${clampedPosition}% - 8px)` }}
                        aria-label={`Current price position: ${clampedPosition.toFixed(0)}%`}
                    />
                </div>
                <div className="flex justify-between mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                    <span>Low</span>
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">
                        ${current.toFixed(2)}
                    </span>
                    <span>High</span>
                </div>
            </div>
        </div>
    );
};

export const PriceStats = ({ stats, currentPrice, isLoading }: PriceStatsProps) => {
    return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <div className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
                <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                    Price Statistics
                </h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Historical price range analysis
                </p>
            </div>
            
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <StatCardSkeleton key={i} />
                    ))
                ) : stats.length > 0 ? (
                    stats.map((stat) => (
                        <StatCard 
                            key={stat.interval} 
                            stat={stat} 
                            currentPrice={currentPrice}
                        />
                    ))
                ) : (
                    <div className="col-span-2 py-8 text-center text-zinc-500 dark:text-zinc-400">
                        No statistics available
                    </div>
                )}
            </div>
        </div>
    );
};
