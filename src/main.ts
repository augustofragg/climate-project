import './style.css'
import sunIcon from './assets/sun.svg'
import moonIcon from './assets/moon.svg'
import { searchWeather } from './services/openMeteo'
import type { CombinedWeatherData } from './types/weather'
import { formatCurrentDate } from './utils/formatDate'
import { getWeatherDescription } from './utils/weatherCode'
import { getCardinalDirection } from './utils/windDirection'

type UiState = 'empty' | 'loading' | 'result'

const form = document.querySelector<HTMLFormElement>('#search-form')!
const input = document.querySelector<HTMLInputElement>('#search-input')!
const button = document.querySelector<HTMLButtonElement>('#search-button')!
const card = document.querySelector<HTMLElement>('#weather-card')!

const sidebar = {
  temperature: document.querySelector<HTMLElement>('#temperature')!,
  location: document.querySelector<HTMLElement>('#location')!,
  date: document.querySelector<HTMLElement>('#current-date')!,
  period: document.querySelector<HTMLElement>('#day-period')!,
  periodIcon: document.querySelector<HTMLImageElement>('#day-period-icon')!,
  condition: document.querySelector<HTMLElement>('#condition')!,
}

const details = {
  humidity: document.querySelector<HTMLElement>('#humidity')!,
  apparentTemperature: document.querySelector<HTMLElement>('#apparent-temperature')!,
  precipitation: document.querySelector<HTMLElement>('#precipitation')!,
  wind: document.querySelector<HTMLElement>('#wind')!,
}

let currentData: CombinedWeatherData | null = null

function renderSidebar({ location, weather }: CombinedWeatherData): void {
  sidebar.temperature.textContent = `${weather.temperature}${weather.units.temperature}`
  sidebar.location.textContent = `${location.name}, ${location.countryCode}`
  sidebar.date.textContent = formatCurrentDate(location.timezone)
  sidebar.period.textContent = weather.isDay ? 'Dia' : 'Noite'
  sidebar.periodIcon.src = weather.isDay ? sunIcon : moonIcon
  sidebar.condition.textContent = getWeatherDescription(weather.weatherCode)
}

function renderDetails({ weather }: CombinedWeatherData): void {
  const { units } = weather
  const cardinal = getCardinalDirection(weather.windDirection)

  details.humidity.textContent = `${weather.relativeHumidity}${units.relativeHumidity}`
  details.apparentTemperature.textContent = `${weather.apparentTemperature}${units.apparentTemperature}`
  details.precipitation.textContent = `${weather.precipitationProbability}${units.precipitationProbability}`
  details.wind.textContent = `${weather.windSpeed} ${units.windSpeed} · ${weather.windDirection}${units.windDirection} (${cardinal})`
}

// O CSS usa `data-state` do card para exibir apenas um estado por vez.
function setState(state: UiState): void {
  const isLoading = state === 'loading'

  card.dataset.state = state
  card.setAttribute('aria-busy', String(isLoading))
  input.disabled = isLoading
  button.disabled = isLoading
}

async function handleSearch(rawCity: string): Promise<void> {
  const city = rawCity.trim()
  if (city === '' || card.dataset.state === 'loading') return

  input.value = city
  setState('loading')

  currentData = await searchWeather(city)
  if (currentData) {
    renderSidebar(currentData)
    renderDetails(currentData)
  }
  setState(currentData ? 'result' : 'empty')

  if (!currentData) input.focus()
}

// Enter no input e clique no botão disparam o submit do form.
form.addEventListener('submit', (event) => {
  event.preventDefault()
  void handleSearch(input.value)
})

setState('empty')
