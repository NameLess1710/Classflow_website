import { differenceInCalendarDays, format, parseISO } from "date-fns";

/** ISO date (yyyy-MM-dd) n days from today. Call at runtime, never at module scope. */
export function isoDaysFromNow(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return format(d, "yyyy-MM-dd");
}

export function daysUntil(iso) {
  return differenceInCalendarDays(parseISO(iso), new Date());
}

export function relativeDayLabel(iso) {
  const n = daysUntil(iso);
  if (n === 0) return "Today";
  if (n === 1) return "Tomorrow";
  if (n === -1) return "Yesterday";
  if (n < 0) return `${Math.abs(n)} days ago`;
  return `In ${n} days`;
}

export function formatDate(iso, pattern = "d MMM yyyy") {
  return format(parseISO(iso), pattern);
}

export const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function todayWeekday() {
  const names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return names[new Date().getDay()] ?? "Sunday";
}
