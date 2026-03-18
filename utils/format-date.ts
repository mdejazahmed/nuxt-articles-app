/**
 * Format ISO date string for display.
 */

export function formatDisplayDate(isoDate: string): string {
  if (!isoDate || typeof isoDate !== 'string') return ''
  try {
    const date = new Date(isoDate)
    if (Number.isNaN(date.getTime())) return isoDate
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
    }).format(date)
  } catch {
    return isoDate
  }
}
 