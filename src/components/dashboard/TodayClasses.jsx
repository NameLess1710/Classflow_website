import { CalendarClock, MapPin } from "lucide-react";
import { SectionCard } from "@/components/common/SectionCard";
import { Chip } from "@/components/common/Chip";
import { classesFor, formatTime, slotState, todaysClasses } from "@/utils/selectors";
import { sampleTimetable } from "@/data/sample-data";
import { todayWeekday } from "@/utils/dates";
import { cn } from "@/utils/class-names";
import { useMemo } from "react";

export function TodayClasses({ className }) {
  const slots = useMemo(() => sampleTimetable(), []);
  const today = todayWeekday();
  const list = todaysClasses(slots);
  const isSunday = today === "Sunday";
  const shown = isSunday ? classesFor("Monday", slots) : list;

  return (
    <SectionCard title={isSunday ? "Monday's classes" : "Today's timetable"} icon={CalendarClock} linkTo="/timetable" linkLabel="Full week" {...(className ? { className } : {})}>
      {isSunday && <p className="mb-3 text-sm text-muted-foreground">No classes today. Here is what Monday looks like.</p>}
      <ol className="space-y-2.5">
        {shown.map((s) => {
          const state = isSunday ? "upcoming" : slotState(s);
          return (
            <li
              key={s.id}
              className={cn(
                "flex items-center gap-3 rounded-xl border bg-surface p-3",
                state === "live" && "border-primary/60 bg-primary/10",
                state === "done" && "opacity-60",
              )}
            >
              <div className="w-20 shrink-0 text-xs font-semibold leading-tight text-muted-foreground">
                <p className="text-foreground">{formatTime(s.start)}</p>
                <p>{formatTime(s.end)}</p>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">{s.subject}</p>
                <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" /> {s.room} · {s.faculty}
                </p>
              </div>
              {state === "live" ? (
                <Chip className="border-primary/40 bg-primary/15 text-primary">Now</Chip>
              ) : s.type !== "Lecture" ? (
                <Chip className="border-cyan/30 bg-cyan/10 text-cyan">{s.type}</Chip>
              ) : null}
            </li>
          );
        })}
      </ol>
    </SectionCard>
  );
}
