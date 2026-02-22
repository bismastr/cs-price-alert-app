import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowUp } from 'lucide-react';
import type { CaseItem } from '../types';
import { cn } from '../lib/utils';

const STEAM_IMAGE_BASE_URL = 'https://community.fastly.steamstatic.com/economy/image/';

interface SparklineProps {
    data: number[];
    isPositive: boolean;
}

interface HoverState {
    index: number;
    x: number;
    y: number;
    value: number;
}

const Sparkline = ({ data, isPositive }: SparklineProps) => {
    const [hoverInfo, setHoverInfo] = useState<HoverState | null>(null);

    if (!data || data.length === 0) return null;

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const width = 100;
    const height = 32;
    const padding = 2;

    const getPointCoords = (index: number) => {
        const x = (index / (data.length - 1)) * (width - padding * 2) + padding;
        const y = height - padding - ((data[index] - min) / range) * (height - padding * 2);
        return { x, y };
    };

    const points = data.map((_, index) => {
        const { x, y } = getPointCoords(index);
        return `${x},${y}`;
    }).join(' ');

    const strokeColor = isPositive ? '#22c55e' : '#ef4444';
    const fillColor = isPositive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)';

    const areaPoints = `${padding},${height - padding} ${points} ${width - padding},${height - padding}`;

    const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
        const svg = e.currentTarget;
        const rect = svg.getBoundingClientRect();
        const relativeX = ((e.clientX - rect.left) / rect.width) * width;

        const index = Math.round(((relativeX - padding) / (width - padding * 2)) * (data.length - 1));
        const clampedIndex = Math.max(0, Math.min(data.length - 1, index));

        const { x, y } = getPointCoords(clampedIndex);
        setHoverInfo({ index: clampedIndex, x, y, value: data[clampedIndex] });
    }, [data, min, range]);

    const handleMouseLeave = useCallback(() => {
        setHoverInfo(null);
    }, []);

    return (
        <div className="relative">
            <svg
                viewBox={`0 0 ${width} ${height}`}
                className="w-full h-8 cursor-crosshair"
                preserveAspectRatio="none"
                aria-label="Price sparkline chart"
                role="img"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                <polygon
                    points={areaPoints}
                    fill={fillColor}
                />
                <polyline
                    points={points}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                {hoverInfo && (
                    <>
                        <line
                            x1={hoverInfo.x}
                            y1={padding}
                            x2={hoverInfo.x}
                            y2={height - padding}
                            stroke={isPositive ? '#22c55e' : '#ef4444'}
                            strokeWidth="0.5"
                            strokeDasharray="2,2"
                            opacity="0.5"
                        />
                        <circle
                            cx={hoverInfo.x}
                            cy={hoverInfo.y}
                            r="2.5"
                            fill={isPositive ? '#22c55e' : '#ef4444'}
                            stroke="white"
                            strokeWidth="1"
                        />
                    </>
                )}
            </svg>
            {hoverInfo && (
                <div
                    className={cn(
                        "absolute -top-8 px-2 py-1 rounded text-xs font-semibold shadow-lg pointer-events-none transform -translate-x-1/2 whitespace-nowrap z-10",
                        isPositive
                            ? "bg-green-600 text-white"
                            : "bg-red-600 text-white"
                    )}
                    style={{ left: `${(hoverInfo.x / width) * 100}%` }}
                >
                    ${(hoverInfo.value / 100).toFixed(2)}
                </div>
            )}
        </div>
    );
};

interface CaseCardProps {
    item: CaseItem;
}

export const CaseCard = ({ item }: CaseCardProps) => {
    const isPositive = item.change_pct >= 0;

    return (
        <Link 
            to={`/item/${item.item_id}`}
            className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-4 flex flex-col gap-4 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer"
            aria-label={`View details for ${item.name}`}
            tabIndex={0}
        >
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

                {item.sparkline && item.sparkline.length > 0 && (
                    <div className="w-full bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-2">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                                7D Trend
                            </span>
                            <span className={cn(
                                "text-[10px] font-medium",
                                isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                            )}>
                                {isPositive ? '↑' : '↓'} {Math.abs(item.change_pct).toFixed(1)}%
                            </span>
                        </div>
                        <Sparkline data={item.sparkline} isPositive={isPositive} />
                    </div>
                )}

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
        </Link>
    );
};
