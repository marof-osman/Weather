import { Loader2, Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { TRANSLATIONS, type LanguageCode } from '../i18n/translations';
import { searchCities } from '../services/weatherApi';
import type { SavedLocation } from '../types/weather';

interface CitySearchProps {
  lang: LanguageCode;
  onSelectLocation: (location: SavedLocation) => void;
}

export function CitySearch({ lang, onSelectLocation }: CitySearchProps) {
  const t = TRANSLATIONS[lang];
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SavedLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setError(null);
      setIsSearching(false);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setIsSearching(true);
      setError(null);
      try {
        const matches = await searchCities(trimmed, controller.signal);
        setResults(matches);
        setActiveIndex(matches.length > 0 ? 0 : -1);
        setIsOpen(true);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setError(t.searchUnavailable);
          setResults([]);
        }
      } finally {
        setIsSearching(false);
      }
    }, 240);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query, t.searchUnavailable]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function commitSelection(location: SavedLocation) {
    onSelectLocation(location);
    setQuery('');
    setResults([]);
    setIsOpen(false);
    setActiveIndex(-1);
    inputRef.current?.blur();
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!isOpen || results.length === 0) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((prev) => (prev + 1) % results.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (event.key === 'Enter' && activeIndex >= 0 && results[activeIndex]) {
      event.preventDefault();
      commitSelection(results[activeIndex]);
    } else if (event.key === 'Escape') {
      setIsOpen(false);
    }
  }

  const showDropdown = isOpen && query.trim().length >= 2;

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative flex items-center">
        <Search
          className="pointer-events-none absolute start-4 h-4 w-4 text-slate-500 dark:text-white/65"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            if (query.trim().length >= 2) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={t.searchPlaceholder}
          aria-label={t.searchAriaLabel}
          aria-expanded={showDropdown}
          aria-autocomplete="list"
          className="glass-control h-10 w-full rounded-full ps-10 pe-10 text-sm text-slate-900 placeholder:text-slate-500 dark:text-white dark:placeholder:text-white/60 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-600/40 dark:focus-visible:ring-white/50"
        />
        {isSearching ? (
          <Loader2
            className="absolute end-3.5 h-4 w-4 animate-spin text-slate-500 dark:text-white/75"
            aria-hidden="true"
          />
        ) : query.length > 0 ? (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setResults([]);
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            aria-label={t.clearSearch}
            className="absolute end-2 flex h-7 w-7 items-center justify-center rounded-full text-slate-500 hover:bg-slate-900/10 hover:text-slate-900 dark:text-white/70 dark:hover:bg-white/15 dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600/50 dark:focus-visible:ring-white/60"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        ) : null}
      </div>

      {showDropdown && (
        <div
          role="listbox"
          className="glass-popover absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-2xl"
        >
          {error ? (
            <div className="px-4 py-3 text-sm text-rose-700 dark:text-rose-200">{error}</div>
          ) : isSearching && results.length === 0 ? (
            <div className="px-4 py-3 text-sm text-slate-600 dark:text-white/70">
              {t.searchingLocations}
            </div>
          ) : results.length === 0 ? (
            <div className="px-4 py-3 text-sm text-slate-600 dark:text-white/70">
              {t.noMatchingCities} &ldquo;{query.trim()}&rdquo;.
            </div>
          ) : (
            <ul className="divide-y divide-slate-900/10 dark:divide-white/10 max-h-72 overflow-y-auto">
              {results.map((item, index) => {
                const isActive = index === activeIndex;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={isActive}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => commitSelection(item)}
                      className={`flex w-full items-center justify-between gap-4 px-4 py-2.5 text-start transition-colors ${
                        isActive
                          ? 'bg-slate-900/10 dark:bg-white/18'
                          : 'hover:bg-slate-900/5 dark:hover:bg-white/10'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium text-slate-900 dark:text-white">
                          {item.name}
                        </div>
                        <div className="truncate text-xs text-slate-500 dark:text-white/65">
                          {[item.admin1, item.country].filter(Boolean).join(' · ')}
                        </div>
                      </div>
                      <span
                        dir="ltr"
                        className="shrink-0 font-mono text-xs tabular-nums text-slate-400 dark:text-white/55"
                      >
                        {item.latitude.toFixed(2)}°, {item.longitude.toFixed(2)}°
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
