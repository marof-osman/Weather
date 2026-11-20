import type { LanguageCode } from '../i18n/translations';
import type {
  DailyPoint,
  GeocodingResult,
  HourlyPoint,
  SavedLocation,
  WeatherForecast,
} from '../types/weather';

const FORECAST_BASE_URL = 'https://api.open-meteo.com/v1/forecast';
const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const NOMINATIM_SEARCH_URL = 'https://nominatim.openstreetmap.org/search';

export interface WeatherConditionMeta {
  label: string;
  shortLabel: string;
  kind:
    | 'clear'
    | 'partly-cloudy'
    | 'cloudy'
    | 'fog'
    | 'drizzle'
    | 'rain'
    | 'snow'
    | 'showers'
    | 'thunderstorm';
}

export function describeWeatherCode(code: number): WeatherConditionMeta {
  switch (code) {
    case 0:
      return { label: 'Clear sky', shortLabel: 'Clear', kind: 'clear' };
    case 1:
      return { label: 'Mainly clear', shortLabel: 'Mostly clear', kind: 'clear' };
    case 2:
      return { label: 'Partly cloudy', shortLabel: 'Partly cloudy', kind: 'partly-cloudy' };
    case 3:
      return { label: 'Overcast', shortLabel: 'Overcast', kind: 'cloudy' };
    case 45:
    case 48:
      return { label: 'Fog', shortLabel: 'Fog', kind: 'fog' };
    case 51:
    case 53:
    case 55:
      return { label: 'Drizzle', shortLabel: 'Drizzle', kind: 'drizzle' };
    case 56:
    case 57:
      return { label: 'Freezing drizzle', shortLabel: 'Freezing drizzle', kind: 'drizzle' };
    case 61:
    case 63:
    case 65:
      return { label: 'Rain', shortLabel: 'Rain', kind: 'rain' };
    case 66:
    case 67:
      return { label: 'Freezing rain', shortLabel: 'Freezing rain', kind: 'rain' };
    case 71:
    case 73:
    case 75:
    case 77:
      return { label: 'Snowfall', shortLabel: 'Snow', kind: 'snow' };
    case 80:
    case 81:
    case 82:
      return { label: 'Rain showers', shortLabel: 'Showers', kind: 'showers' };
    case 85:
    case 86:
      return { label: 'Snow showers', shortLabel: 'Snow showers', kind: 'snow' };
    case 95:
      return { label: 'Thunderstorm', shortLabel: 'Storm', kind: 'thunderstorm' };
    case 96:
    case 99:
      return { label: 'Thunderstorm with hail', shortLabel: 'Hail storm', kind: 'thunderstorm' };
    default:
      return { label: 'Variable conditions', shortLabel: 'Variable', kind: 'cloudy' };
  }
}

export function degreesToCompass(degrees: number): string {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(((degrees % 360) + 360) % 360 / 22.5) % 16;
  return dirs[index];
}

export function describeUvIndex(uv: number): string {
  if (uv < 3) return 'Low';
  if (uv < 6) return 'Moderate';
  if (uv < 8) return 'High';
  if (uv < 11) return 'Very high';
  return 'Extreme';
}

export function formatTemp(celsius: number, unit: 'celsius' | 'fahrenheit'): number {
  if (unit === 'fahrenheit') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
}

export function formatSpeed(kmh: number, unit: 'celsius' | 'fahrenheit'): { value: number; unitLabel: string } {
  if (unit === 'fahrenheit') {
    return { value: Math.round(kmh * 0.621371), unitLabel: 'mph' };
  }
  return { value: Math.round(kmh), unitLabel: 'km/h' };
}

export function formatVisibility(meters: number, unit: 'celsius' | 'fahrenheit'): string {
  if (unit === 'fahrenheit') {
    const miles = meters / 1609.344;
    return `${miles >= 10 ? Math.round(miles) : miles.toFixed(1)} mi`;
  }
  const km = meters / 1000;
  return `${km >= 10 ? Math.round(km) : km.toFixed(1)} km`;
}

export function formatClockTime(isoString: string): string {
  // Open-Meteo returns local ISO strings like "2026-11-19T08:15" when timezone=auto
  const timePart = isoString.split('T')[1];
  if (!timePart) return isoString;
  const [hourStr, minuteStr = '00'] = timePart.slice(0, 5).split(':');
  const hour24 = Number(hourStr);
  if (Number.isNaN(hour24)) return timePart.slice(0, 5);
  const period = hour24 >= 12 ? 'PM' : 'AM';
  const hour12 = hour24 % 12 || 12;
  return `${hour12}:${minuteStr} ${period}`;
}

