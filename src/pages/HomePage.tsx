import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, Loader2, AlertCircle, TrendingUp, Sparkles, Zap, BarChart3, X, ArrowLeft, TrendingDown } from 'lucide-react';
import { useTopGainers, useTopLosers } from '../hooks/useTopMovers';
import { usePriceChanges } from '../hooks/usePriceChanges';
import { useDebounce } from '../hooks/useDebounce';
import { TopMovers } from '../components/TopMovers';
import { CaseCard } from '../components/CaseCard';
import { Pagination } from '../components/Pagination';
import type { SortOption, CaseItem } from '../types';
import { cn } from '../lib/utils';

const ITEMS_PER_PAGE = 20;

// Floating particle component
const FloatingParticle = ({ delay, size, left }: { delay: number; size: number; left: string }) => (
    <div
        className="absolute rounded-full bg-white/20 animate-particle"
        style={{
            width: size,
            height: size,
            left,
            bottom: '-20px',
            animationDelay: `${delay}s`,
        }}
    />
);

// Glowing orb component
const GlowingOrb = ({ className, color }: { className?: string; color: string }) => (
    <div
        className={cn(
            "absolute rounded-full blur-3xl animate-pulse-glow",
            className
        )}
        style={{ backgroundColor: color }}
    />
);

// Floating case card for hero section
interface FloatingCaseCardProps {
    item: CaseItem;
    position: string;
    animationDelay: string;
    animationClass: string;
}

const FloatingCaseCard = ({ item, position, animationDelay, animationClass }: FloatingCaseCardProps) => {
    const isGainer = item.change_pct >= 0;
    
    return (
        <Link
            to={`/item/${item.item_id}`}
            className={cn(
                "absolute hidden lg:flex flex-col items-center p-3 rounded-xl",
                "bg-white/10 backdrop-blur-md border border-white/20",
                "hover:bg-white/20 hover:scale-105 transition-all duration-300 cursor-pointer",
                "shadow-lg hover:shadow-xl",
                animationClass,
                position
            )}
            style={{ animationDelay }}
        >
            <img
                src={`https://community.fastly.steamstatic.com/economy/image/${item.icon_url}/96fx96f`}
                alt={item.name}
                className="w-16 h-16 object-contain drop-shadow-lg"
            />
            <span className="text-white/90 text-xs font-medium mt-2 text-center max-w-[100px] truncate">
                {item.name.replace(' Case', '')}
            </span>
            <div className={cn(
                "flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-xs font-bold",
                isGainer 
                    ? "bg-green-500/20 text-green-300" 
                    : "bg-red-500/20 text-red-300"
            )}>
                {isGainer ? (
                    <TrendingUp className="w-3 h-3" />
                ) : (
                    <TrendingDown className="w-3 h-3" />
                )}
                <span>{isGainer ? '+' : ''}{item.change_pct.toFixed(2)}%</span>
            </div>
            <span className="text-white/60 text-[10px] mt-1">
                ${(item.latest_sell_price / 100).toFixed(2)}
            </span>
        </Link>
    );
};

// Position configurations for floating cards
const floatingCardPositions = [
    { position: 'top-8 right-8', animationClass: 'animate-float', delay: '0s' },
    { position: 'top-32 right-32', animationClass: 'animate-float-delay-1', delay: '-1s' },
    { position: 'bottom-24 right-16', animationClass: 'animate-float-delay-2', delay: '-2s' },
    { position: 'top-20 right-[45%]', animationClass: 'animate-float-delay-3', delay: '-3s' },
    { position: 'bottom-16 right-[38%]', animationClass: 'animate-float', delay: '-4s' },
];

