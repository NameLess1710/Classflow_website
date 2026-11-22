import { createPersistedStore } from "./persisted-store";
import {
  defaultProfile,
  defaultSettings,
  sampleAssignments,
  sampleAttendance,
  sampleNotes,
  sampleSemesters,
} from "@/data/sample-data";

export const sessionStore = createPersistedStore("session", () => ({ loggedIn: false }));
export const profileStore = createPersistedStore("profile", defaultProfile);
export const settingsStore = createPersistedStore("settings", defaultSettings);
export const notesStore = createPersistedStore("notes", sampleNotes);
export const assignmentsStore = createPersistedStore("assignments", sampleAssignments);
export const attendanceStore = createPersistedStore("attendance", sampleAttendance);
export const semestersStore = createPersistedStore("semesters", sampleSemesters);
export const readNoticesStore = createPersistedStore("read-notices", () => []);
export const cgpaGoalStore = createPersistedStore(
  "cgpa-goal",
  () => ({ target: 9, remainingSemesters: 4, creditsPerSemester: 20 }),
);

/** Clears all demo data so the app returns to the sample state (keeps the session). */
export function resetDemoData() {
  [profileStore, settingsStore, notesStore, assignmentsStore, attendanceStore, semestersStore, readNoticesStore, cgpaGoalStore].forEach(
    (s) => s.reset(),
  );
}

export function newId(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.floor(performance.now() * 1000).toString(36)}`;
}