function formatHourLabel(isoString: string, index: number): string {
  if (index === 0) return 'Now';
  const timePart = isoString.split('T')[1];
  if (!timePart) return isoString;
  const [hourStr] = timePart.slice(0, 5).split(':');
  const hour24 = Number(hourStr);
  if (Number.isNaN(hour24)) return timePart.slice(0, 5);
  const period = hour24 >= 12 ? 'PM' : 'AM';
  const hour12 = hour24 % 12 || 12;
  return `${hour12} ${period}`;
}

function formatDayLabels(dateStr: string, index: number): { dayName: string; shortDate: string } {
  const [year, month, day] = dateStr.split('-').map(Number);
  const utcDate = new Date(Date.UTC(year, month - 1, day));
  const shortDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(utcDate);

  if (index === 0) {
    return { dayName: 'Today', shortDate };
  }
  if (index === 1) {
    return { dayName: 'Tomorrow', shortDate };
  }
  const dayName = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    timeZone: 'UTC',
  }).format(utcDate);
  return { dayName, shortDate };
}

interface NominatimSearchResult {
  place_id: number;
  osm_id: number;
  lat: string;
  lon: string;
  name?: string;
  display_name: string;
  addresstype?: string;
  type?: string;
  category?: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    state?: string;
    region?: string;
    country?: string;
  };
}

const ARABIC_KURDISH_SCRIPT_RE = /[\u0600-\u06FF]/;
const KURDISH_LATIN_CHAR_RE = /[êîûçşÊÎÛÇŞ]/;

async function searchOpenMeteo(query: string, signal?: AbortSignal): Promise<SavedLocation[]> {
  const params = new URLSearchParams({
    name: query,
    count: '8',
    language: 'en',
    format: 'json',
  });

  const response = await fetch(`${GEOCODING_BASE_URL}?${params.toString()}`, { signal });
  if (!response.ok) {
    throw new Error('Unable to search locations right now.');
  }

  const data = (await response.json()) as { results?: GeocodingResult[] };
  if (!data.results) return [];

  return data.results.map((item) => ({
    id: `${item.id}`,
    name: item.name,
    admin1: item.admin1,
    country: item.country,
    latitude: item.latitude,
    longitude: item.longitude,
    timezone: item.timezone,
  }));
}

async function searchNominatimKurdish(
  query: string,
  acceptLanguage: string,
  signal?: AbortSignal,
): Promise<SavedLocation[]> {
  const params = new URLSearchParams({
    q: query,
    format: 'jsonv2',
    addressdetails: '1',
    featureType: 'settlement',
    limit: '12',
    'accept-language': acceptLanguage,
  });

  const response = await fetch(`${NOMINATIM_SEARCH_URL}?${params.toString()}`, { signal });
  if (!response.ok) {
    throw new Error('Unable to search locations right now.');
  }

  const data = (await response.json()) as NominatimSearchResult[];
  if (!Array.isArray(data)) return [];

  const settlementTypes = new Set(['city', 'town', 'village', 'municipality', 'hamlet', 'suburb']);
  const sorted = [...data].sort((a, b) => {
    const aIsSettlement = settlementTypes.has(a.addresstype || a.type || '') ? 0 : 1;
    const bIsSettlement = settlementTypes.has(b.addresstype || b.type || '') ? 0 : 1;
    return aIsSettlement - bIsSettlement;
  });

  const seen = new Set<string>();
  const mapped: SavedLocation[] = [];

  for (const item of sorted) {
    const latitude = Number.parseFloat(item.lat);
    const longitude = Number.parseFloat(item.lon);
    if (Number.isNaN(latitude) || Number.isNaN(longitude)) continue;

    const name =
      item.name ||
      item.address?.city ||
      item.address?.town ||
      item.address?.village ||
      item.address?.municipality ||
      item.display_name.split(',')[0].trim();

    if (!name) continue;

    const dedupeKey = `${name.toLowerCase()}-${latitude.toFixed(1)}-${longitude.toFixed(1)}`;
    const osmKey = `osm-${item.osm_id}`;
    if (seen.has(dedupeKey) || seen.has(osmKey)) continue;
    seen.add(dedupeKey);
    seen.add(osmKey);

    const rawAdmin = item.address?.state || item.address?.region;
    const admin1 = rawAdmin && rawAdmin !== name ? rawAdmin : undefined;
    const country = item.address?.country || '';

    mapped.push({
      id: `osm-${item.place_id}`,
      name,
      admin1,
      country,
      latitude,
      longitude,
    });

    if (mapped.length >= 8) break;
  }

  return mapped;
}

