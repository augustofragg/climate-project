// Formatação da data atual em português, no fuso horário da cidade.

export function formatCurrentDate(timeZone: string, date: Date = new Date()): string {
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone,
  }).format(date);
}
