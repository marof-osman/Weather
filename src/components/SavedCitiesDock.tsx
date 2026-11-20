import { BookmarkCheck, BookmarkPlus, Plus, X } from 'lucide-react';
import {
  localizePresetCityName,
  TRANSLATIONS,
  type LanguageCode,
} from '../i18n/translations';
import {
  formatTemp,
  type CityWeatherSnapshot,
} from '../services/weatherApi';
import type { SavedLocation, TemperatureUnit } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';

export const MAX_SAVED_CITIES = 4;

interface SavedCitiesDockProps {
  savedCities: SavedLocation[];
  activeLocation: SavedLocation;
  snapshots: Record<string, CityWeatherSnapshot>;
  unit: TemperatureUnit;
  lang: LanguageCode;
  onSelectCity: (location: SavedLocation) => void;
  onSaveCity: (location: SavedLocation) => void;
  onRemoveCity: (id: string) => void;
}

export function isSameLocation(a: SavedLocation, b: SavedLocation): boolean {
  if (a.id === b.id) return true;
  return (
    Math.abs(a.latitude - b.latitude) < 0.02 &&
    Math.abs(a.longitude - b.longitude) < 0.02
  );
}

export function SavedCitiesDock({
  savedCities,
  activeLocation,
  snapshots,
  unit,
  lang,
  onSelectCity,
  onSaveCity,
  onRemoveCity,
}: SavedCitiesDockProps) {
  const t = TRANSLATIONS[lang];
  const matchedActiveCity = savedCities.find((city) => isSameLocation(city, activeLocation));
  const isActiveSaved = Boolean(matchedActiveCity);
  const isFull = savedCities.length >= MAX_SAVED_CITIES;
  const activeDisplayName = localizePresetCityName(activeLocation.id, activeLocation.name, lang);

  const slots = Array.from({ length: MAX_SAVED_CITIES }, (_, idx) => savedCities[idx] ?? null);

  function handleToggleSaveActive() {
    if (matchedActiveCity) {
      onRemoveCity(matchedActiveCity.id);
    } else if (!isFull) {
      onSaveCity(activeLocation);
    }
  }

  return (
    <section
      aria-label={t.savedCities}
      className="glass-panel rounded-3xl overflow-hidden"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-900/10 dark:border-white/15 px-5 py-3">
        <div className="flex items-center gap-2.5">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
            {t.savedCities}
          </h2>
          <span
            dir="ltr"
            className="font-mono text-xs font-medium tabular-nums text-slate-500 dark:text-white/60"
          >
            {savedCities.length}/{MAX_SAVED_CITIES}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {!isActiveSaved && isFull ? (
            <span className="text-xs text-slate-500 dark:text-white/65">{t.slotsFull}</span>
          ) : (
            <button
              type="button"
              onClick={handleToggleSaveActive}
              aria-pressed={isActiveSaved}
              className={`inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-medium whitespace-nowrap shrink-0 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600/50 dark:focus-visible:ring-white/60 ${
                isActiveSaved
                  ? 'glass-control-active text-sky-700 dark:text-sky-200'
                  : 'glass-control text-slate-800 dark:text-white'
              }`}
            >
              {isActiveSaved ? (
                <BookmarkCheck className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <BookmarkPlus className="h-3.5 w-3.5 text-sky-700 dark:text-sky-200" aria-hidden="true" />
              )}
              <span>
                {isActiveSaved ? t.saved : `${t.saveCurrentCity} ${activeDisplayName}`}
              </span>
            </button>
          )}
        </div>
      </div>

      <div className="p-2.5 sm:p-3.5">
        <div
          role="group"
          aria-label={t.savedCities}
          className="grid w-full grid-cols-4 gap-1 rounded-2xl border border-slate-900/10 bg-white/30 p-1 dark:border-white/15 dark:bg-white/[0.04] sm:gap-1.5 sm:p-1.5"
        >
          {slots.map((city, slotIdx) => {
            if (!city) {
              const canQuickSave = !isActiveSaved && !isFull;

              if (canQuickSave) {
                return (
                  <button
                    key={`empty-${slotIdx}`}
                    type="button"
                    onClick={() => onSaveCity(activeLocation)}
                    className="flex min-h-[44px] sm:h-10 min-w-0 items-center justify-center gap-1 rounded-xl border border-dashed border-slate-900/15 bg-white/25 px-1.5 text-[11px] font-medium text-slate-700 transition-all hover:border-sky-600/40 hover:bg-white/55 dark:border-white/20 dark:bg-white/[0.03] dark:text-white/85 dark:hover:border-white/40 dark:hover:bg-white/[0.1] sm:gap-1.5 sm:px-2.5 sm:text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600/50 dark:focus-visible:ring-white/60"
                  >
                    <Plus className="h-3 w-3 shrink-0 text-sky-700 dark:text-sky-200" aria-hidden="true" />
                    <span className="truncate">
                      {t.saveCurrentCity}
                      <span className="hidden sm:inline"> {activeDisplayName}</span>
                    </span>
                  </button>
                );
              }

              return (
                <div
                  key={`empty-${slotIdx}`}
                  className="flex min-h-[44px] sm:h-10 min-w-0 items-center justify-center rounded-xl border border-dashed border-slate-900/10 px-1.5 text-center text-[10px] text-slate-400 dark:border-white/12 dark:text-white/40 sm:px-2 sm:text-[11px]"
                >
                  <span className="truncate">{t.emptySlot}</span>
                </div>
              );
            }

            const isSelected = isSameLocation(city, activeLocation);
            const displayName = localizePresetCityName(city.id, city.name, lang);
            const snapshot = snapshots[city.id];

            return (
              <div key={city.id} className="relative flex min-w-0 items-center">
                <button
                  type="button"
                  onClick={() => onSelectCity(city)}
                  aria-pressed={isSelected}
                  className={`flex min-h-[44px] sm:h-10 w-full min-w-0 flex-col justify-center gap-0.5 rounded-xl px-2 py-1.5 pe-5 text-start transition-all sm:flex-row sm:items-center sm:justify-between sm:gap-1.5 sm:px-2.5 sm:py-0 sm:pe-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600/50 dark:focus-visible:ring-white/60 ${
                    isSelected
                      ? 'glass-control-active text-slate-900 dark:text-white'
                      : 'text-slate-700 hover:bg-white/50 dark:text-white/80 dark:hover:bg-white/10'
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-1 sm:gap-1.5">
                    {snapshot && (
                      <WeatherIcon
                        code={snapshot.weatherCode}
                        isDay={snapshot.isDay}
                        className="hidden h-3.5 w-3.5 shrink-0 sm:block"
                      />
                    )}
                    <span className="truncate text-[11px] font-semibold leading-tight sm:text-xs">
                      {displayName}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {snapshot && (
                      <WeatherIcon
                        code={snapshot.weatherCode}
                        isDay={snapshot.isDay}
                        className="h-3 w-3 shrink-0 sm:hidden"
                      />
                    )}
                    {snapshot && (
                      <span
                        dir="ltr"
                        className="font-mono text-[11px] font-semibold tabular-nums leading-tight text-slate-600 dark:text-white/85 sm:text-xs"
                      >
                        {formatTemp(snapshot.temperature, unit)}°
                      </span>
                    )}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => onRemoveCity(city.id)}
                  aria-label={`${t.removeCity}: ${displayName}`}
                  title={t.removeCity}
                  className="absolute top-1 end-1 inline-flex h-4 w-4 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-900/10 hover:text-slate-800 dark:text-white/50 dark:hover:bg-white/15 dark:hover:text-white sm:top-1/2 sm:end-1.5 sm:h-5 sm:w-5 sm:-translate-y-1/2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600/50 dark:focus-visible:ring-white/60"
                >
                  <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" aria-hidden="true" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
