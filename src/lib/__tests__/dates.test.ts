import { addDays, isoFor, monthGrid, shiftMonth, toISODate } from '@/lib/dates';

describe('dates', () => {
  it('formats local dates as ISO days', () => {
    expect(toISODate(new Date(2027, 2, 8))).toBe('2027-03-08');
    expect(isoFor(2027, 0, 31)).toBe('2027-01-31');
    expect(toISODate(addDays(new Date(2026, 11, 31), 1))).toBe('2027-01-01');
  });

  it('lays out a month from Sunday with padding', () => {
    // March 2027 starts on a Monday and has 31 days.
    const rows = monthGrid(2027, 2);
    expect(rows[0]).toEqual([null, 1, 2, 3, 4, 5, 6]);
    expect(rows.flat().filter((d) => d !== null)).toHaveLength(31);
    expect(rows.every((r) => r.length === 7)).toBe(true);
  });

  it('shifts months across years', () => {
    expect(shiftMonth(2026, 11, 1)).toEqual([2027, 0]);
    expect(shiftMonth(2027, 0, -1)).toEqual([2026, 11]);
  });
});
