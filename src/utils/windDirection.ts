// Conversão de graus (0–360) para ponto cardeal em português.

export type CardinalDirection = 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SO' | 'O' | 'NO';

const DIRECTIONS: readonly CardinalDirection[] = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];

export function getCardinalDirection(degrees: number): CardinalDirection {
  const normalized = ((degrees % 360) + 360) % 360;
  const index = Math.round(normalized / 45) % 8;
  return DIRECTIONS[index];
}