export const HomePage = () => {
    const [query, setQuery] = useState('');
    const [page, setPage] = useState(1);
    const [sortBy, setSortBy] = useState<SortOption>('gainers');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const resultsRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const debouncedQuery = useDebounce(query, 500);

    const { data: gainersData, isLoading: isGainersLoading } = useTopGainers(10);
    const { data: losersData, isLoading: isLosersLoading } = useTopLosers(10);
    
    const { data: searchData, isLoading: isSearchLoading, isError: isSearchError, error } = usePriceChanges({
        query: debouncedQuery,
        page,
        sort_by: sortBy,
    });

    // Reset page when filters change
    useEffect(() => {
        setPage(1);
    }, [debouncedQuery, sortBy]);

    // Scroll to results when search query changes
    useEffect(() => {
        if (debouncedQuery && resultsRef.current) {
            resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [debouncedQuery]);

    const totalPages = searchData?.data?.total ? Math.ceil(searchData.data.total / ITEMS_PER_PAGE) : 0;
    const showSearchResults = query.length > 0;
    const resultCount = searchData?.data?.total || 0;

    const handleClearSearch = () => {
        setQuery('');
        setPage(1);
        searchInputRef.current?.focus();
    };

    const handleBackToHome = () => {
        setQuery('');
        setPage(1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
            {/* Header - Shows search when in search mode */}
            <header className="sticky top-0 z-20 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
                    {showSearchResults ? (
                        <>
                            {/* Back button */}
                            <button
                                onClick={handleBackToHome}
                                className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                                aria-label="Back to home"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                <span className="hidden sm:inline font-medium">Back</span>
                            </button>

                            {/* Compact search in header */}
                            <div className="flex-1 max-w-2xl relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-4 w-4 text-zinc-400" />
                                </div>
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    autoFocus
                                    className="block w-full pl-10 pr-10 py-2 text-sm bg-zinc-100 dark:bg-zinc-800 rounded-xl placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                                    placeholder="Search for cases..."
                                    aria-label="Search cases"
                                />
                                {query && (
                                    <button
                                        onClick={handleClearSearch}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                                        aria-label="Clear search"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>

                            {/* Results count */}
                            {!isSearchLoading && (
                                <span className="text-sm text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                                    {resultCount} result{resultCount !== 1 ? 's' : ''}
                                </span>
                            )}
                        </>
                    ) : (
                        <Link to="/" className="flex items-center gap-2">
                            <img
                                src="https://cdn2.steamgriddb.com/icon/e1bd06c3f8089e7552aa0552cb387c92/32/512x512.png"
                                alt="CS2 Logo"
                                className="w-10 h-10 rounded-lg"
                            />
                            <h1 
                                className="text-2xl font-semibold uppercase tracking-wide text-zinc-900 dark:text-white" 
                                style={{ fontFamily: 'Teko, sans-serif' }}
                            >
                                Case Index
                            </h1>
                        </Link>
                    )}
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Hero Section - Only show when not searching */}
                {!showSearchResults && (
                    <div className="relative mb-10 rounded-3xl overflow-hidden">
                        {/* Animated gradient background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 animate-gradient" />
                        
                        {/* Mesh gradient overlay */}
                        <div className="absolute inset-0 opacity-50">
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-400/40 via-transparent to-transparent" />
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-orange-400/30 via-transparent to-transparent" />
                        </div>

                        {/* Glowing orbs */}
                        <GlowingOrb 
                            className="w-64 h-64 -top-20 -left-20 animate-float" 
                            color="rgba(139, 92, 246, 0.5)" 
                        />
                        <GlowingOrb 
                            className="w-96 h-96 -bottom-32 -right-32 animate-float-delay-1" 
                            color="rgba(236, 72, 153, 0.4)" 
                        />
                        <GlowingOrb 
                            className="w-48 h-48 top-1/2 left-1/3 animate-float-delay-2" 
                            color="rgba(59, 130, 246, 0.3)" 
                        />

                        {/* Floating particles */}
                        <div className="absolute inset-0 overflow-hidden">
                            {[...Array(12)].map((_, i) => (
                                <FloatingParticle
                                    key={i}
                                    delay={i * 1.2}
                                    size={Math.random() * 6 + 2}
                                    left={`${(i * 8) + 4}%`}
                                />
                            ))}
                        </div>

                        {/* Grid pattern overlay */}
                        <div 
                            className="absolute inset-0 opacity-[0.03]"
                            style={{
                                backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                                backgroundSize: '50px 50px',
                            }}
                        />

                        {/* Floating Case Cards - 3 gainers, 2 losers */}
                        {!isGainersLoading && !isLosersLoading && (
                            <>
                                {gainersData?.data?.items?.slice(0, 3).map((item, index) => (
                                    <FloatingCaseCard
                                        key={`gainer-${item.item_id}`}
                                        item={item}
                                        position={floatingCardPositions[index].position}
                                        animationClass={floatingCardPositions[index].animationClass}
                                        animationDelay={floatingCardPositions[index].delay}
                                    />
                                ))}
                                {losersData?.data?.items?.slice(0, 2).map((item, index) => (
                                    <FloatingCaseCard
                                        key={`loser-${item.item_id}`}
                                        item={item}
                                        position={floatingCardPositions[index + 3].position}
                                        animationClass={floatingCardPositions[index + 3].animationClass}
                                        animationDelay={floatingCardPositions[index + 3].delay}
                                    />
                                ))}
                            </>
                        )}

                        {/* Content */}
                        <div className="relative z-10 p-8 md:p-12 lg:p-16">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                                <div className="relative">
                                    <Sparkles className="w-4 h-4 text-yellow-300 animate-twinkle" />
                                    <div className="absolute inset-0 blur-sm">
                                        <Sparkles className="w-4 h-4 text-yellow-300" />
                                    </div>
                                </div>
                                <span className="text-white/90 text-sm font-medium tracking-wide">
                                    CS2 Market Tracker
                                </span>
                                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                            </div>
                            
                            {/* Main heading with glow effect */}
                            <div className="relative mb-4">
                                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                                    Track Case Prices
                                    <br />
                                    <span className="bg-gradient-to-r from-yellow-200 via-pink-200 to-cyan-200 bg-clip-text text-transparent">
                                        in Real-Time
                                    </span>
                                </h2>
                                {/* Subtle glow behind text */}
                                <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl -z-10" />
                            </div>

                            {/* Subheading */}
                            <p className="text-lg md:text-xl text-white/70 max-w-2xl mb-10 leading-relaxed">
                                Monitor price changes, discover market trends, and find the best deals on CS2 cases.
                            </p>

                            {/* Feature pills */}
                            <div className="flex flex-wrap gap-3 mb-10">
                                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
                                    <TrendingUp className="w-4 h-4 text-green-400" />
                                    <span className="text-white/80 text-sm">Live Prices</span>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
                                    <Zap className="w-4 h-4 text-yellow-400" />
                                    <span className="text-white/80 text-sm">24h Changes</span>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
                                    <BarChart3 className="w-4 h-4 text-blue-400" />
                                    <span className="text-white/80 text-sm">Price History</span>
                                </div>
                            </div>

                            {/* Search Bar with glow */}
                            <div className={cn(
                                "relative max-w-2xl transition-all duration-500",
                                isSearchFocused && "scale-[1.02]"
                            )}>
                                {/* Search glow effect */}
                                <div className={cn(
                                    "absolute -inset-1 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 opacity-0 blur-lg transition-opacity duration-500",
                                    isSearchFocused && "opacity-70"
                            )} />
                            
                            {/* Shimmer effect on focus */}
                            {isSearchFocused && (
                                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                                </div>
                            )}
                            
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                    <Search className={cn(
                                        "h-5 w-5 transition-colors duration-300",
                                        isSearchFocused ? "text-purple-500" : "text-zinc-400"
                                    )} />
                                </div>
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onFocus={() => setIsSearchFocused(true)}
                                    onBlur={() => setIsSearchFocused(false)}
                                    className="block w-full pl-14 pr-6 py-5 text-lg bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl rounded-2xl shadow-2xl placeholder-zinc-400 focus:outline-none transition-all border border-white/20"
                                    placeholder="Search for cases..."
                                    aria-label="Search cases"
                                />
                            </div>
                        </div>

                        {/* Stats row */}
                        <div className="flex flex-wrap gap-8 mt-10 pt-8 border-t border-white/10">
                            <div className="flex flex-col">
                                <span className="text-3xl font-bold text-white">100+</span>
                                <span className="text-white/50 text-sm">Cases Tracked</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-3xl font-bold text-white">24/7</span>
                                <span className="text-white/50 text-sm">Price Updates</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-3xl font-bold text-white">Free</span>
                                <span className="text-white/50 text-sm">Forever</span>
                            </div>
                        </div>
                    </div>
                </div>
                )}

                {/* Search Results */}
                {showSearchResults ? (
                    <div ref={resultsRef} className="scroll-mt-20">
                        {/* Sort Options */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                                    {query ? `Search: "${query}"` : 'All Cases'}
                                </h2>
                                {!isSearchLoading && (
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                                        {resultCount} case{resultCount !== 1 ? 's' : ''} found
                                    </p>
                                )}
                            </div>
                            <div className="flex gap-2 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
                                <button
                                    onClick={() => setSortBy('gainers')}
                                    className={cn(
                                        "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                                        sortBy === 'gainers'
                                            ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm"
                                            : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                                    )}
                                    aria-label="Sort by gainers"
                                    tabIndex={0}
                                >
                                    Gainers
                                </button>
                                <button
                                    onClick={() => setSortBy('losers')}
                                    className={cn(
                                        "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                                        sortBy === 'losers'
                                            ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm"
                                            : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                                    )}
                                    aria-label="Sort by losers"
                                    tabIndex={0}
                                >
                                    Losers
                                </button>
                            </div>
                        </div>

                        {/* Search Results Grid */}
                        {isSearchLoading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                                <p className="text-zinc-500 dark:text-zinc-400">Loading market data...</p>
                            </div>
                        ) : isSearchError ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-full mb-4">
                                    <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">Failed to load data</h3>
                                <p className="text-zinc-500 dark:text-zinc-400 max-w-md">
                                    {error instanceof Error ? error.message : 'An unexpected error occurred.'}
                                </p>
                            </div>
                        ) : !searchData?.data?.items?.length ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-full mb-4">
                                    <Search className="w-8 h-8 text-zinc-400" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">No cases found</h3>
                                <p className="text-zinc-500 dark:text-zinc-400">
                                    Try adjusting your search to find what you're looking for.
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {searchData.data.items.map((item) => (
                                        <CaseCard key={item.item_id} item={item} />
                                    ))}
                                </div>

                                {totalPages > 1 && (
                                    <Pagination
                                        currentPage={page}
                                        totalPages={totalPages}
                                        onPageChange={setPage}
                                    />
                                )}
                            </>
                        )}
                    </div>
                ) : (
                    <>
                        {/* Market Overview Header */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-500/10 rounded-xl">
                                <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                                Market Overview
                            </h2>
                            <span className="text-sm text-zinc-500 dark:text-zinc-400">
                                24h price changes
                            </span>
                        </div>

                        {/* Top Movers Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <TopMovers 
                                items={gainersData?.data.items || []} 
                                type="gainers"
                                isLoading={isGainersLoading}
                            />
                            <TopMovers 
                                items={losersData?.data.items || []} 
                                type="losers"
                                isLoading={isLosersLoading}
                            />
                        </div>
                    </>
                )}
            </main>

            {/* Footer */}
            <footer className="border-t border-zinc-200 dark:border-zinc-800 mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-2">
                            <img
                                src="https://cdn2.steamgriddb.com/icon/e1bd06c3f8089e7552aa0552cb387c92/32/512x512.png"
                                alt="CS2 Logo"
                                className="w-6 h-6 rounded"
                            />
                            <span className="text-sm text-zinc-500 dark:text-zinc-400">
                                Case Index - CS2 Market Tracker
                            </span>
                        </div>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            Prices from Steam Community Market
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};
