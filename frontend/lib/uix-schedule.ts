/** Schedule from API: keys lun..dom, values like "08:00 - 22:00" or "Cerrado" */

export type WeekSchedule = Record<string, string | undefined>;

const DAY_KEYS = ['lun', 'mar', 'mie', 'jue', 'vie', 'sab', 'dom'] as const;

/** Monday=0 … Sunday=6 (for DAY_KEYS index) */
function todayKeyIndex(): number {
  const d = new Date().getDay();
  return d === 0 ? 6 : d - 1;
}

export function getTodayScheduleValue(schedule: WeekSchedule | null | undefined): string | undefined {
  if (!schedule) return undefined;
  const key = DAY_KEYS[todayKeyIndex()];
  return schedule[key];
}

export function formatTodayHoursLabel(schedule: WeekSchedule | null | undefined): string {
  const v = getTodayScheduleValue(schedule);
  if (v == null || v === '') return 'No disponible';
  if (/cerrado/i.test(v)) return 'Cerrado hoy';
  return v;
}

/** Parse "HH:MM" to minutes since midnight */
function parseTime(t: string): number | null {
  const m = t.match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
}

/**
 * Determines if a restaurant is currently open based on schedule.
 * Falls back to `isClosed` flag when schedule is unavailable.
 */
export function isOpenNow(
  schedule: WeekSchedule | string | null | undefined,
  isClosed: boolean,
): boolean {
  if (isClosed) return false;

  let parsed: WeekSchedule | null = null;
  if (typeof schedule === 'string') {
    try { parsed = JSON.parse(schedule); } catch { return !isClosed; }
  } else {
    parsed = schedule ?? null;
  }

  if (!parsed) return !isClosed;

  const todayValue = getTodayScheduleValue(parsed);
  if (todayValue == null || todayValue === '') return !isClosed;
  if (/cerrado/i.test(todayValue)) return false;

  // Expected format: "08:00 - 22:00"
  const parts = todayValue.split('-').map((s) => s.trim());
  if (parts.length !== 2) return !isClosed;

  const openMin = parseTime(parts[0]);
  const closeMin = parseTime(parts[1]);
  if (openMin == null || closeMin == null) return !isClosed;

  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();

  // Handle overnight ranges (e.g., 20:00 - 02:00)
  if (closeMin <= openMin) {
    return nowMin >= openMin || nowMin < closeMin;
  }

  return nowMin >= openMin && nowMin < closeMin;
}

/** Get formatted hours label from a raw schedule string (JSON) */
export function getHoursFromRaw(scheduleRaw: string | null | undefined): string {
  if (!scheduleRaw) return '';
  try {
    const parsed = JSON.parse(scheduleRaw) as WeekSchedule;
    return formatTodayHoursLabel(parsed);
  } catch {
    return '';
  }
}
