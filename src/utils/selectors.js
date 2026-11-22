import { attendancePercent } from "./academics";
import { todayWeekday } from "./dates";

export function overallAttendance(subjects) {
  const attended = subjects.reduce((s, x) => s + x.attended, 0);
  const total = subjects.reduce((s, x) => s + x.total, 0);
  return { attended, total, percent: attendancePercent(attended, total) };
}

export function classesFor(day, slots) {
  return slots.filter((s) => s.day === day).sort((a, b) => a.start.localeCompare(b.start));
}

export function todaysClasses(slots) {
  return classesFor(todayWeekday(), slots);
}

function minutes(hhmm) {
  const [h = 0, m = 0] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function slotState(slot, now = new Date()) {
  const n = now.getHours() * 60 + now.getMinutes();
  if (n >= minutes(slot.end)) return "done";
  if (n >= minutes(slot.start)) return "live";
  return "upcoming";
}

export function formatTime(hhmm) {
  const [h = 0, m = 0] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hr = h % 12 === 0 ? 12 : h % 12;
  return `${hr}:${m.toString().padStart(2, "0")} ${suffix}`;
}
