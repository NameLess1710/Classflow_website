import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  parseISO,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { SectionCard } from "@/components/common/SectionCard";
import { Chip } from "@/components/common/Chip";
import { Button } from "@/components/ui/button";
import { sampleCalendarEvents } from "@/lib/sample-data";
import { daysUntil, formatDate, relativeDayLabel } from "@/lib/dates";
import { eventTone } from "@/lib/tones";
import { pageHead } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_student/calendar")({
  head: () => pageHead("Academic Calendar", "Holidays, exams, events and academic deadlines for the semester in a monthly calendar."),
  component: CalendarPage,
});

const KINDS = ["Academic", "Exam", "Deadline", "Event", "Holiday"];

function eventsOn(day, events) {
  return events.filter((e) => {
    const start = parseISO(e.date);
    const end = e.endDate ? parseISO(e.endDate) : start;
    return isSameDay(day, start) || (day >= start && day <= end);
  });
}

function CalendarPage() {
  const events = useMemo(() => sampleCalendarEvents(), []);
  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const [selected, setSelected] = useState(() => new Date());
  const [hidden, setHidden] = useState([]);

  const visible = events.filter((e) => !hidden.includes(e.kind));
  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(month), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(month), { weekStartsOn: 1 }),
  });
  const selectedEvents = eventsOn(selected, visible);
  const upcoming = visible.filter((e) => daysUntil(e.endDate ?? e.date) >= 0).slice(0, 8);

  const toggleKind = (k) => setHidden((h) => (h.includes(k) ? h.filter((x) => x !== k) : [...h, k]));

  return (
    <div>
      <PageHeader title="Academic Calendar" description="Semester dates, holidays, exam windows and campus events." icon={CalendarDays} />

      <div className="mb-4 flex flex-wrap gap-2" aria-label="Filter event types">
        {KINDS.map((k) => (
          <button
            key={k}
            onClick={() => toggleKind(k)}
            aria-pressed={!hidden.includes(k)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-opacity",
              eventTone[k].chip,
              hidden.includes(k) && "opacity-40",
            )}
          >
            <span className={cn("h-2 w-2 rounded-full", eventTone[k].dot)} /> {k}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <section className="rounded-2xl border bg-card p-4 shadow-soft sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-2">
            <h2 className="text-lg font-semibold">{format(month, "MMMM yyyy")}</h2>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={() => setMonth((m) => addMonths(m, -1))} aria-label="Previous month">
                <ChevronLeft />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setMonth(startOfMonth(new Date()));
                  setSelected(new Date());
                }}
              >
                Today
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setMonth((m) => addMonths(m, 1))} aria-label="Next month">
                <ChevronRight />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <div key={d} className="py-2">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((day) => {
              const dayEvents = eventsOn(day, visible);
              const inMonth = isSameMonth(day, month);
              const isSel = isSameDay(day, selected);
              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelected(day)}
                  className={cn(
                    "flex min-h-14 flex-col items-start rounded-lg border border-transparent p-1.5 text-left transition-colors sm:min-h-20 sm:p-2",
                    inMonth ? "bg-surface hover:border-border" : "opacity-40",
                    isSel && "border-primary bg-primary/10",
                  )}
                  aria-label={`${format(day, "d MMMM")}${dayEvents.length ? `, ${dayEvents.length} events` : ""}`}
                >
                  <span
                    className={cn(
                      "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold",
                      isToday(day) ? "bg-gradient-primary text-primary-foreground" : "text-foreground",
                    )}
                  >
                    {format(day, "d")}
                  </span>
                  <div className="mt-1 hidden w-full space-y-0.5 sm:block">
                    {dayEvents.slice(0, 2).map((e) => (
                      <p key={e.id} className={cn("truncate rounded px-1 py-0.5 text-[10px] font-medium", eventTone[e.kind].chip)}>
                        {e.title}
                      </p>
                    ))}
                    {dayEvents.length > 2 && <p className="px-1 text-[10px] text-muted-foreground">+{dayEvents.length - 2} more</p>}
                  </div>
                  <div className="mt-1 flex gap-0.5 sm:hidden">
                    {dayEvents.slice(0, 3).map((e) => (
                      <span key={e.id} className={cn("h-1.5 w-1.5 rounded-full", eventTone[e.kind].dot)} />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <div className="space-y-6">
          <SectionCard title={format(selected, "EEEE, d MMM")} icon={CalendarDays}>
            {selectedEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground">No events on this day.</p>
            ) : (
              <ul className="space-y-3">
                {selectedEvents.map((e) => (
                  <li key={e.id} className="rounded-xl border bg-surface p-3">
                    <Chip className={eventTone[e.kind].chip}>{e.kind}</Chip>
                    <p className="mt-1.5 text-sm font-semibold">{e.title}</p>
                    {e.endDate && (
                      <p className="text-xs text-muted-foreground">
                        {formatDate(e.date, "d MMM")} – {formatDate(e.endDate, "d MMM yyyy")}
                      </p>
                    )}
                    {e.description && <p className="mt-1 text-xs text-muted-foreground">{e.description}</p>}
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>
          <SectionCard title="Coming up" icon={CalendarDays}>
            <ul className="space-y-3">
              {upcoming.map((e) => (
                <li key={e.id}>
                  <button
                    className="flex w-full items-center gap-3 rounded-lg text-left transition-colors hover:bg-surface"
                    onClick={() => {
                      const d = parseISO(e.date);
                      setSelected(d);
                      setMonth(startOfMonth(d));
                    }}
                  >
                    <span className={cn("h-8 w-1 shrink-0 rounded-full", eventTone[e.kind].dot)} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{e.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(e.date, "d MMM")}
                        {e.endDate ? ` – ${formatDate(e.endDate, "d MMM")}` : ""} · {relativeDayLabel(e.date)}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
