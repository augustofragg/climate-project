// Camada de serviço: toda comunicação com a API Open-Meteo passa por aqui.

import type {
  CombinedWeatherData,
  ForecastCurrent,
  ForecastCurrentUnits,
  ForecastResponse,
  GeocodingResponse,
  GeocodingResult,
  WeatherResult,
} from '../types/weather';

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

const CURRENT_FIELDS = [
  'precipitation_probability',
  'temperature_2m',
  'relative_humidity_2m',
  'apparent_temperature',
  'is_day',
  'wind_speed_10m',
  'wind_direction_10m',
  'precipitation',
  'weather_code',
] as const;

// Campos de `current` sem os quais o forecast é considerado falho (PRD §3.3.2).
const REQUIRED_CURRENT_FIELDS = [
  'temperature_2m',
  'relative_humidity_2m',
  'apparent_temperature',
  'is_day',
  'wind_speed_10m',
  'wind_direction_10m',
  'precipitation_probability',
] as const;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim() !== '';
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function isValidGeocodingResult(value: unknown): value is GeocodingResult {
  if (typeof value !== 'object' || value === null) return false;
  const result = value as Record<string, unknown>;
  return (
    isNonEmptyString(result.name) &&
    isFiniteNumber(result.latitude) &&
    isFiniteNumber(result.longitude) &&
    isNonEmptyString(result.country_code) &&
    isNonEmptyString(result.timezone)
  );
}

// Busca cidade por nome → retorna dados de geocoding ou null.
export async function searchCity(cityName: string): Promise<GeocodingResult | null> {
  if (!isNonEmptyString(cityName)) return null;

  const params = new URLSearchParams({
    name: cityName.trim(),
    count: '1',
    language: 'pt',
    format: 'json',
  });

  try {
    const response = await fetch(`${GEOCODING_URL}?${params}`);
    if (!response.ok) return null;

    const data = (await response.json()) as GeocodingResponse;
    const first = data.results?.[0];
    if (!isValidGeocodingResult(first)) return null;

    const { name, latitude, longitude, country_code, timezone } = first;
    return { name, latitude, longitude, country_code, timezone };
  } catch {
    return null;
  }
}

function isValidCurrent(value: unknown): value is ForecastCurrent {
  if (typeof value !== 'object' || value === null) return false;
  const current = value as Record<string, unknown>;
  return REQUIRED_CURRENT_FIELDS.every((field) => isFiniteNumber(current[field]));
}

function isValidCurrentUnits(value: unknown): value is ForecastCurrentUnits {
  if (typeof value !== 'object' || value === null) return false;
  const units = value as Record<string, unknown>;
  return REQUIRED_CURRENT_FIELDS.every((field) => typeof units[field] === 'string');
}

// Busca clima por coordenadas → retorna dados de forecast ou null.
export async function getWeather(
  latitude: number,
  longitude: number,
  timezone: string,
): Promise<WeatherResult | null> {
  if (!isFiniteNumber(latitude) || !isFiniteNumber(longitude) || !isNonEmptyString(timezone)) {
    return null;
  }

  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: CURRENT_FIELDS.join(','),
    timezone,
  });

  try {
    const response = await fetch(`${FORECAST_URL}?${params}`);
    if (!response.ok) return null;

    const data = (await response.json()) as ForecastResponse;
    if (!isValidCurrent(data.current) || !isValidCurrentUnits(data.current_units)) return null;

    return { current: data.current, current_units: data.current_units };
  } catch {
    return null;
  }
}

// Orquestra geocoding → forecast (sequencial) e retorna o resultado combinado ou null.
export async function searchWeather(cityName: string): Promise<CombinedWeatherData | null> {
  const city = await searchCity(cityName);
  if (!city) return null;

  const weather = await getWeather(city.latitude, city.longitude, city.timezone);
  if (!weather) return null;

  const { current, current_units: units } = weather;

  return {
    location: {
      name: city.name,
      latitude: city.latitude,
      longitude: city.longitude,
      countryCode: city.country_code,
      timezone: city.timezone,
    },
    weather: {
      time: current.time,
      temperature: current.temperature_2m,
      relativeHumidity: current.relative_humidity_2m,
      apparentTemperature: current.apparent_temperature,
      isDay: current.is_day === 1,
      windSpeed: current.wind_speed_10m,
      windDirection: current.wind_direction_10m,
      precipitationProbability: current.precipitation_probability,
      weatherCode: current.weather_code,
      units: {
        temperature: units.temperature_2m,
        relativeHumidity: units.relative_humidity_2m,
        apparentTemperature: units.apparent_temperature,
        windSpeed: units.wind_speed_10m,
        windDirection: units.wind_direction_10m,
        precipitationProbability: units.precipitation_probability,
      },
    },
  };
}
