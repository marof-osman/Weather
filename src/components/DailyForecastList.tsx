import { ChevronDown, Droplets } from 'lucide-react';
import { Fragment, useState } from 'react';
import {
  formatLocalizedDayLabel,
  TRANSLATIONS,
  translateWeatherCode,
  type LanguageCode,
} from '../i18n/translations';
import {
  describeWeatherCode,
  formatClockTime,
  formatSpeed,
  formatTemp,
} from '../services/weatherApi';
import type { DailyPoint, TemperatureUnit } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';

interface DailyForecastListProps {
  daily: DailyPoint[];
  unit: TemperatureUnit;
  lang: LanguageCode;
}

export function DailyForecastList({ daily, unit, lang }: DailyForecastListProps) {
  const t = TRANSLATIONS[lang];
  const [expandedDate, setExpandedDate] = useState<string | null>(null);

  if (daily.length === 0) return null;

  const weekMins = daily.map((d) => formatTemp(d.tempMin, unit));
  const weekMaxs = daily.map((d) => formatTemp(d.tempMax, unit));
  const globalMin = Math.min(...weekMins);
  const globalMax = Math.max(...weekMaxs);
  const span = Math.max(globalMax - globalMin, 1);
  const windUnit = unit === 'celsius' ? t.unitLabels.kmh : t.unitLabels.mph;

  return (
    <section
      aria-label={t.outlook7Day}
      className="glass-panel rounded-3xl overflow-hidden"
    >
      <div className="flex items-center justify-between border-b border-slate-900/10 dark:border-white/15 px-6 py-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">{t.outlook7Day}</h2>
          <p className="text-xs text-slate-500 dark:text-white/65">{t.outlook7DayHint}</p>
        </div>
        <span dir="ltr" className="font-mono text-xs tabular-nums text-slate-500 dark:text-white/65">
          {globalMin}° – {globalMax}°{unit === 'celsius' ? 'C' : 'F'}
        </span>
      </div>

      <div className="divide-y divide-slate-900/10 dark:divide-white/12">
        {daily.map((day, idx) => {
          const minT = formatTemp(day.tempMin, unit);
          const maxT = formatTemp(day.tempMax, unit);
          const leftPct = ((minT - globalMin) / span) * 100;
          const widthPct = Math.max(6, ((maxT - minT) / span) * 100);
          const condition = translateWeatherCode(
            day.weatherCode,
            lang,
            describeWeatherCode(day.weatherCode),
          );
          const { dayName, shortDate } = formatLocalizedDayLabel(day.date, idx, lang);
          const isExpanded = expandedDate === day.date;
          const maxWind = formatSpeed(day.windSpeedMax, unit);

          return (
            <Fragment key={day.date}>
              <button
                type="button"
                aria-expanded={isExpanded}
                onClick={() => setExpandedDate(isExpanded ? null : day.date)}
                className="flex w-full items-center gap-3 px-4 py-3.5 text-start transition-colors hover:bg-white/35 dark:hover:bg-white/[0.08] sm:gap-5 sm:px-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-600/50 dark:focus-visible:ring-white/60"
              >
                <div className="w-24 shrink-0 sm:w-28">
                  <div className="text-sm font-medium text-slate-900 dark:text-white">{dayName}</div>
                  <div className="font-mono text-xs tabular-nums text-slate-500 dark:text-white/60">
                    {shortDate}
                  </div>
                </div>

                <div className="flex min-w-0 flex-1 items-center gap-2.5">
                  <WeatherIcon code={day.weatherCode} isDay className="h-5 w-5 shrink-0" />
                  <span className="truncate text-sm text-slate-700 dark:text-white/85">
                    {condition.shortLabel}
                  </span>
                </div>

                <div className="hidden w-14 shrink-0 items-center justify-end gap-1 font-mono text-xs tabular-nums text-sky-700 dark:text-sky-200 sm:flex">
                  {day.precipitationProbabilityMax > 0 ? (
                    <>
                      <Droplets className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span>{day.precipitationProbabilityMax}%</span>
                    </>
                  ) : (
                    <span className="text-slate-400 dark:text-white/35">—</span>
                  )}
                </div>

                {/* Min-to-max thermal range bar */}
                <div dir="ltr" className="flex shrink-0 items-center gap-2.5 sm:gap-3">
                  <span className="w-8 text-right font-mono text-sm tabular-nums text-slate-500 dark:text-white/65">
                    {minT}°
                  </span>
                  <div className="relative hidden h-1.5 w-24 overflow-hidden rounded-full bg-slate-900/10 dark:bg-white/15 md:block lg:w-32">
                    <div
                      className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-sky-500 via-blue-600 to-amber-500 dark:from-sky-300 dark:via-white dark:to-amber-300"
                      style={{
                        left: `${leftPct}%`,
                        width: `${Math.min(widthPct, 100 - leftPct)}%`,
                      }}
                    />
                  </div>
                  <span className="w-8 text-right font-mono text-sm font-semibold tabular-nums text-slate-900 dark:text-white">
                    {maxT}°
                  </span>
                </div>

                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-slate-400 dark:text-white/60 transition-transform duration-150 ${
                    isExpanded ? 'rotate-180 text-slate-700 dark:text-white' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>

              {isExpanded && (
                <div className="grid grid-cols-2 gap-4 bg-white/35 dark:bg-white/[0.06] px-6 py-4 text-xs sm:grid-cols-3">
                  <div>
                    <div className="text-slate-500 dark:text-white/60">{t.precipitation}</div>
                    <div className="mt-1 font-mono text-sm font-medium tabular-nums text-slate-900 dark:text-white">
                      {day.precipitationSum.toFixed(1)} {t.unitLabels.mm} · {day.precipitationProbabilityMax}%
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-500 dark:text-white/60">{t.maxWind}</div>
                    <div className="mt-1 font-mono text-sm font-medium tabular-nums text-slate-900 dark:text-white">
                      {maxWind.value} {windUnit}
                    </div>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <div className="text-slate-500 dark:text-white/60">{t.sunriseSunset}</div>
                    <div
                      dir="ltr"
                      className="mt-1 inline-block font-mono text-sm font-medium tabular-nums text-slate-900 dark:text-white"
                    >
                      {formatClockTime(day.sunrise)} / {formatClockTime(day.sunset)}
                    </div>
                  </div>
                </div>
              )}
            </Fragment>
          );
        })}
      </div>
    </section>
  );
}
