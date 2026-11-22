import type { EventKind, NoticeCategory, Priority } from "./types";

export const noticeTone: Record<NoticeCategory, string> = {
  Academic: "bg-primary/15 text-primary border-primary/30",
  Exam: "bg-destructive/15 text-destructive border-destructive/30",
  Events: "bg-cyan/15 text-cyan border-cyan/30",
  Placement: "bg-success/15 text-success border-success/30",
  Hostel: "bg-warning/15 text-warning border-warning/30",
  Library: "bg-muted text-muted-foreground border-border",
};

export const priorityTone: Record<Priority, string> = {
  High: "bg-destructive/15 text-destructive border-destructive/30",
  Medium: "bg-warning/15 text-warning border-warning/30",
  Low: "bg-cyan/15 text-cyan border-cyan/30",
};

export const eventTone: Record<EventKind, { chip: string; dot: string }> = {
  Holiday: { chip: "bg-success/15 text-success border-success/30", dot: "bg-success" },
  Exam: { chip: "bg-destructive/15 text-destructive border-destructive/30", dot: "bg-destructive" },
  Event: { chip: "bg-cyan/15 text-cyan border-cyan/30", dot: "bg-cyan" },
  Deadline: { chip: "bg-warning/15 text-warning border-warning/30", dot: "bg-warning" },
  Academic: { chip: "bg-primary/15 text-primary border-primary/30", dot: "bg-primary" },
};

export function attendanceTone(percent: number, threshold: number): "success" | "warning" | "destructive" {
  if (percent >= threshold + 5) return "success";
  if (percent >= threshold) return "warning";
  return "destructive";
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}
