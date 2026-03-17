/**
 * Format ISO date string for display.
 */

export function format_display_date(iso_date: string): string {
  if (!iso_date || typeof iso_date !== 'string') return ''
  try {
    const date = new Date(iso_date)
    if (Number.isNaN(date.getTime())) return iso_date
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
    }).format(date)
  } catch {
    return iso_date
  }
}
