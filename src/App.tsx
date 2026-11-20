import { AlertCircle, LocateFixed, Settings, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { CitySearch } from './components/CitySearch';
import { CurrentWeatherHero } from './components/CurrentWeatherHero';
import { DailyForecastList } from './components/DailyForecastList';
import { HourlyForecastChart } from './components/HourlyForecastChart';
import {
  isSameLocation,
  MAX_SAVED_CITIES,
  SavedCitiesDock,
} from './components/SavedCitiesDock';
import { SettingsModal, type ThemeMode } from './components/SettingsModal';
import {
  LANGUAGE_OPTIONS,
  TRANSLATIONS,
  type LanguageCode,
} from './i18n/translations';
import {
  describeWeatherCode,
  fetchCurrentSnapshots,
  fetchWeatherForecast,
  reverseLookupCity,
  type CityWeatherSnapshot,
} from './services/weatherApi';
import type { SavedLocation, TemperatureUnit, WeatherForecast } from './types/weather';

const INITIAL_LOCATION: SavedLocation = {
  id: '98463',
  name: 'Duhok',
  admin1: 'Kurdistan Region',
  country: 'Iraq',
  latitude: 36.8669,
  longitude: 42.9503,
};

const STORAGE_KEYS = {
  unit: 'sonde_weather_unit_v1',
  active: 'sonde_weather_active_v1',
  savedCities: 'sonde_weather_saved_cities_v2',
  lang: 'sonde_weather_lang_v1',
  theme: 'sonde_weather_theme_v1',
};

function readStoredUnit(): TemperatureUnit {
  try {
    const val = localStorage.getItem(STORAGE_KEYS.unit);
    return val === 'fahrenheit' ? 'fahrenheit' : 'celsius';
  } catch {
    return 'celsius';
  }
}

function readStoredLang(): LanguageCode {
  try {
    const val = localStorage.getItem(STORAGE_KEYS.lang);
    if (val === 'ku-ba-ar' || val === 'ku-ba-la' || val === 'ku-so' || val === 'en') {
      return val;
    }
    return 'en';
  } catch {
    return 'en';
  }
}

function readStoredTheme(): ThemeMode {
  try {
    const val = localStorage.getItem(STORAGE_KEYS.theme);
    if (val === 'auto' || val === 'dark' || val === 'light') {
      return val;
    }
    return 'auto';
  } catch {
    return 'auto';
  }
}

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined' || !window.matchMedia) return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function readStoredActive(fallback: SavedLocation): SavedLocation {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.active);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as SavedLocation;
    if (parsed && typeof parsed.latitude === 'number' && typeof parsed.longitude === 'number') {
      return parsed;
    }
    return fallback;
  } catch {
    return fallback;
  }
}

function readStoredSavedCities(): SavedLocation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.savedCities);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (item): item is SavedLocation =>
          Boolean(item) &&
          typeof item.id === 'string' &&
          typeof item.name === 'string' &&
          typeof item.latitude === 'number' &&
          typeof item.longitude === 'number',
      )
      .slice(0, MAX_SAVED_CITIES);
  } catch {
    return [];
  }
}

