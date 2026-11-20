import { Droplets } from 'lucide-react';
import { useState } from 'react';
import {
  TRANSLATIONS,
  translateWeatherCode,
  type LanguageCode,
} from '../i18n/translations';
import { describeWeatherCode, formatSpeed, formatTemp } from '../services/weatherApi';
import type { HourlyPoint, TemperatureUnit } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';

interface HourlyForecastChartProps {
  hourly: HourlyPoint[];
  unit: TemperatureUnit;
  lang: LanguageCode;
  isDark: boolean;
}

export function HourlyForecastChart({ hourly, unit, lang, isDark }: HourlyForecastChartProps) {
  const t = TRANSLATIONS[lang];
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  if (hourly.length === 0) return null;

  const safeIndex = Math.min(selectedIndex, hourly.length - 1);
  const activePoint = hourly[safeIndex];
  const temps = hourly.map((h) => formatTemp(h.temperature, unit));
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);
  const tempSpan = Math.max(maxTemp - minTemp, 4);

  const svgWidth = 760;
  const svgHeight = 160;
  const padX = 20;
  const padTop = 26;
  const padBottom = 28;
  const plotWidth = svgWidth - padX * 2;
  const plotHeight = svgHeight - padTop - padBottom;

  const points = hourly.map((item, idx) => {
    const temp = formatTemp(item.temperature, unit);
    const x = padX + (idx / Math.max(hourly.length - 1, 1)) * plotWidth;
    const y = padTop + (1 - (temp - minTemp) / tempSpan) * plotHeight;
    return { x, y, temp, item, idx };
  });

  const linePath = points
    .map((pt, idx) => `${idx === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`)
    .join(' ');

  const areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${(
    svgHeight - padBottom
  ).toFixed(1)} L ${points[0].x.toFixed(1)} ${(svgHeight - padBottom).toFixed(1)} Z`;

  const activePt = points[safeIndex];
  const activeWind = formatSpeed(activePoint.windSpeed, unit);
  const windUnit = unit === 'celsius' ? t.unitLabels.kmh : t.unitLabels.mph;
  const activeCondition = translateWeatherCode(
    activePoint.weatherCode,
    lang,
    describeWeatherCode(activePoint.weatherCode),
  );

  function labelForHour(item: HourlyPoint, idx: number): string {
    return idx === 0 ? t.now : item.hourLabel;
  }

  const lineStroke = isDark ? '#FFFFFF' : '#0284C7';
  const dotFillInactive = isDark ? 'rgba(255,255,255,0.45)' : '#FFFFFF';
  const dotFillActive = isDark ? '#FFFFFF' : '#0284C7';
  const gridLineColor = isDark ? 'rgba(255,255,255,0.18)' : 'rgba(15,23,42,0.12)';
  const midLineColor = isDark ? 'rgba(255,255,255,0.10)' : 'rgba(15,23,42,0.06)';
  const cursorLineColor = isDark ? 'rgba(255,255,255,0.45)' : 'rgba(2,132,199,0.45)';
  const precipBarColor = isDark ? '#7DD3FC' : '#0284C7';

  return (
    <section
      aria-label={t.next24Hours}
      className="glass-panel flex flex-col rounded-3xl overflow-hidden"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-900/10 dark:border-white/15 px-6 py-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">{t.next24Hours}</h2>
          <p className="text-xs text-slate-500 dark:text-white/65">{t.next24HoursHint}</p>
        </div>

        {/* Live selected-hour readout */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-700 dark:text-white/80">
          <div className="flex items-center gap-2">
            <WeatherIcon
              code={activePoint.weatherCode}
              isDay={activePoint.isDay}
              className="h-4 w-4"
            />
            <span
              dir={safeIndex === 0 ? undefined : 'ltr'}
              className="font-mono font-medium tabular-nums text-slate-900 dark:text-white"
            >
              {labelForHour(activePoint, safeIndex)}
            </span>
            <span className="text-slate-400 dark:text-white/40">·</span>
            <span>{activeCondition.shortLabel}</span>
          </div>
          <div dir="ltr" className="font-mono font-semibold tabular-nums text-slate-900 dark:text-white">
            {formatTemp(activePoint.temperature, unit)}°{unit === 'celsius' ? 'C' : 'F'}
          </div>
          <div className="flex items-center gap-1 font-mono tabular-nums text-sky-700 dark:text-sky-200">
            <Droplets className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{activePoint.precipitationProbability}%</span>
          </div>
          <div className="hidden sm:block font-mono tabular-nums text-slate-500 dark:text-white/65">
            {t.wind} {activeWind.value} {windUnit}
          </div>
        </div>
      </div>

      {/* SVG Temperature Curve + Precipitation Bars */}
      <div dir="ltr" className="px-4 pt-5 pb-2 sm:px-6">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="h-40 w-full overflow-visible"
          role="img"
          aria-label={t.next24Hours}
        >
          <defs>
            <linearGradient id="glassTempAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={lineStroke} stopOpacity={isDark ? '0.30' : '0.22'} />
              <stop offset="100%" stopColor={lineStroke} stopOpacity="0.02" />
            </linearGradient>
          </defs>

          <line
            x1={padX}
            y1={padTop}
            x2={svgWidth - padX}
            y2={padTop}
            stroke={gridLineColor}
            strokeDasharray="3 3"
          />
          <line
            x1={padX}
            y1={padTop + plotHeight / 2}
            x2={svgWidth - padX}
            y2={padTop + plotHeight / 2}
            stroke={midLineColor}
          />
          <line
            x1={padX}
            y1={svgHeight - padBottom}
            x2={svgWidth - padX}
            y2={svgHeight - padBottom}
            stroke={gridLineColor}
          />

          {points.map((pt) => {
            const prob = pt.item.precipitationProbability;
            if (prob <= 0) return null;
            const barHeight = Math.max(3, (prob / 100) * (plotHeight * 0.45));
            return (
              <rect
                key={`precip-${pt.item.time}`}
                x={pt.x - 4}
                y={svgHeight - padBottom - barHeight}
                width={8}
                height={barHeight}
                rx={3}
                fill={precipBarColor}
                fillOpacity={pt.idx === safeIndex ? 0.55 : 0.25}
              />
            );
          })}

          <path d={areaPath} fill="url(#glassTempAreaGrad)" />
          <path
            d={linePath}
            fill="none"
            stroke={lineStroke}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <line
            x1={activePt.x}
            y1={padTop - 6}
            x2={activePt.x}
            y2={svgHeight - padBottom}
            stroke={cursorLineColor}
            strokeDasharray="2 2"
          />

          {points.map((pt) => {
            const isSelected = pt.idx === safeIndex;
            const showLabel = pt.idx % 3 === 0 || isSelected;
            return (
              <g key={pt.item.time}>
                {showLabel && (
                  <>
                    <text
                      x={pt.x}
                      y={pt.y - 10}
                      textAnchor="middle"
                      className={`font-mono text-[11px] tabular-nums ${
                        isSelected
                          ? 'fill-sky-700 dark:fill-white font-semibold'
                          : 'fill-slate-600 dark:fill-white/75'
                      }`}
                    >
                      {pt.temp}°
                    </text>
                    <text
                      x={pt.x}
                      y={svgHeight - 8}
                      textAnchor="middle"
                      className={`font-mono text-[10px] tabular-nums ${
                        isSelected
                          ? 'fill-slate-900 dark:fill-white font-semibold'
                          : 'fill-slate-500 dark:fill-white/60'
                      }`}
                    >
                      {labelForHour(pt.item, pt.idx)}
                    </text>
                  </>
                )}

                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isSelected ? 5 : 2.5}
                  fill={isSelected ? dotFillActive : dotFillInactive}
                  stroke={lineStroke}
                  strokeWidth={isSelected ? 2 : 1.5}
                />

                <rect
                  x={pt.x - plotWidth / (hourly.length * 2)}
                  y={0}
                  width={plotWidth / hourly.length}
                  height={svgHeight}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setSelectedIndex(pt.idx)}
                  onClick={() => setSelectedIndex(pt.idx)}
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Scrollable frosted hourly strip */}
      <div className="border-t border-slate-900/10 bg-white/25 dark:border-white/15 dark:bg-white/[0.03] px-3 py-3 sm:px-4">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {hourly.map((item, idx) => {
            const isSelected = idx === safeIndex;
            return (
              <button
                key={item.time}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={`flex min-w-[68px] shrink-0 flex-col items-center gap-1.5 rounded-2xl px-2.5 py-2.5 text-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600/50 dark:focus-visible:ring-white/60 ${
                  isSelected
                    ? 'glass-control-active text-slate-900 dark:text-white'
                    : 'border border-transparent bg-white/35 text-slate-700 hover:bg-white/65 dark:bg-white/[0.06] dark:text-white/85 dark:hover:bg-white/[0.14]'
                }`}
              >
                <span
                  dir={idx === 0 ? undefined : 'ltr'}
                  className="font-mono text-xs tabular-nums text-slate-500 dark:text-white/70"
                >
                  {labelForHour(item, idx)}
                </span>
                <WeatherIcon
                  code={item.weatherCode}
                  isDay={item.isDay}
                  className="h-4 w-4"
                />
                <span dir="ltr" className="font-mono text-sm font-semibold tabular-nums text-slate-900 dark:text-white">
                  {formatTemp(item.temperature, unit)}°
                </span>
                <span className="font-mono text-[11px] tabular-nums text-sky-700 dark:text-sky-200">
                  {item.precipitationProbability > 0 ? `${item.precipitationProbability}%` : '—'}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
