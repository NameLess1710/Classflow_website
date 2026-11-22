import { createPersistedStore } from "./store";
import {
  defaultProfile,
  defaultSettings,
  sampleAssignments,
  sampleAttendance,
  sampleNotes,
  sampleSemesters,
} from "./sample-data";
import type { AttendanceSubject, Assignment, Profile, Semester, Session, Settings, StudyNote } from "./types";

export const sessionStore = createPersistedStore<Session>("session", () => ({ loggedIn: false }));
export const profileStore = createPersistedStore<Profile>("profile", defaultProfile);
export const settingsStore = createPersistedStore<Settings>("settings", defaultSettings);
export const notesStore = createPersistedStore<StudyNote[]>("notes", sampleNotes);
export const assignmentsStore = createPersistedStore<Assignment[]>("assignments", sampleAssignments);
export const attendanceStore = createPersistedStore<AttendanceSubject[]>("attendance", sampleAttendance);
export const semestersStore = createPersistedStore<Semester[]>("semesters", sampleSemesters);
export const readNoticesStore = createPersistedStore<string[]>("read-notices", () => []);
export const cgpaGoalStore = createPersistedStore<{ target: number; remainingSemesters: number; creditsPerSemester: number }>(
  "cgpa-goal",
  () => ({ target: 9, remainingSemesters: 4, creditsPerSemester: 20 }),
);

/** Clears all demo data so the app returns to the sample state (keeps the session). */
export function resetDemoData() {
  [profileStore, settingsStore, notesStore, assignmentsStore, attendanceStore, semestersStore, readNoticesStore, cgpaGoalStore].forEach(
    (s) => s.reset(),
  );
}

export function newId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.floor(performance.now() * 1000).toString(36)}`;
}
