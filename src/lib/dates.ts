/**
 * Calendar helpers on plain ISO dates (YYYY-MM-DD) in local time. The app only ever
 * needs whole days, so no time zone maths beyond the device's own calendar.
 */

export function toISODate(date: Date): string {
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${m}-${d}`;
}

export function isoFor(year: number, month: number, day: number): string {
  return toISODate(new Date(year, month, day));
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

/** A month as calendar rows, Sunday first. `null` pads the days outside the month. */
export function monthGrid(year: number, month: number): (number | null)[][] {
  const lead = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array.from({ length: lead }, () => null),
    ...Array.from({ length: days }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);
  const rows: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
  return rows;
}

/** Year and month (0-based) of a month offset from the given one. */
export function shiftMonth(year: number, month: number, by: number): [number, number] {
  const date = new Date(year, month + by, 1);
  return [date.getFullYear(), date.getMonth()];
}

export function monthTitle(year: number, month: number): string {
  return new Date(year, month, 1).toLocaleDateString('en-PH', { month: 'long', year: 'numeric' });
}
