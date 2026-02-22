import { useState, useMemo } from 'react';
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    Tooltip, 
    ResponsiveContainer,
    CartesianGrid
} from 'recharts';
import type { ChartDataPoint, ChartInterval } from '../types';
import { cn } from '../lib/utils';

interface PriceChartProps {
    data: ChartDataPoint[];
    isLoading?: boolean;
    interval: ChartInterval;
    onIntervalChange: (interval: ChartInterval) => void;
}

const intervals: { value: ChartInterval; label: string }[] = [
    { value: '7d', label: '7D' },
    { value: '1m', label: '1M' },
    { value: '3m', label: '3M' },
    { value: '6m', label: '6M' },
];

interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{ value: number; payload: ChartDataPoint }>;
    label?: string;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;
    const price = data.price / 100;
    const date = new Date(data.timestamp).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

    return (
        <div className="bg-zinc-900 dark:bg-zinc-800 text-white px-4 py-3 rounded-xl shadow-xl border border-zinc-700">
            <p className="text-xs text-zinc-400 mb-1">{date}</p>
            <p className="text-lg font-bold">${price.toFixed(2)}</p>
            <p className={cn(
                "text-sm font-medium mt-1",
                data.change_pct >= 0 ? "text-green-400" : "text-red-400"
            )}>
                {data.change_pct >= 0 ? '+' : ''}{data.change_pct.toFixed(2)}%
            </p>
        </div>
    );
};

const ChartSkeleton = () => (
    <div className="animate-pulse">
        <div className="h-[300px] bg-zinc-100 dark:bg-zinc-800 rounded-xl" />
    </div>
);

export const PriceChart = ({ 
    data, 
    isLoading, 
    interval, 
    onIntervalChange
}: PriceChartProps) => {
    const [hoveredData, setHoveredData] = useState<ChartDataPoint | null>(null);

    const chartData = useMemo(() => {
        return data.map(point => ({
            ...point,
            displayPrice: point.price / 100,
        }));
    }, [data]);

    const priceChange = useMemo(() => {
        if (chartData.length < 2) return { value: 0, percent: 0 };
        const first = chartData[0].displayPrice;
        const last = chartData[chartData.length - 1].displayPrice;
        const change = last - first;
        const percent = ((last - first) / first) * 100;
        return { value: change, percent };
    }, [chartData]);

    const isPositive = priceChange.percent >= 0;
    const strokeColor = isPositive ? '#22c55e' : '#ef4444';

    const currentPrice = chartData.length > 0 
        ? hoveredData?.price ? hoveredData.price / 100 : chartData[chartData.length - 1].displayPrice 
        : 0;

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <div className="p-5 border-b border-zinc-200 dark:border-zinc-800">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                        <div>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">
                                Current Price
                            </p>
                            <div className="flex items-baseline gap-3">
                                <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                                    ${currentPrice.toFixed(2)}
                                </span>
                                <span className={cn(
                                    "text-sm font-semibold px-2 py-1 rounded-lg",
                                    isPositive 
                                        ? "bg-green-500/10 text-green-600 dark:text-green-400"
                                        : "bg-red-500/10 text-red-600 dark:text-red-400"
                                )}>
                                    {isPositive ? '+' : ''}{priceChange.percent.toFixed(2)}%
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex gap-1 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
                        {intervals.map(({ value, label }) => (
                            <button
                                key={value}
                                onClick={() => onIntervalChange(value)}
                                className={cn(
                                    "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                                    interval === value
                                        ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm"
                                        : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                                )}
                                aria-label={`Show ${label} chart`}
                                tabIndex={0}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="p-5">
                {isLoading ? (
                    <ChartSkeleton />
                ) : chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart 
                            data={chartData}
                            onMouseMove={(e) => {
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                const payload = (e as any)?.activePayload?.[0];
                                if (payload) {
                                    setHoveredData(payload.payload);
                                }
                            }}
                            onMouseLeave={() => setHoveredData(null)}
                        >
                            <defs>
                                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={strokeColor} stopOpacity={0.3} />
                                    <stop offset="100%" stopColor={strokeColor} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid 
                                strokeDasharray="3 3" 
                                stroke="#374151" 
                                opacity={0.1}
                                vertical={false}
                            />
                            <XAxis 
                                dataKey="timestamp"
                                tickFormatter={(value) => {
                                    const date = new Date(value);
                                    return date.toLocaleDateString('en-US', { 
                                        month: 'short', 
                                        day: 'numeric' 
                                    });
                                }}
                                stroke="#9ca3af"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                dy={10}
                            />
                            <YAxis 
                                tickFormatter={(value) => `$${value.toFixed(0)}`}
                                stroke="#9ca3af"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                dx={-10}
                                domain={['dataMin - 1', 'dataMax + 1']}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                                type="monotone"
                                dataKey="displayPrice"
                                stroke={strokeColor}
                                strokeWidth={2}
                                fill="url(#priceGradient)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-[300px] flex items-center justify-center text-zinc-500 dark:text-zinc-400">
                        No chart data available
                    </div>
                )}
            </div>
        </div>
    );
};
