import { RefreshCw } from 'lucide-react';
import {
  localizeCompass,
  localizePresetCityName,
  localizeUvLabel,
  TRANSLATIONS,
  translateWeatherCode,
  type LanguageCode,
} from '../i18n/translations';
import {
  describeWeatherCode,
  formatClockTime,
  formatSpeed,
  formatTemp,
  formatVisibility,
} from '../services/weatherApi';
import type { TemperatureUnit, WeatherForecast } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';

interface CurrentWeatherHeroProps {
  forecast: WeatherForecast;
  unit: TemperatureUnit;
  lang: LanguageCode;
  isRefreshing: boolean;
  onRefresh: () => void;
}

export function CurrentWeatherHero({
  forecast,
  unit,
  lang,
  isRefreshing,
  onRefresh,
}: CurrentWeatherHeroProps) {
  const t = TRANSLATIONS[lang];
  const { location, current, daily, timezoneAbbreviation, fetchedAt } = forecast;
  const today = daily[0];
  const rawCondition = describeWeatherCode(current.weatherCode);
  const condition = translateWeatherCode(current.weatherCode, lang, rawCondition);
  const unitSymbol = unit === 'celsius' ? '°C' : '°F';
  const wind = formatSpeed(current.windSpeed, unit);
  const gusts = formatSpeed(current.windGusts, unit);
  const windUnit = unit === 'celsius' ? t.unitLabels.kmh : t.unitLabels.mph;
  const visibilityParts = formatVisibility(current.visibility, unit).split(' ');
  const visibilityUnit = unit === 'celsius' ? t.unitLabels.km : t.unitLabels.mi;

  const updatedLabel = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(fetchedAt));

  const displayCityName = localizePresetCityName(location.id, location.name, lang);

  return (
    <section
      aria-label={t.brandName}
      className="glass-panel rounded-3xl overflow-hidden"
    >
      <div className="relative flex flex-col items-center gap-5 p-6 text-center sm:p-8 sm:pt-10">
        {/* Top-end Refresh action */}
        <div className="flex w-full justify-end sm:absolute sm:top-6 sm:end-6 sm:w-auto">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            aria-label={t.refreshAria}
            className="glass-control inline-flex h-9 items-center gap-2 rounded-full px-3.5 text-xs font-medium text-slate-800 dark:text-white whitespace-nowrap shrink-0 transition-all disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600/50 dark:focus-visible:ring-white/60"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin text-sky-600 dark:text-white' : 'text-slate-600 dark:text-white/85'}`}
              aria-hidden="true"
            />
            <span>{t.refresh}</span>
          </button>
        </div>

        {/* Centered City Name & Location Metadata */}
        <div className="max-w-xl space-y-1.5">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl text-balance">
            {displayCityName}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-slate-600 dark:text-white/75">
            <span>
              {[location.admin1, location.country].filter(Boolean).join(', ')}
            </span>
            <span aria-hidden="true" className="text-slate-400 dark:text-white/45">·</span>
            <span className="font-mono tabular-nums">
              {t.localTime} {formatClockTime(current.time)} {timezoneAbbreviation}
            </span>
            <span aria-hidden="true" className="text-slate-400 dark:text-white/45">·</span>
            <span className="font-mono tabular-nums">
              {t.updatedAt} {updatedLabel}
            </span>
          </div>
        </div>

        {/* Centered Temperature with Unit & Condition */}
        <div className="flex flex-col items-center gap-3 pt-1">
          <div className="flex items-center justify-center gap-4">
            <div className="glass-lens flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl sm:h-18 sm:w-18">
              <WeatherIcon
                code={current.weatherCode}
                isDay={current.isDay}
                className="h-9 w-9 sm:h-10 sm:w-10"
              />
            </div>
            <div dir="ltr" className="flex items-baseline gap-1.5">
              <span className="font-mono text-6xl font-semibold tracking-tight tabular-nums text-slate-900 dark:text-white sm:text-7xl">
                {formatTemp(current.temperature, unit)}
              </span>
              <span className="font-mono text-2xl font-medium text-slate-500 dark:text-white/70 sm:text-3xl">
                {unitSymbol}
              </span>
            </div>
          </div>

          <p className="text-base font-medium text-slate-700 dark:text-white/90 sm:text-lg">
            {condition.label}
          </p>
        </div>

        {/* Centered Summary Strip */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-600 dark:text-white/80">
          <div>
            <span className="text-slate-500 dark:text-white/60">{t.feelsLike} </span>
            <span dir="ltr" className="inline-block font-mono font-medium tabular-nums text-slate-900 dark:text-white">
              {formatTemp(current.apparentTemperature, unit)}
              {unitSymbol}
            </span>
          </div>
          {today && (
            <div>
              <span className="text-slate-500 dark:text-white/60">{t.highLow} </span>
              <span dir="ltr" className="inline-block font-mono font-medium tabular-nums text-slate-900 dark:text-white">
                {formatTemp(today.tempMax, unit)}° / {formatTemp(today.tempMin, unit)}°
              </span>
            </div>
          )}
          <div>
            <span className="text-slate-500 dark:text-white/60">{t.cloudCover} </span>
            <span dir="ltr" className="inline-block font-mono font-medium tabular-nums text-slate-900 dark:text-white">
              {Math.round(current.cloudCover)}%
            </span>
          </div>
        </div>
      </div>

      {/* Atmospheric telemetry strip */}
      <div className="grid grid-cols-2 border-t border-slate-900/10 bg-white/25 dark:border-white/15 dark:bg-white/[0.04] sm:grid-cols-3 lg:grid-cols-6">
        <div className="border-b border-e border-slate-900/10 dark:border-white/15 p-4 sm:p-5 lg:border-b-0">
          <div className="text-xs font-medium text-slate-500 dark:text-white/65">{t.wind}</div>
          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span className="font-mono text-xl font-semibold tabular-nums text-slate-900 dark:text-white">
              {wind.value}
            </span>
            <span className="font-mono text-xs text-slate-500 dark:text-white/60">{windUnit}</span>
            <span className="ms-1 text-xs font-medium text-slate-700 dark:text-white/85">
              {localizeCompass(current.windDirection, lang)}
            </span>
          </div>
          <div className="mt-1 font-mono text-xs tabular-nums text-slate-500 dark:text-white/60">
            {t.gusts} {gusts.value} {windUnit}
          </div>
        </div>

        <div className="border-b border-slate-900/10 dark:border-white/15 p-4 sm:border-e sm:p-5 lg:border-b-0">
          <div className="text-xs font-medium text-slate-500 dark:text-white/65">{t.humidity}</div>
          <div className="mt-1.5 flex items-baseline gap-1">
            <span className="font-mono text-xl font-semibold tabular-nums text-slate-900 dark:text-white">
              {Math.round(current.humidity)}
            </span>
            <span className="font-mono text-xs text-slate-500 dark:text-white/60">%</span>
          </div>
          <div className="mt-1 font-mono text-xs tabular-nums text-slate-500 dark:text-white/60">
            {t.dewPoint} {formatTemp(current.dewPoint, unit)}°
          </div>
        </div>

        <div className="border-b border-e border-slate-900/10 dark:border-white/15 p-4 sm:border-e-0 sm:p-5 lg:border-b-0 lg:border-e">
          <div className="text-xs font-medium text-slate-500 dark:text-white/65">{t.pressure}</div>
          <div className="mt-1.5 flex items-baseline gap-1">
            <span className="font-mono text-xl font-semibold tabular-nums text-slate-900 dark:text-white">
              {Math.round(current.pressure)}
            </span>
            <span className="font-mono text-xs text-slate-500 dark:text-white/60">{t.unitLabels.hpa}</span>
          </div>
          <div className="mt-1 text-xs text-slate-500 dark:text-white/60">{t.surfaceLevel}</div>
        </div>

        <div className="border-b border-slate-900/10 dark:border-white/15 p-4 sm:border-b-0 sm:border-e sm:p-5">
          <div className="text-xs font-medium text-slate-500 dark:text-white/65">{t.uvIndex}</div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="font-mono text-xl font-semibold tabular-nums text-slate-900 dark:text-white">
              {current.uvIndex.toFixed(1)}
            </span>
            <span className="text-xs font-medium text-slate-700 dark:text-white/85">
              {localizeUvLabel(current.uvIndex, lang)}
            </span>
          </div>
          <div className="mt-1 font-mono text-xs tabular-nums text-slate-500 dark:text-white/60">
            {t.peak} {today ? today.uvIndexMax.toFixed(1) : '—'}
          </div>
        </div>

        <div className="border-e border-slate-900/10 dark:border-white/15 p-4 sm:p-5">
          <div className="text-xs font-medium text-slate-500 dark:text-white/65">{t.visibility}</div>
          <div className="mt-1.5 flex items-baseline gap-1">
            <span className="font-mono text-xl font-semibold tabular-nums text-slate-900 dark:text-white">
              {visibilityParts[0]}
            </span>
            <span className="font-mono text-xs text-slate-500 dark:text-white/60">{visibilityUnit}</span>
          </div>
          <div className="mt-1 font-mono text-xs tabular-nums text-slate-500 dark:text-white/60">
            {t.precip} {current.precipitation.toFixed(1)} {t.unitLabels.mm}
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <div className="text-xs font-medium text-slate-500 dark:text-white/65">{t.daylight}</div>
          <div className="mt-1.5 font-mono text-xl font-semibold tabular-nums text-slate-900 dark:text-white">
            {today ? formatClockTime(today.sunrise) : '—'}
          </div>
          <div className="mt-1 font-mono text-xs tabular-nums text-slate-500 dark:text-white/60">
            {t.sunset} {today ? formatClockTime(today.sunset) : '—'}
          </div>
        </div>
      </div>
    </section>
  );
}