export async function searchCities(
  query: string,
  lang: LanguageCode = 'en',
  signal?: AbortSignal,
): Promise<SavedLocation[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const hasArabicScript = ARABIC_KURDISH_SCRIPT_RE.test(trimmed);
  const hasKurdishLatin = KURDISH_LATIN_CHAR_RE.test(trimmed);

  // Use Nominatim whenever the user types Kurdish (Arabic or Latin Hawar script)
  // or when the app language is set to Kurdish, so localized Kurdish city names work directly.
  if (hasArabicScript) {
    return searchNominatimKurdish(trimmed, 'ckb,ku,en', signal);
  }

  if (hasKurdishLatin || lang !== 'en') {
    const acceptLang =
      lang === 'ku-ba-ar' || lang === 'ku-so'
        ? 'ckb,ku,en'
        : 'ku,en';

    try {
      const kurdishResults = await searchNominatimKurdish(trimmed, acceptLang, signal);
      if (kurdishResults.length > 0) {
        return kurdishResults;
      }
    } catch (err) {
      if ((err as Error).name === 'AbortError') throw err;
    }
    return searchOpenMeteo(trimmed, signal);
  }

  const openMeteoResults = await searchOpenMeteo(trimmed, signal);
  if (openMeteoResults.length > 0) {
    return openMeteoResults;
  }

  // Fallback for transliterated Kurdish city names typed in English mode (e.g., Dihok, Zaxo, Helebce)
  return searchNominatimKurdish(trimmed, 'en,ku,ckb', signal);
}

