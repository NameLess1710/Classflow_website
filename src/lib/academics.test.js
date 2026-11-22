import { describe, expect, it } from "vitest";
import { attendanceStatus, cgpa, gpa, requiredGpaForTarget } from "./academics";

describe("75% attendance rule", () => {
  it("40 of 50 attended (80%) -> can safely miss 3 classes", () => {
    expect(attendanceStatus(40, 50)).toMatchObject({ kind: "safe", canMiss: 3 });
  });

  it("exactly 75% (30 of 40) -> safe but cannot miss any", () => {
    expect(attendanceStatus(30, 40)).toMatchObject({ kind: "safe", canMiss: 0 });
  });

  it("20 of 30 attended (66.7%) -> must attend the next 10 classes", () => {
    expect(attendanceStatus(20, 30)).toMatchObject({ kind: "short", mustAttend: 10 });
  });

  it("uses a custom threshold when given (80%)", () => {
    expect(attendanceStatus(40, 50, 80)).toMatchObject({ kind: "safe", canMiss: 0 });
  });
});

describe("CGPA calculator", () => {
  it("SGPA is credit-weighted on the 10-point scale", () => {
    // (4*10 + 3*8) / 7 = 64/7
    expect(gpa([{ credits: 4, grade: "O" }, { credits: 3, grade: "A" }])).toBeCloseTo(9.142857, 5);
  });

  it("CGPA weights semesters by credits, not by plain average of SGPAs", () => {
    const result = cgpa([[{ credits: 20, grade: "O" }], [{ credits: 10, grade: "B" }]]);
    expect(result).toBeCloseTo((20 * 10 + 10 * 6) / 30, 5);
  });

  it("target simulator: 8.0 over 80 credits, target 8.5 with 80 left -> need 9.0", () => {
    const r = requiredGpaForTarget(8, 80, 8.5, 80);
    expect(r.requiredGpa).toBeCloseTo(9, 5);
    expect(r.feasible).toBe(true);
  });

  it("target simulator flags targets above 10 as not achievable", () => {
    expect(requiredGpaForTarget(7, 120, 9, 40).feasible).toBe(false);
  });
});
