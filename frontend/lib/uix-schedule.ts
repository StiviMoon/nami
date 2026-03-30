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
