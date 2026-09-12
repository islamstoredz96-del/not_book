import React from 'react';
import { Search, X } from 'lucide-react';
import { NOTE_COLORS } from '../data/repository';

interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  selectedColor: string | null;
  onSelectColor: (color: string | null) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  query,
  onQueryChange,
  selectedColor,
  onSelectColor,
}) => {
  return (
    <div id="search-section" className="w-full space-y-3">
      {/* Search Input matching RoundedCornerShape(24.dp) */}
      <div className="relative flex items-center">
        <div className="absolute right-4 pointer-events-none text-stone-400 dark:text-stone-500">
          <Search className="w-5 h-5" />
        </div>
        <input
          id="notes-search-input"
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="🔍 ابحث في الملاحظات..."
          className="w-full pr-11 pl-11 py-3 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 rounded-full border border-stone-300 dark:border-stone-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm sm:text-base transition duration-150"
        />
        {query.length > 0 && (
          <button
            id="clear-search-btn"
            type="button"
            onClick={() => onQueryChange('')}
            aria-label="مسح البحث"
            className="absolute left-3 p-1.5 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Quick Color Filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
        <button
          onClick={() => onSelectColor(null)}
          className={`px-3 py-1 rounded-full whitespace-nowrap border transition-all ${
            selectedColor === null
              ? 'bg-amber-500 text-stone-950 font-bold border-amber-600 shadow-xs'
              : 'bg-white/80 dark:bg-stone-900 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-800 hover:border-amber-400'
          }`}
        >
          الكل
        </button>
        {NOTE_COLORS.map((c) => {
          const isSelected = selectedColor === c.id;
          return (
            <button
              key={c.id}
              onClick={() => onSelectColor(isSelected ? null : c.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full whitespace-nowrap border transition-all ${
                isSelected
                  ? 'bg-amber-500/20 dark:bg-amber-400/20 text-stone-900 dark:text-stone-100 border-amber-500 font-semibold shadow-xs'
                  : 'bg-white/80 dark:bg-stone-900 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: c.badge }}
              />
              <span>{c.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
