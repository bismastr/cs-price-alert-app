import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Loader2, AlertCircle } from 'lucide-react';
import { usePriceChart, usePriceStats, useItem } from '../hooks/useItemDetails';
import { PriceChart } from '../components/PriceChart';
import { PriceStats } from '../components/PriceStats';
import type { ChartInterval } from '../types';
import { cn } from '../lib/utils';

const STEAM_IMAGE_BASE_URL = 'https://community.fastly.steamstatic.com/economy/image/';

export const ItemDetailPage = () => {
    const { itemId } = useParams<{ itemId: string }>();
    const [chartInterval, setChartInterval] = useState<ChartInterval>('3m');
    
    const numericItemId = Number(itemId);
    
    const { data: itemData, isLoading: isItemLoading, isError: isItemError } = useItem(numericItemId);
    const { data: chartData, isLoading: isChartLoading } = usePriceChart(numericItemId, chartInterval);
    const { data: statsData, isLoading: isStatsLoading } = usePriceStats(numericItemId);

    const item = itemData?.data.items?.[0];

    if (isItemLoading) {
        return (
            <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                <p className="text-zinc-500 dark:text-zinc-400">Loading item details...</p>
            </div>
        );
    }

    if (isItemError || !item) {
        return (
            <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center">
                <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-full mb-4">
                    <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-zinc-900 dark:text-zinc-100">
                    Item not found
                </h3>
                <p className="text-zinc-500 dark:text-zinc-400 mb-4">
                    The item you're looking for doesn't exist or has been removed.
                </p>
                <Link 
                    to="/"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>
            </div>
        );
    }

    const isPositive = item.change_pct >= 0;

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link 
                        to="/"
                        className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                        aria-label="Back to home"
                        tabIndex={0}
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Back</span>
                    </Link>
                    
                    <a
                        href={`https://steamcommunity.com/market/listings/730/${encodeURIComponent(item.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-sm font-medium"
                        aria-label="View on Steam Market"
                        tabIndex={0}
                    >
                        <ExternalLink className="w-4 h-4" />
                        Steam Market
                    </a>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Item Header */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                        <div className="w-40 h-40 flex-shrink-0 bg-zinc-100 dark:bg-zinc-800 rounded-2xl p-4 flex items-center justify-center">
                            <img
                                src={`${STEAM_IMAGE_BASE_URL}${item.icon_url}/256fx256f`}
                                alt={item.name}
                                className="w-full h-full object-contain"
                            />
                        </div>
                        
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                                {item.name}
                            </h1>
                            
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4">
                                <div className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Current Price</p>
                                    <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                                        ${(item.latest_sell_price / 100).toFixed(2)}
                                    </p>
                                </div>
                                
                                <div className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Previous Price</p>
                                    <p className="text-2xl font-bold text-zinc-500 dark:text-zinc-400">
                                        ${(item.old_sell_price / 100).toFixed(2)}
                                    </p>
                                </div>
                                
                                <div className={cn(
                                    "px-4 py-2 rounded-xl",
                                    isPositive 
                                        ? "bg-green-500/10"
                                        : "bg-red-500/10"
                                )}>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">24h Change</p>
                                    <p className={cn(
                                        "text-2xl font-bold",
                                        isPositive 
                                            ? "text-green-600 dark:text-green-400"
                                            : "text-red-600 dark:text-red-400"
                                    )}>
                                        {isPositive ? '+' : ''}{item.change_pct.toFixed(2)}%
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Price Chart */}
                <div className="mb-6">
                    <PriceChart 
                        data={chartData?.data || []}
                        isLoading={isChartLoading}
                        interval={chartInterval}
                        onIntervalChange={setChartInterval}
                    />
                </div>

                {/* Price Stats */}
                <PriceStats 
                    stats={statsData?.data || []}
                    currentPrice={item.latest_sell_price}
                    isLoading={isStatsLoading}
                />
            </main>
        </div>
    );
};
