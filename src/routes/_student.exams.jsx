import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { BadgeCheck, CalendarDays, Clock, GraduationCap, MapPin, ScrollText, Armchair } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { SectionCard } from "@/components/common/SectionCard";
import { Chip } from "@/components/common/Chip";
import { Button } from "@/components/ui/button";
import { sampleExams } from "@/data/sample-data";
import { daysUntil, formatDate, relativeDayLabel } from "@/utils/dates";
import { formatTime } from "@/utils/selectors";
import { pageHead } from "@/utils/seo";
import { cn } from "@/utils/class-names";

export const Route = createFileRoute("/_student/exams")({
  head: () => pageHead("Exam Information", "Exam dates, timings, venues, seat numbers and syllabus for your upcoming exams."),
  component: ExamsPage,
});

const typeTone = {
  "Mid-Semester": "border-primary/30 bg-primary/10 text-primary",
  "End-Semester": "border-destructive/30 bg-destructive/10 text-destructive",
  "Lab Exam": "border-cyan/30 bg-cyan/10 text-cyan",
  Quiz: "border-warning/30 bg-warning/10 text-warning",
};

const GUIDELINES = [
  "Report to the exam hall 15 minutes before the start time.",
  "Carry your college ID card and hall ticket for every exam.",
  "Mobile phones, smart watches and programmable calculators are not allowed.",
  "Students below the minimum attendance requirement may be debarred.",
  "Write your roll number on every answer booklet and additional sheet.",
];

function ExamsPage() {
  const exams = useMemo(() => sampleExams().sort((a, b) => a.date.localeCompare(b.date)), []);
  const [filter, setFilter] = useState("All");
  const upcoming = exams.filter((e) => daysUntil(e.date) >= 0);
  const next = upcoming[0];
  const shown = exams.filter((e) => filter === "All" || e.type === filter);
  const types = ["All", ...Array.from(new Set(exams.map((e) => e.type)))];

  return (
    <div>
      <PageHeader title="Exam Information" description="Schedule, venue, seating and syllabus for your upcoming exams." icon={GraduationCap} />

      {next && (
        <section className="mb-6 grid gap-5 rounded-2xl border bg-gradient-hero p-6 shadow-soft md:grid-cols-[auto_1fr_auto] md:items-center">
          <div className="flex h-24 w-24 flex-col items-center justify-center rounded-2xl border bg-card">
            <span className="font-display text-4xl font-semibold leading-none">{Math.max(daysUntil(next.date), 0)}</span>
            <span className="mt-1 text-xs font-medium text-muted-foreground">days to go</span>
          </div>
          <div>
            <p className="text-sm font-medium text-cyan">Next exam · {relativeDayLabel(next.date)}</p>
            <h2 className="mt-1 text-xl font-semibold sm:text-2xl">{next.subject}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {next.type} · {formatDate(next.date, "EEEE, d MMM")} · {formatTime(next.start)} – {formatTime(next.end)} · {next.venue} · Seat {next.seat}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Chip className="justify-center border-success/30 bg-success/10 text-success">
              <BadgeCheck className="h-3.5 w-3.5" /> Hall ticket issued
            </Chip>
            <Button variant="outline" size="sm" onClick={() => toast.info("Hall ticket download will be available once the exam portal is connected.")}>
              Download hall ticket
            </Button>
          </div>
        </section>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="-mx-1 mb-4 flex gap-2 overflow-x-auto px-1 pb-1">
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={cn(
                  "whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                  filter === t ? "border-primary bg-primary/15 text-foreground" : "bg-card text-muted-foreground hover:text-foreground",
                )}
              >
                {t}
              </button>
            ))}
          </div>
          <ul className="space-y-3">
            {shown.map((e) => {
              const d = daysUntil(e.date);
              return (
                <li key={e.id} className="rounded-2xl border bg-card p-4 shadow-soft sm:p-5">
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl border bg-surface">
                      <span className="text-[11px] font-semibold uppercase text-muted-foreground">{formatDate(e.date, "MMM")}</span>
                      <span className="font-display text-2xl font-semibold leading-none">{formatDate(e.date, "d")}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Chip className={typeTone[e.type]}>{e.type}</Chip>
                        <span className={cn("text-xs font-semibold", d < 0 ? "text-muted-foreground" : d <= 3 ? "text-warning" : "text-cyan")}>
                          {d < 0 ? "Completed" : relativeDayLabel(e.date)}
                        </span>
                      </div>
                      <p className="mt-1.5 font-display text-lg font-semibold">
                        {e.subject} <span className="text-sm font-normal text-muted-foreground">({e.code})</span>
                      </p>
                      <div className="mt-2 grid gap-x-4 gap-y-1 text-sm text-muted-foreground sm:grid-cols-2">
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" /> {formatTime(e.start)} – {formatTime(e.end)}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5" /> {e.venue}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Armchair className="h-3.5 w-3.5" /> Seat {e.seat}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <ScrollText className="h-3.5 w-3.5" /> Max marks {e.maxMarks}
                        </span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {e.syllabus.map((topic) => (
                          <Chip key={topic} className="border-border bg-surface font-medium text-foreground/85">
                            {topic}
                          </Chip>
                        ))}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="space-y-6">
          <SectionCard title="Exam guidelines" icon={ScrollText}>
            <ol className="space-y-3 text-sm">
              {GUIDELINES.map((g, i) => (
                <li key={g} className="flex gap-3">
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">{i + 1}</span>
                  <span className="text-foreground/85">{g}</span>
                </li>
              ))}
            </ol>
          </SectionCard>
          <SectionCard title="Exam summary" icon={CalendarDays} linkTo="/calendar" linkLabel="Calendar">
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl border bg-surface p-3">
                <dt className="text-xs text-muted-foreground">Upcoming</dt>
                <dd className="font-display text-xl font-semibold">{upcoming.length}</dd>
              </div>
              <div className="rounded-xl border bg-surface p-3">
                <dt className="text-xs text-muted-foreground">This week</dt>
                <dd className="font-display text-xl font-semibold">{upcoming.filter((e) => daysUntil(e.date) <= 7).length}</dd>
              </div>
            </dl>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
