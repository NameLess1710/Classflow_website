import { BellRing, CalendarCheck2, ClipboardCheck, GraduationCap } from "lucide-react";
import { Logo } from "@/components/brand/Logo";

const highlights = [
  { icon: BellRing, title: "Never miss a notice", text: "Exam, placement and event updates in one feed." },
  { icon: ClipboardCheck, title: "Stay above 75%", text: "See exactly how many classes you can miss." },
  { icon: CalendarCheck2, title: "Deadlines, sorted", text: "Assignments, exams and your timetable together." },
  { icon: GraduationCap, title: "Plan your CGPA", text: "Simulate the grades you need for your target." },
];

export function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-[1.05fr_1fr]">
      <aside className="relative hidden overflow-hidden border-r bg-gradient-hero lg:flex lg:flex-col lg:justify-between lg:p-12">
        <Logo />
        <div className="max-w-md">
          <p className="mb-3 inline-flex items-center rounded-full border border-cyan/30 bg-cyan/10 px-3 py-1 text-xs font-semibold text-cyan">
            Built for college students
          </p>
          <h2 className="text-4xl font-semibold leading-tight text-foreground">
            Your whole semester, <span className="text-gradient-brand">in one calm place.</span>
          </h2>
          <ul className="mt-10 space-y-5">
            {highlights.map((h) => (
              <li key={h.title} className="flex gap-4">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border bg-card text-primary">
                  <h.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold text-foreground">{h.title}</p>
                  <p className="text-sm text-muted-foreground">{h.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-muted-foreground">© Univo · Academic information, simplified</p>
      </aside>
      <main className="flex items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>
          <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </main>
    </div>
  );
}

export function FieldError({ message }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs font-medium text-destructive">{message}</p>;
}