export async function reverseLookupCity(latitude: number, longitude: number): Promise<SavedLocation> {
  try {
    const params = new URLSearchParams({
      latitude: latitude.toFixed(4),
      longitude: longitude.toFixed(4),
      localityLanguage: 'en',
    });
    const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?${params.toString()}`);
    if (res.ok) {
      const data = (await res.json()) as {
        city?: string;
        locality?: string;
        principalSubdivision?: string;
        countryName?: string;
      };
      const name = data.city || data.locality || data.principalSubdivision || 'Current Location';
      return {
        id: `geo-${latitude.toFixed(2)}-${longitude.toFixed(2)}`,
        name,
        admin1: data.principalSubdivision && data.principalSubdivision !== name ? data.principalSubdivision : undefined,
        country: data.countryName || 'Coordinates',
        latitude,
        longitude,
      };
    }
  } catch {
    // Fall back to coordinate label cleanly
  }

  return {
    id: `geo-${latitude.toFixed(2)}-${longitude.toFixed(2)}`,
    name: 'Current Location',
    country: `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`,
    latitude,
    longitude,
  };
}

export async function fetchWeatherForecast(
  location: SavedLocation,
  signal?: AbortSignal,
): Promise<WeatherForecast> {
  const params = new URLSearchParams({
    latitude: location.latitude.toString(),
    longitude: location.longitude.toString(),
    timezone: 'auto',
    forecast_days: '7',
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'weather_code',
      'cloud_cover',
      'surface_pressure',
      'wind_speed_10m',
      'wind_direction_10m',
      'wind_gusts_10m',
    ].join(','),
    hourly: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'precipitation_probability',
      'precipitation',
      'weather_code',
      'wind_speed_10m',
      'dew_point_2m',
      'visibility',
      'uv_index',
      'is_day',
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'sunrise',
      'sunset',
      'uv_index_max',
      'precipitation_sum',
      'precipitation_probability_max',
      'wind_speed_10m_max',
    ].join(','),
  });

  const response = await fetch(`${FORECAST_BASE_URL}?${params.toString()}`, { signal });
  if (!response.ok) {
    throw new Error(`Weather service returned status ${response.status}.`);
  }

  const raw = await response.json();

  const currentTime: string = raw.current.time;
  const currentHourPrefix = currentTime.slice(0, 13);
  const hourlyTimes: string[] = raw.hourly.time;
  let startIndex = hourlyTimes.findIndex((t) => t.startsWith(currentHourPrefix));
  if (startIndex < 0) startIndex = 0;

  const hourly: HourlyPoint[] = hourlyTimes.slice(startIndex, startIndex + 24).map((time, idx) => {
    const rawIdx = startIndex + idx;
    return {
      time,
      hourLabel: formatHourLabel(time, idx),
      temperature: raw.hourly.temperature_2m[rawIdx],
      apparentTemperature: raw.hourly.apparent_temperature[rawIdx],
      precipitationProbability: raw.hourly.precipitation_probability[rawIdx] ?? 0,
      precipitation: raw.hourly.precipitation[rawIdx] ?? 0,
      weatherCode: raw.hourly.weather_code[rawIdx],
      windSpeed: raw.hourly.wind_speed_10m[rawIdx],
      humidity: raw.hourly.relative_humidity_2m[rawIdx],
      isDay: raw.hourly.is_day[rawIdx] === 1,
    };
  });

  const daily: DailyPoint[] = (raw.daily.time as string[]).map((date, idx) => {
    const { dayName, shortDate } = formatDayLabels(date, idx);
    return {
      date,
      dayName,
      shortDate,
      weatherCode: raw.daily.weather_code[idx],
      tempMax: raw.daily.temperature_2m_max[idx],
      tempMin: raw.daily.temperature_2m_min[idx],
      precipitationProbabilityMax: raw.daily.precipitation_probability_max[idx] ?? 0,
      precipitationSum: raw.daily.precipitation_sum[idx] ?? 0,
      windSpeedMax: raw.daily.wind_speed_10m_max[idx],
      uvIndexMax: raw.daily.uv_index_max[idx] ?? 0,
      sunrise: raw.daily.sunrise[idx],
      sunset: raw.daily.sunset[idx],
    };
  });

  return {
    location: {
      ...location,
      timezone: raw.timezone,
    },
    timezone: raw.timezone,
    timezoneAbbreviation: raw.timezone_abbreviation,
    utcOffsetSeconds: raw.utc_offset_seconds,
    elevation: raw.elevation ?? 0,
    fetchedAt: Date.now(),
    current: {
      temperature: raw.current.temperature_2m,
      apparentTemperature: raw.current.apparent_temperature,
      humidity: raw.current.relative_humidity_2m,
      isDay: raw.current.is_day === 1,
      precipitation: raw.current.precipitation,
      weatherCode: raw.current.weather_code,
      cloudCover: raw.current.cloud_cover,
      pressure: raw.current.surface_pressure,
      windSpeed: raw.current.wind_speed_10m,
      windDirection: raw.current.wind_direction_10m,
      windGusts: raw.current.wind_gusts_10m,
      uvIndex: raw.hourly.uv_index[startIndex] ?? 0,
      visibility: raw.hourly.visibility[startIndex] ?? 10000,
      dewPoint: raw.hourly.dew_point_2m[startIndex] ?? raw.current.temperature_2m,
      time: currentTime,
    },
    hourly,
    daily,
  };
}

export interface CityWeatherSnapshot {
  temperature: number;
  weatherCode: number;
  isDay: boolean;
}

export async function fetchCurrentSnapshots(
  locations: SavedLocation[],
  signal?: AbortSignal,
): Promise<Record<string, CityWeatherSnapshot>> {
  if (locations.length === 0) return {};

  const entries = await Promise.allSettled(
    locations.map(async (loc) => {
      const params = new URLSearchParams({
        latitude: loc.latitude.toString(),
        longitude: loc.longitude.toString(),
        timezone: 'auto',
        current: 'temperature_2m,weather_code,is_day',
      });
      const res = await fetch(`${FORECAST_BASE_URL}?${params.toString()}`, { signal });
      if (!res.ok) throw new Error('Failed snapshot');
      const data = await res.json();
      return [
        loc.id,
        {
          temperature: data.current.temperature_2m as number,
          weatherCode: data.current.weather_code as number,
          isDay: data.current.is_day === 1,
        },
      ] as const;
    }),
  );

  const result: Record<string, CityWeatherSnapshot> = {};
  for (const item of entries) {
    if (item.status === 'fulfilled') {
      const [id, snapshot] = item.value;
      result[id] = snapshot;
    }
  }
  return result;
}
