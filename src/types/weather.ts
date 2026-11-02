// Tipos de domínio e das respostas cruas da API Open-Meteo.

/* ---------- Respostas cruas da API (snake_case) ---------- */

export type GeocodingResult = {
  name: string;
  latitude: number;
  longitude: number;
  country_code: string;
  timezone: string;
};

export type GeocodingResponse = {
  results?: GeocodingResult[];
};

export type ForecastCurrent = {
  time: string;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  is_day: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  precipitation_probability: number;
  weather_code: number;
  precipitation?: number;
};

export type ForecastCurrentUnits = {
  [K in keyof ForecastCurrent]-?: string;
};

export type ForecastResponse = {
  current?: ForecastCurrent;
  current_units?: ForecastCurrentUnits;
};

// Resposta do forecast já validada (current e current_units presentes).
export type WeatherResult = {
  current: ForecastCurrent;
  current_units: ForecastCurrentUnits;
};

/* ---------- Tipos de domínio (camelCase) ---------- */

export type CityLocation = {
  name: string;
  latitude: number;
  longitude: number;
  countryCode: string;
  timezone: string;
};

export type CurrentWeather = {
  time: string; // "2026-10-28T17:45" (horário local da cidade)
  temperature: number;
  relativeHumidity: number;
  apparentTemperature: number;
  isDay: boolean;
  windSpeed: number;
  windDirection: number; // graus 0–360
  precipitationProbability: number;
  weatherCode: number;
  units: {
    temperature: string;
    relativeHumidity: string;
    apparentTemperature: string;
    windSpeed: string;
    windDirection: string;
    precipitationProbability: string;
  };
};

export type CombinedWeatherData = {
  location: CityLocation;
  weather: CurrentWeather;
};
