/** Pure academic calculation helpers (attendance rule + CGPA). Kept free of React for testing. */

export const DEFAULT_ATTENDANCE_THRESHOLD = 75;

export function attendancePercent(attended: number, total: number): number {
  if (total <= 0) return 0;
  return (attended / total) * 100;
}

export type AttendanceStatus =
  | { kind: "safe"; canMiss: number; percent: number }
  | { kind: "short"; mustAttend: number; percent: number }
  | { kind: "empty"; percent: 0 };

/**
 * Attendance rule calculator.
 * - safe: how many upcoming classes can be skipped while staying at or above the threshold.
 * - short: how many consecutive classes must be attended to climb back to the threshold.
 * Integer arithmetic avoids floating-point rounding at exact boundaries.
 */
export function attendanceStatus(
  attended: number,
  total: number,
  threshold: number = DEFAULT_ATTENDANCE_THRESHOLD,
): AttendanceStatus {
  if (total <= 0) return { kind: "empty", percent: 0 };
  const a = Math.max(0, Math.min(attended, total));
  const percent = attendancePercent(a, total);
  if (threshold <= 0) return { kind: "safe", canMiss: Number.POSITIVE_INFINITY, percent };
  if (100 * a >= threshold * total) {
    // a / (total + x) >= t/100  ->  x <= (100a - t*total) / t
    const canMiss = Math.floor((100 * a - threshold * total) / threshold);
    return { kind: "safe", canMiss, percent };
  }
  if (threshold >= 100) return { kind: "short", mustAttend: Number.POSITIVE_INFINITY, percent };
  // (a + y) / (total + y) >= t/100  ->  y >= (t*total - 100a) / (100 - t)
  const mustAttend = Math.ceil((threshold * total - 100 * a) / (100 - threshold));
  return { kind: "short", mustAttend, percent };
}

/** 10-point grading scale used by most Indian universities. */
export const GRADE_POINTS: Record<string, number> = {
  O: 10,
  "A+": 9,
  A: 8,
  "B+": 7,
  B: 6,
  C: 5,
  P: 4,
  F: 0,
};
export const GRADES = Object.keys(GRADE_POINTS);
export const MAX_GRADE_POINT = 10;

export interface GradedCourse {
  credits: number;
  grade: string;
}

/** Credit-weighted grade point average for a set of courses (SGPA for one semester). */
export function gpa(courses: GradedCourse[]): number {
  let credits = 0;
  let points = 0;
  for (const c of courses) {
    const gp = GRADE_POINTS[c.grade];
    if (gp === undefined || !(c.credits > 0)) continue;
    credits += c.credits;
    points += c.credits * gp;
  }
  return credits === 0 ? 0 : points / credits;
}

export function totalCredits(courses: GradedCourse[]): number {
  return courses.reduce((s, c) => (GRADE_POINTS[c.grade] !== undefined && c.credits > 0 ? s + c.credits : s), 0);
}

/** CGPA across semesters, weighted by credits (not a plain average of SGPAs). */
export function cgpa(semesters: GradedCourse[][]): number {
  return gpa(semesters.flat());
}

export interface TargetResult {
  requiredGpa: number;
  feasible: boolean;
  alreadyMet: boolean;
}

/**
 * Target goal simulator: average GPA needed over the remaining credits
 * to finish with the target CGPA.
 */
export function requiredGpaForTarget(
  currentCgpa: number,
  completedCredits: number,
  targetCgpa: number,
  remainingCredits: number,
): TargetResult {
  if (remainingCredits <= 0) {
    return { requiredGpa: 0, feasible: currentCgpa >= targetCgpa, alreadyMet: currentCgpa >= targetCgpa };
  }
  const required =
    (targetCgpa * (completedCredits + remainingCredits) - currentCgpa * completedCredits) /
    remainingCredits;
  return {
    requiredGpa: required,
    feasible: required <= MAX_GRADE_POINT,
    alreadyMet: required <= 0,
  };
}
