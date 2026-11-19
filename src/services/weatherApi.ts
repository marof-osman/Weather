import type {
  DailyPoint,
  GeocodingResult,
  HourlyPoint,
  SavedLocation,
  WeatherForecast,
} from '../types/weather';

const FORECAST_BASE_URL = 'https://api.open-meteo.com/v1/forecast';
const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search';

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
  return timePart.slice(0, 5);
}

function formatHourLabel(isoString: string, index: number): string {
  if (index === 0) return 'Now';
  const timePart = isoString.split('T')[1];
  if (!timePart) return isoString;
  return timePart.slice(0, 5);
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

export async function searchCities(query: string, signal?: AbortSignal): Promise<SavedLocation[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const params = new URLSearchParams({
    name: trimmed,
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
