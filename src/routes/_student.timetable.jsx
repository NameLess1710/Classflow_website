import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Clock, MapPin, User } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Chip } from "@/components/common/Chip";
import { sampleTimetable } from "@/data/sample-data";
import { WEEKDAYS, todayWeekday } from "@/utils/dates";
import { classesFor, formatTime, slotState } from "@/utils/selectors";
import { pageHead } from "@/utils/seo";
import { cn } from "@/utils/class-names";

export const Route = createFileRoute("/_student/timetable")({
  head: () => pageHead("Timetable", "Your weekly class schedule with rooms, faculty, labs and tutorials."),
  component: TimetablePage,
});

const typeTone = {
  Lecture: "border-primary/30 bg-primary/10",
  Lab: "border-cyan/30 bg-cyan/10",
  Tutorial: "border-warning/30 bg-warning/10",
};

function TimetablePage() {
  const slots = useMemo(() => sampleTimetable(), []);
  const today = todayWeekday();
  const [day, setDay] = useState(today === "Sunday" ? "Monday" : today);
  const [view, setView] = useState("day");
  const dayClasses = classesFor(day, slots);
  const startTimes = Array.from(new Set(slots.map((s) => s.start))).sort();

  return (
    <div>
      <PageHeader
        title="Timetable"
        description="Semester 5 · Section B. Lectures, labs and tutorials for the week."
        icon={Clock}
        actions={
          <div className="inline-flex rounded-xl border bg-card p-1">
            {["day", "week"].map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  "rounded-lg px-3.5 py-1.5 text-sm font-medium capitalize transition-colors",
                  view === v ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
                aria-pressed={view === v}
              >
                {v} view
              </button>
            ))}
          </div>
        }
      />

      <div className="mb-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
        {Object.keys(typeTone).map((t) => (
          <span key={t} className="inline-flex items-center gap-1.5">
            <span className={cn("h-3 w-3 rounded border", typeTone[t])} /> {t}
          </span>
        ))}
      </div>

      {view === "day" ? (
        <>
          <div className="-mx-1 mb-5 flex gap-2 overflow-x-auto px-1 pb-1" role="tablist" aria-label="Choose day">
            {WEEKDAYS.map((d) => (
              <button
                key={d}
                role="tab"
                aria-selected={day === d}
                onClick={() => setDay(d)}
                className={cn(
                  "flex min-w-[4.5rem] flex-col items-center rounded-xl border px-3 py-2 text-sm font-semibold transition-colors",
                  day === d ? "border-primary bg-primary/15 text-foreground" : "bg-card text-muted-foreground hover:text-foreground",
                )}
              >
                {d.slice(0, 3)}
                {d === today && <span className="mt-0.5 text-[10px] font-medium text-cyan">Today</span>}
              </button>
            ))}
          </div>
          <ol className="relative space-y-3 border-l border-border pl-5 sm:pl-6">
            {dayClasses.map((s) => {
              const state = day === today ? slotState(s) : "upcoming";
              return (
                <li key={s.id} className="relative">
                  <span
                    className={cn(
                      "absolute -left-[1.6rem] top-5 h-3 w-3 rounded-full border-2 border-background sm:-left-[1.85rem]",
                      state === "live" ? "bg-primary" : state === "done" ? "bg-muted" : "bg-cyan",
                    )}
                  />
                  <div className={cn("rounded-2xl border bg-card p-4 shadow-soft sm:p-5", state === "live" && "border-primary/60", state === "done" && "opacity-60")}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-cyan">
                        {formatTime(s.start)} – {formatTime(s.end)}
                      </p>
                      <div className="flex gap-2">
                        {state === "live" && <Chip className="border-primary/40 bg-primary/15 text-primary">In progress</Chip>}
                        <Chip className={cn(typeTone[s.type], "text-foreground")}>{s.type}</Chip>
                      </div>
                    </div>
                    <p className="mt-1.5 font-display text-lg font-semibold">{s.subject}</p>
                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <span>{s.code}</span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" /> {s.room}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <User className="h-3.5 w-3.5" /> {s.faculty}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </>
      ) : (
        <div className="overflow-x-auto rounded-2xl border bg-card shadow-soft">
          <table className="w-full min-w-[860px] border-collapse text-sm">
            <thead>
              <tr className="border-b bg-surface">
                <th className="w-28 px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Time</th>
                {WEEKDAYS.map((d) => (
                  <th key={d} className={cn("px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide", d === today ? "text-cyan" : "text-muted-foreground")}>
                    {d.slice(0, 3)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {startTimes.map((start) => {
                const end = slots.find((s) => s.start === start)?.end;
                if (!end) return null;
                return (
                  <tr key={start} className="border-b last:border-0">
                    <td className="px-3 py-3 align-top text-xs font-semibold text-muted-foreground">
                      {formatTime(start)}
                      <br />
                      <span className="font-normal">{formatTime(end)}</span>
                    </td>
                    {WEEKDAYS.map((d) => {
                      const s = slots.find((x) => x.day === d && x.start === start);
                      return (
                        <td key={d} className={cn("p-1.5 align-top", d === today && "bg-primary/5")}>
                          {s ? (
                            <div className={cn("rounded-lg border p-2", typeTone[s.type])}>
                              <p className="text-xs font-semibold leading-snug text-foreground">{s.subject}</p>
                              <p className="mt-0.5 text-[11px] text-muted-foreground">
                                {s.room} · {formatTime(s.end)}
                              </p>
                            </div>
                          ) : (
                            <div className="h-full min-h-12 rounded-lg" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="border-t px-4 py-3 text-xs text-muted-foreground">Lunch break 12:00 PM – 2:00 PM · Short break 10:50 – 11:10 AM</p>
        </div>
      )}
    </div>
  );
}
