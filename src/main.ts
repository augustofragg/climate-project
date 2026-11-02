import './style.css'
import { searchWeather } from './services/openMeteo'
import type { CombinedWeatherData } from './types/weather'

type UiState = 'empty' | 'loading' | 'result'

const form = document.querySelector<HTMLFormElement>('#search-form')!
const input = document.querySelector<HTMLInputElement>('#search-input')!
const button = document.querySelector<HTMLButtonElement>('#search-button')!
const card = document.querySelector<HTMLElement>('#weather-card')!

let currentData: CombinedWeatherData | null = null

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
  setState(currentData ? 'result' : 'empty')

  if (!currentData) input.focus()
}

// Enter no input e clique no botão disparam o submit do form.
form.addEventListener('submit', (event) => {
  event.preventDefault()
  void handleSearch(input.value)
})

setState('empty')
