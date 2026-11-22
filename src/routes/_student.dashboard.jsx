import { Link, createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { format } from "date-fns";
import {
  Bot,
  CalendarClock,
  ClipboardCheck,
  ClipboardList,
  GraduationCap,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/common/SectionCard";
import { StatCard } from "@/components/common/StatCard";
import { Chip } from "@/components/common/Chip";
import { TodayClasses } from "@/components/dashboard/TodayClasses";
import { attendanceStatus, cgpa } from "@/lib/academics";
import { daysUntil, formatDate, relativeDayLabel } from "@/lib/dates";
import { sampleExams, sampleTimetable } from "@/lib/sample-data";
import { overallAttendance, todaysClasses } from "@/lib/selectors";
import { assignmentsStore, attendanceStore, profileStore, semestersStore, settingsStore } from "@/lib/stores";
import { attendanceTone, priorityTone } from "@/lib/tones";
import { pageHead } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_student/dashboard")({
  head: () => pageHead("Dashboard", "Today's classes, upcoming deadlines and your academic stats at a glance."),
  component: Dashboard,
});

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function Dashboard() {
  const [profile] = profileStore.useStore();
  const [assignments] = assignmentsStore.useStore();
  const [attendance] = attendanceStore.useStore();
  const [semesters] = semestersStore.useStore();
  const [settings] = settingsStore.useStore();
  const exams = useMemo(() => sampleExams().filter((e) => daysUntil(e.date) >= 0).sort((a, b) => a.date.localeCompare(b.date)), []);
  const classCount = useMemo(() => todaysClasses(sampleTimetable()).length, []);

  const threshold = settings.attendanceThreshold;
  const pending = assignments.filter((a) => !a.completed).sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const dueThisWeek = pending.filter((a) => daysUntil(a.dueDate) <= 7).length;
  const overall = overallAttendance(attendance);
  const atRisk = attendance.filter((s) => attendanceStatus(s.attended, s.total, threshold).kind === "short");
  const currentCgpa = cgpa(semesters.map((s) => s.courses));
  const nextExam = exams[0];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <section className="relative overflow-hidden rounded-2xl border bg-gradient-hero p-6 shadow-soft sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-cyan">{format(new Date(), "EEEE, d MMMM yyyy")}</p>
            <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">
              {greeting()}, {profile.name.split(" ")[0]}
            </h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
              You have <strong className="text-foreground">{classCount} classes</strong> today and{" "}
              <strong className="text-foreground">
                {dueThisWeek} assignment{dueThisWeek === 1 ? "" : "s"}
              </strong>{" "}
              due this week. {profile.program} · {profile.department} · {profile.semester}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="gradient" asChild>
              <Link to="/assignments">
                <ClipboardList /> View deadlines
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/ask-ai">
                <Bot /> Ask Univo
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard
          label="Overall attendance"
          value={`${overall.percent.toFixed(1)}%`}
          hint={atRisk.length ? `${atRisk.length} subject${atRisk.length > 1 ? "s" : ""} below ${threshold}%` : `All subjects above ${threshold}%`}
          icon={ClipboardCheck}
          tone={attendanceTone(overall.percent, threshold)}
        />
        <StatCard label="Current CGPA" value={currentCgpa.toFixed(2)} hint={`Across ${semesters.length} semesters`} icon={TrendingUp} tone="cyan" />
        <StatCard label="Pending assignments" value={String(pending.length)} hint={`${dueThisWeek} due in 7 days`} icon={ClipboardList} tone="warning" />
        <StatCard
          label="Next exam"
          value={nextExam ? relativeDayLabel(nextExam.date) : "None"}
          hint={nextExam ? `${nextExam.code} · ${nextExam.type}` : "No exams scheduled"}
          icon={GraduationCap}
          tone="primary"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <TodayClasses className="lg:col-span-2" />

        <SectionCard title="Upcoming deadlines" icon={CalendarClock} linkTo="/assignments">
          {pending.length === 0 ? (
            <p className="text-sm text-muted-foreground">All caught up. No pending assignments.</p>
          ) : (
            <ul className="space-y-3">
              {pending.slice(0, 4).map((a) => {
                const d = daysUntil(a.dueDate);
                return (
                  <li key={a.id} className="rounded-xl border bg-surface p-3">
                    <div className="flex items-start justify-between gap-2">
                      <p className="line-clamp-2 text-sm font-semibold text-foreground">{a.title}</p>
                      <Chip className={priorityTone[a.priority]}>{a.priority}</Chip>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{a.subject}</p>
                    <p className={cn("mt-1.5 text-xs font-semibold", d < 0 ? "text-destructive" : d <= 2 ? "text-warning" : "text-cyan")}>
                      {d < 0 ? `Overdue by ${Math.abs(d)} day${Math.abs(d) > 1 ? "s" : ""}` : `Due ${relativeDayLabel(a.dueDate).toLowerCase()}`} · {formatDate(a.dueDate, "d MMM")}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </SectionCard>

      </div>

    </div>
  );
}