function getAtmosphereClasses(
  forecast: WeatherForecast | null,
  theme: 'light' | 'dark',
): {
  backdrop: string;
  orbPrimary: string;
  orbSecondary: string;
  scrim: string;
} {
  if (theme === 'dark') {
    if (!forecast) {
      return {
        backdrop: 'from-slate-950 via-blue-950 to-slate-950',
        orbPrimary: 'bg-sky-500/20',
        orbSecondary: 'bg-indigo-500/20',
        scrim: 'bg-slate-950/30',
      };
    }

    const { kind } = describeWeatherCode(forecast.current.weatherCode);
    switch (kind) {
      case 'clear':
        return {
          backdrop: 'from-slate-950 via-blue-950 to-indigo-950',
          orbPrimary: forecast.current.isDay ? 'bg-sky-400/25' : 'bg-indigo-400/22',
          orbSecondary: forecast.current.isDay ? 'bg-amber-300/15' : 'bg-blue-500/20',
          scrim: 'bg-slate-950/25',
        };
      case 'drizzle':
      case 'rain':
      case 'showers':
        return {
          backdrop: 'from-slate-950 via-cyan-950 to-slate-950',
          orbPrimary: 'bg-cyan-400/20',
          orbSecondary: 'bg-blue-500/20',
          scrim: 'bg-slate-950/30',
        };
      case 'thunderstorm':
        return {
          backdrop: 'from-slate-950 via-slate-900 to-indigo-950',
          orbPrimary: 'bg-violet-500/25',
          orbSecondary: 'bg-amber-400/15',
          scrim: 'bg-slate-950/35',
        };
      default:
        return {
          backdrop: 'from-slate-950 via-slate-900 to-blue-950',
          orbPrimary: 'bg-slate-400/18',
          orbSecondary: 'bg-sky-500/18',
          scrim: 'bg-slate-950/28',
        };
    }
  }

  // Light Mode Liquid Glass daylight sky backdrop
  if (!forecast) {
    return {
      backdrop: 'from-sky-200 via-blue-100 to-indigo-100',
      orbPrimary: 'bg-sky-300/55',
      orbSecondary: 'bg-cyan-200/60',
      scrim: 'bg-white/10',
    };
  }

  const { kind } = describeWeatherCode(forecast.current.weatherCode);
  switch (kind) {
    case 'clear':
      return {
        backdrop: 'from-sky-300 via-blue-200 to-cyan-100',
        orbPrimary: 'bg-amber-200/55',
        orbSecondary: 'bg-sky-400/40',
        scrim: 'bg-white/10',
      };
    case 'partly-cloudy':
      return {
        backdrop: 'from-sky-200 via-slate-200 to-blue-200',
        orbPrimary: 'bg-amber-100/60',
        orbSecondary: 'bg-sky-300/45',
        scrim: 'bg-white/10',
      };
    case 'cloudy':
    case 'fog':
      return {
        backdrop: 'from-slate-300 via-slate-200 to-sky-200',
        orbPrimary: 'bg-white/60',
        orbSecondary: 'bg-sky-300/35',
        scrim: 'bg-white/10',
      };
    case 'drizzle':
    case 'rain':
    case 'showers':
      return {
        backdrop: 'from-slate-300 via-sky-200 to-cyan-200',
        orbPrimary: 'bg-cyan-300/45',
        orbSecondary: 'bg-blue-300/40',
        scrim: 'bg-white/10',
      };
    case 'snow':
      return {
        backdrop: 'from-sky-100 via-slate-200 to-cyan-100',
        orbPrimary: 'bg-white/75',
        orbSecondary: 'bg-cyan-200/55',
        scrim: 'bg-white/15',
      };
    case 'thunderstorm':
      return {
        backdrop: 'from-slate-400 via-slate-300 to-indigo-200',
        orbPrimary: 'bg-indigo-300/45',
        orbSecondary: 'bg-amber-200/35',
        scrim: 'bg-white/5',
      };
    default:
      return {
        backdrop: 'from-sky-200 via-blue-100 to-slate-200',
        orbPrimary: 'bg-sky-300/50',
        orbSecondary: 'bg-indigo-200/45',
        scrim: 'bg-white/10',
      };
  }
}

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>(readStoredTheme);
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(getSystemTheme);
  const [lang, setLang] = useState<LanguageCode>(readStoredLang);
  const [unit, setUnit] = useState<TemperatureUnit>(readStoredUnit);
  const [activeLocation, setActiveLocation] = useState<SavedLocation>(() =>
    readStoredActive(INITIAL_LOCATION),
  );
  const [savedCities, setSavedCities] = useState<SavedLocation[]>(readStoredSavedCities);
  const [citySnapshots, setCitySnapshots] = useState<Record<string, CityWeatherSnapshot>>({});

  const [forecast, setForecast] = useState<WeatherForecast | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  const t = TRANSLATIONS[lang];
  const activeLangOption = LANGUAGE_OPTIONS.find((opt) => opt.code === lang) ?? LANGUAGE_OPTIONS[0];
  const resolvedTheme: 'light' | 'dark' =
    theme === 'auto'
      ? forecast
        ? forecast.current.isDay
          ? 'light'
          : 'dark'
        : systemTheme
      : theme;
  const isDark = resolvedTheme === 'dark';

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = (event: MediaQueryListEvent) => {
      setSystemTheme(event.matches ? 'dark' : 'light');
    };
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    try {
      localStorage.setItem(STORAGE_KEYS.theme, theme);
    } catch {
      // Ignore storage failures
    }
  }, [theme, isDark]);

  useEffect(() => {
    document.documentElement.dir = activeLangOption.dir;
    document.documentElement.lang = lang === 'en' ? 'en' : 'ku';
    try {
      localStorage.setItem(STORAGE_KEYS.lang, lang);
    } catch {
      // Ignore storage failures
    }
  }, [lang, activeLangOption.dir]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.unit, unit);
    } catch {
      // Ignore storage failures
    }
  }, [unit]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.active, JSON.stringify(activeLocation));
    } catch {
      // Ignore storage failures
    }
  }, [activeLocation]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.savedCities, JSON.stringify(savedCities));
    } catch {
      // Ignore storage failures
    }
  }, [savedCities]);

  useEffect(() => {
    if (savedCities.length === 0) return;
    const controller = new AbortController();
    fetchCurrentSnapshots(savedCities, controller.signal)
      .then((snapshots) => {
        if (Object.keys(snapshots).length > 0) {
          setCitySnapshots((prev) => ({ ...prev, ...snapshots }));
        }
      })
      .catch(() => {
        // Ignore transient snapshot errors
      });
    return () => controller.abort();
  }, [savedCities]);

  useEffect(() => {
    if (!forecast) return;
    const matchedSaved = savedCities.find((city) => isSameLocation(city, forecast.location));
    if (!matchedSaved) return;
    setCitySnapshots((prev) => ({
      ...prev,
      [matchedSaved.id]: {
        temperature: forecast.current.temperature,
        weatherCode: forecast.current.weatherCode,
        isDay: forecast.current.isDay,
      },
    }));
  }, [forecast, savedCities]);

  const loadForecast = useCallback(
    async (location: SavedLocation, background = false, signal?: AbortSignal) => {
      if (background) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      try {
        const data = await fetchWeatherForecast(location, signal);
        setForecast(data);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setError(TRANSLATIONS[lang].weatherLoadError);
        }
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [lang],
  );

  useEffect(() => {
    const controller = new AbortController();
    loadForecast(activeLocation, false, controller.signal);
    return () => controller.abort();
  }, [activeLocation, loadForecast]);

  function handleSelectLocation(location: SavedLocation) {
    setNotice(null);
    setActiveLocation(location);
  }

  function handleSaveCity(location: SavedLocation) {
    setSavedCities((prev) => {
      if (prev.some((city) => isSameLocation(city, location))) return prev;
      if (prev.length >= MAX_SAVED_CITIES) return prev;
      return [...prev, location];
    });
    if (forecast && isSameLocation(forecast.location, location)) {
      setCitySnapshots((prev) => ({
        ...prev,
        [location.id]: {
          temperature: forecast.current.temperature,
          weatherCode: forecast.current.weatherCode,
          isDay: forecast.current.isDay,
        },
      }));
    }
  }

  function handleRemoveCity(id: string) {
    setSavedCities((prev) => prev.filter((city) => city.id !== id));
  }

  function handleUseMyLocation() {
    if (!navigator.geolocation) {
      setNotice(t.geolocationUnsupported);
      return;
    }

    setIsLocating(true);
    setNotice(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const resolved = await reverseLookupCity(latitude, longitude);
          setActiveLocation(resolved);
        } catch {
          setNotice(t.reverseLookupFailed);
        } finally {
          setIsLocating(false);
        }
      },
      (geoErr) => {
        setIsLocating(false);
        if (geoErr.code === geoErr.PERMISSION_DENIED) {
          setNotice(t.geolocationDenied);
        } else {
          setNotice(t.geolocationFailed);
        }
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  }

  const atmosphere = getAtmosphereClasses(forecast, resolvedTheme);

  return (
    <div
      dir={activeLangOption.dir}
      className="relative min-h-screen text-slate-900 dark:text-white flex flex-col"
    >
      {/* Dynamic Atmospheric Sky Backdrop behind Liquid Glass */}
      <div
        aria-hidden="true"
        className={`fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br transition-colors duration-700 ${atmosphere.backdrop}`}
      >
        <div
          className={`absolute -top-36 -left-24 h-[520px] w-[520px] rounded-full blur-[120px] transition-colors duration-700 ${atmosphere.orbPrimary}`}
        />
        <div
          className={`absolute top-1/3 -right-28 h-[560px] w-[560px] rounded-full blur-[130px] transition-colors duration-700 ${atmosphere.orbSecondary}`}
        />
        <div className={`absolute inset-0 transition-colors duration-700 ${atmosphere.scrim}`} />
      </div>

      {/* Translucent Glass Top Bar */}
      <header className="sticky top-0 z-30 border-b border-white/60 bg-white/40 dark:border-white/15 dark:bg-white/[0.06] backdrop-blur-2xl backdrop-saturate-150">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:gap-8 sm:px-6">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              setActiveLocation(INITIAL_LOCATION);
            }}
            className="flex flex-col shrink-0 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600/50 dark:focus-visible:ring-white/60"
          >
            <span className="text-lg font-bold leading-tight tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
              {t.brandName}
            </span>
            <span className="text-[11px] leading-tight font-normal text-slate-500 dark:text-white/65 whitespace-nowrap">
              designed by Maarof
            </span>
          </a>

          <div className="flex flex-1 justify-center min-w-0">
            <CitySearch lang={lang} onSelectLocation={handleSelectLocation} />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleUseMyLocation}
              disabled={isLocating}
              className="glass-control inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium text-slate-800 dark:text-white whitespace-nowrap shrink-0 transition-all disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600/50 dark:focus-visible:ring-white/60"
            >
              <LocateFixed
                className={`h-4 w-4 ${isLocating ? 'animate-pulse' : ''}`}
                aria-hidden="true"
              />
              <span className="hidden sm:inline">
                {isLocating ? t.locating : t.myLocation}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              aria-label={t.settings}
              title={t.settings}
              className="glass-control inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-800 dark:text-white shrink-0 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600/50 dark:focus-visible:ring-white/60"
            >
              <Settings className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        {/* Non-blocking Notice Banner */}
        {notice && (
          <div
            role="status"
            className="glass-panel mb-6 flex items-center justify-between gap-4 rounded-2xl border-amber-400/50 px-4 py-3 text-sm text-amber-950 dark:border-amber-300/35 dark:text-amber-100"
          >
            <div className="flex items-center gap-2.5">
              <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-300" aria-hidden="true" />
              <span>{notice}</span>
            </div>
            <button
              type="button"
              onClick={() => setNotice(null)}
              aria-label={t.dismissNotice}
              className="rounded-full p-1 text-amber-700 hover:bg-amber-900/10 dark:text-amber-200 dark:hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600/50 dark:focus-visible:ring-white/60"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && !forecast ? (
          <div className="space-y-6" aria-busy="true" aria-label="Loading live forecast">
            <div className="glass-panel h-72 animate-pulse rounded-3xl p-8">
              <div className="h-7 w-48 rounded-lg bg-slate-900/10 dark:bg-white/15" />
              <div className="mt-3 h-4 w-72 rounded-lg bg-slate-900/5 dark:bg-white/10" />
              <div className="mt-10 h-16 w-40 rounded-xl bg-slate-900/10 dark:bg-white/15" />
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="glass-panel h-80 animate-pulse rounded-3xl lg:col-span-5" />
              <div className="glass-panel h-80 animate-pulse rounded-3xl lg:col-span-7" />
            </div>
          </div>
        ) : error && !forecast ? (
          <div
            role="alert"
            className="glass-panel rounded-3xl p-8 text-center"
          >
            <AlertCircle className="mx-auto h-8 w-8 text-rose-600 dark:text-rose-300" aria-hidden="true" />
            <h2 className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">
              {t.unableToLoadTitle}
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-white/75">{error}</p>
            <button
              type="button"
              onClick={() => loadForecast(activeLocation, false)}
              className="glass-control-active mt-5 inline-flex h-10 items-center rounded-full px-5 text-sm font-medium text-slate-900 dark:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600/50 dark:focus-visible:ring-white/60"
            >
              {t.tryAgain}
            </button>
          </div>
        ) : forecast ? (
          <div className="space-y-6">
            {error && (
              <div
                role="alert"
                className="glass-panel flex items-center justify-between gap-4 rounded-2xl border-rose-400/50 px-4 py-3 text-sm text-rose-900 dark:border-rose-300/35 dark:text-rose-100"
              >
                <span>{error}</span>
                <button
                  type="button"
                  onClick={() => loadForecast(activeLocation, true)}
                  className="font-medium underline hover:no-underline whitespace-nowrap shrink-0"
                >
                  {t.retry}
                </button>
              </div>
            )}

            <CurrentWeatherHero
              forecast={forecast}
              unit={unit}
              lang={lang}
              isRefreshing={isRefreshing}
              onRefresh={() => loadForecast(activeLocation, true)}
            />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
              <div className="lg:col-span-5">
                <DailyForecastList daily={forecast.daily} unit={unit} lang={lang} />
              </div>
              <div className="lg:col-span-7">
                <HourlyForecastChart
                  hourly={forecast.hourly}
                  unit={unit}
                  lang={lang}
                  isDark={isDark}
                />
              </div>
            </div>

            <SavedCitiesDock
              savedCities={savedCities}
              activeLocation={activeLocation}
              snapshots={citySnapshots}
              unit={unit}
              lang={lang}
              onSelectCity={handleSelectLocation}
              onSaveCity={handleSaveCity}
              onRemoveCity={handleRemoveCity}
            />
          </div>
        ) : null}
      </main>

      <SettingsModal
        isOpen={isSettingsOpen}
        theme={theme}
        lang={lang}
        unit={unit}
        onChangeTheme={setTheme}
        onChangeLang={setLang}
        onChangeUnit={setUnit}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
