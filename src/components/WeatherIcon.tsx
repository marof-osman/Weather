import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudMoon,
  CloudRain,
  CloudSnow,
  CloudSun,
  Moon,
  Sun,
} from 'lucide-react';
import { describeWeatherCode } from '../services/weatherApi';

interface WeatherIconProps {
  code: number;
  isDay?: boolean;
  className?: string;
}

export function WeatherIcon({ code, isDay = true, className = 'w-5 h-5' }: WeatherIconProps) {
  const { kind } = describeWeatherCode(code);

  switch (kind) {
    case 'clear':
      return isDay ? (
        <Sun className={`${className} text-amber-500 dark:text-amber-300 dark:drop-shadow-[0_2px_10px_rgba(252,211,77,0.45)]`} aria-hidden="true" />
      ) : (
        <Moon className={`${className} text-indigo-600 dark:text-indigo-200 dark:drop-shadow-[0_2px_10px_rgba(199,210,254,0.35)]`} aria-hidden="true" />
      );
    case 'partly-cloudy':
      return isDay ? (
        <CloudSun className={`${className} text-amber-500 dark:text-amber-200`} aria-hidden="true" />
      ) : (
        <CloudMoon className={`${className} text-slate-600 dark:text-slate-200`} aria-hidden="true" />
      );
    case 'cloudy':
      return <Cloud className={`${className} text-slate-600 dark:text-white/90`} aria-hidden="true" />;
    case 'fog':
      return <CloudFog className={`${className} text-slate-500 dark:text-slate-300`} aria-hidden="true" />;
    case 'drizzle':
      return <CloudDrizzle className={`${className} text-sky-600 dark:text-sky-300`} aria-hidden="true" />;
    case 'rain':
    case 'showers':
      return <CloudRain className={`${className} text-blue-600 dark:text-sky-300`} aria-hidden="true" />;
    case 'snow':
      return <CloudSnow className={`${className} text-cyan-600 dark:text-cyan-200`} aria-hidden="true" />;
    case 'thunderstorm':
      return <CloudLightning className={`${className} text-amber-600 dark:text-amber-300`} aria-hidden="true" />;
    default:
      return <Cloud className={`${className} text-slate-600 dark:text-white/85`} aria-hidden="true" />;
  }
}
