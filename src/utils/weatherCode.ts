// Mapeamento de códigos WMO para descrição em português e ícone.

interface WeatherCodeInfo {
  description: string;
  icon: string;
}

const UNKNOWN: WeatherCodeInfo = { description: 'Condição desconhecida', icon: '❔' };

const NIGHT_ICON = '🌙';
const CODES_WITH_NIGHT_ICON = new Set([0, 1]);

const WEATHER_CODES: Readonly<Record<number, WeatherCodeInfo>> = {
  0: { description: 'Céu limpo', icon: '☀️' },
  1: { description: 'Predominantemente limpo', icon: '🌤️' },
  2: { description: 'Parcialmente nublado', icon: '⛅' },
  3: { description: 'Nublado', icon: '☁️' },
  45: { description: 'Neblina', icon: '🌫️' },
  48: { description: 'Neblina com geada', icon: '🌫️' },
  51: { description: 'Garoa leve', icon: '🌦️' },
  53: { description: 'Garoa moderada', icon: '🌦️' },
  55: { description: 'Garoa intensa', icon: '🌧️' },
  56: { description: 'Garoa congelante leve', icon: '🌧️' },
  57: { description: 'Garoa congelante intensa', icon: '🌧️' },
  61: { description: 'Chuva leve', icon: '🌦️' },
  63: { description: 'Chuva moderada', icon: '🌧️' },
  65: { description: 'Chuva forte', icon: '🌧️' },
  66: { description: 'Chuva congelante leve', icon: '🌧️' },
  67: { description: 'Chuva congelante forte', icon: '🌧️' },
  71: { description: 'Neve leve', icon: '🌨️' },
  73: { description: 'Neve moderada', icon: '🌨️' },
  75: { description: 'Neve forte', icon: '❄️' },
  77: { description: 'Grãos de neve', icon: '🌨️' },
  80: { description: 'Pancadas de chuva leves', icon: '🌦️' },
  81: { description: 'Pancadas de chuva moderadas', icon: '🌧️' },
  82: { description: 'Pancadas de chuva violentas', icon: '⛈️' },
  85: { description: 'Pancadas de neve leves', icon: '🌨️' },
  86: { description: 'Pancadas de neve fortes', icon: '❄️' },
  95: { description: 'Tempestade leve ou moderada', icon: '⛈️' },
  96: { description: 'Tempestade com granizo leve', icon: '⛈️' },
  99: { description: 'Tempestade com granizo forte', icon: '⛈️' },
};

function lookup(code: number): WeatherCodeInfo {
  return WEATHER_CODES[code] ?? UNKNOWN;
}

export function getWeatherDescription(code: number): string {
  return lookup(code).description;
}

export function getWeatherIcon(code: number, isDay: boolean): string {
  if (!isDay && CODES_WITH_NIGHT_ICON.has(code)) return NIGHT_ICON;
  return lookup(code).icon;
}
