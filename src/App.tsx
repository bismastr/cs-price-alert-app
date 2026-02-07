import { useState, useEffect } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { usePriceChanges } from './hooks/usePriceChanges';
import { useDebounce } from './hooks/useDebounce';
import { CaseCard } from './components/CaseCard';
import { Pagination } from './components/Pagination';
import { SearchBar } from './components/SearchBar';
import { SortSelect } from './components/SortSelect';
import type { SortOption } from './types';

const ITEMS_PER_PAGE = 20; // Assumed default from backend

function App() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortOption>('gainers');

  const debouncedQuery = useDebounce(query, 500);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, sortBy]);

  const { data, isLoading, isError, error } = usePriceChanges({
    query: debouncedQuery,
    page,
    sort_by: sortBy,
  });

  const totalPages = data?.data.total ? Math.ceil(data.data.total / ITEMS_PER_PAGE) : 0;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="https://cdn2.steamgriddb.com/icon/e1bd06c3f8089e7552aa0552cb387c92/32/512x512.png"
              alt="CS2 Logo"
              className="w-10 h-10 rounded-lg"
            />
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-cyan-500">
              Case Index
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
          <SearchBar value={query} onChange={setQuery} />
          <SortSelect value={sortBy} onChange={setSortBy} />
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
            <p className="text-zinc-500 dark:text-zinc-400">Loading market data...</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-full mb-4">
              <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Failed to load data</h3>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-md">
              {error instanceof Error ? error.message : 'An unexpected error occurred. Please try again later.'}
            </p>
          </div>
        ) : !data?.data.items.length ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-full mb-4">
              <LayoutGrid className="w-8 h-8 text-zinc-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No cases found</h3>
            <p className="text-zinc-500 dark:text-zinc-400">
              Try adjusting your search or filters to find what you're looking for.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {data.data.items.map((item) => (
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
      </main>
    </div>
  );
}

export default App;
