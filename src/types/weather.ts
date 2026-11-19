export type TemperatureUnit = 'celsius' | 'fahrenheit';

export interface SavedLocation {
  id: string;
  name: string;
  admin1?: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone?: string;
}

export interface CurrentWeather {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  isDay: boolean;
  precipitation: number;
  weatherCode: number;
  cloudCover: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  uvIndex: number;
  visibility: number;
  dewPoint: number;
  time: string;
}

export interface HourlyPoint {
  time: string;
  hourLabel: string;
  temperature: number;
  apparentTemperature: number;
  precipitationProbability: number;
  precipitation: number;
  weatherCode: number;
  windSpeed: number;
  humidity: number;
  isDay: boolean;
}

export interface DailyPoint {
  date: string;
  dayName: string;
  shortDate: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  precipitationProbabilityMax: number;
  precipitationSum: number;
  windSpeedMax: number;
  uvIndexMax: number;
  sunrise: string;
  sunset: string;
}

export interface WeatherForecast {
  location: SavedLocation;
  timezone: string;
  timezoneAbbreviation: string;
  utcOffsetSeconds: number;
  elevation: number;
  fetchedAt: number;
  current: CurrentWeather;
  hourly: HourlyPoint[];
  daily: DailyPoint[];
}

export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  country_code?: string;
  admin1?: string;
  timezone?: string;
}
