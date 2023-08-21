export function dateParse(date: Date | string | undefined): number {
  return typeof date === 'string' ? Date.parse(date) : +date || 0;
}
