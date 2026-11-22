import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Award, BookMarked, Calculator, ChevronDown, Layers, Percent, Plus, Trash2, TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { SectionCard } from "@/components/common/SectionCard";
import { TargetSimulator } from "@/components/cgpa/TargetSimulator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GRADES, GRADE_POINTS, cgpa, gpa, totalCredits } from "@/lib/academics";
import { newId, semestersStore } from "@/lib/stores";
import { pageHead } from "@/lib/seo";
import type { Course, Semester } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_student/cgpa")({
  head: () => pageHead("CGPA & Grade Calculator", "Calculate SGPA and CGPA on the 10-point scale and simulate the grades you need to hit your target."),
  component: CgpaPage,
});

function CgpaPage() {
  const [semesters, setSemesters] = semestersStore.useStore();
  const [open, setOpen] = useState<string | null>(() => semesters.at(-1)?.id ?? null);

  const overall = cgpa(semesters.map((s) => s.courses));
  const credits = semesters.reduce((sum, s) => sum + totalCredits(s.courses), 0);
  const sgpas = semesters.map((s) => ({ name: s.name.replace("Semester ", "Sem "), sgpa: Number(gpa(s.courses).toFixed(2)) }));
  const best = sgpas.reduce((m, s) => Math.max(m, s.sgpa), 0);

  const updateSem = (id: string, fn: (s: Semester) => Semester) => setSemesters((xs) => xs.map((s) => (s.id === id ? fn(s) : s)));
  const updateCourse = (semId: string, courseId: string, patch: Partial<Course>) =>
    updateSem(semId, (s) => ({ ...s, courses: s.courses.map((c) => (c.id === courseId ? { ...c, ...patch } : c)) }));

  const addSemester = () => {
    const id = newId("sem");
    setSemesters((xs) => [...xs, { id, name: `Semester ${xs.length + 1}`, courses: [{ id: newId("c"), name: "", credits: 4, grade: "A" }] }]);
    setOpen(id);
    toast.success("Semester added");
  };

  return (
    <div>
      <PageHeader
        title="CGPA & Grade Calculator"
        description="Enter credits and grades for each semester. CGPA is credit-weighted on the 10-point scale and saved on this device."
        icon={Calculator}
        actions={
          <Button variant="gradient" onClick={addSemester}>
            <Plus /> Add semester
          </Button>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard label="Current CGPA" value={overall.toFixed(2)} hint="Out of 10" icon={TrendingUp} tone="primary" />
        <StatCard label="Credits earned" value={String(credits)} hint={`${semesters.length} semesters`} icon={Layers} tone="cyan" />
        <StatCard label="Best SGPA" value={best.toFixed(2)} hint={sgpas.find((s) => s.sgpa === best)?.name ?? "—"} icon={Award} tone="success" />
        <StatCard label="Percentage (approx.)" value={`${(overall * 9.5).toFixed(1)}%`} hint="CGPA × 9.5 convention" icon={Percent} tone="warning" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <SectionCard title="SGPA trend" icon={TrendingUp}>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sgpas} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 10]} stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    cursor={{ fill: "var(--accent)", opacity: 0.4 }}
                    contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, color: "var(--foreground)" }}
                  />
                  <Bar dataKey="sgpa" name="SGPA" fill="var(--primary)" radius={[6, 6, 0, 0]} maxBarSize={48} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>

          <div className="space-y-3">
            {semesters.map((sem) => {
              const isOpen = open === sem.id;
              const sg = gpa(sem.courses);
              return (
                <section key={sem.id} className="rounded-2xl border bg-card shadow-soft">
                  <button className="flex w-full items-center gap-4 p-4 text-left sm:p-5" onClick={() => setOpen(isOpen ? null : sem.id)} aria-expanded={isOpen}>
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                      <BookMarked className="h-5 w-5" />
                    </span>
                    <div className="flex-1">
                      <p className="font-semibold">{sem.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {sem.courses.length} courses · {totalCredits(sem.courses)} credits
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">SGPA</p>
                      <p className="font-display text-xl font-semibold text-cyan">{sg.toFixed(2)}</p>
                    </div>
                    <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
                  </button>
                  {isOpen && (
                    <div className="border-t p-4 sm:p-5">
                      <div className="mb-2 hidden grid-cols-[1fr_90px_110px_40px] gap-2 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:grid">
                        <span>Course</span>
                        <span>Credits</span>
                        <span>Grade</span>
                        <span />
                      </div>
                      <ul className="space-y-2">
                        {sem.courses.map((c) => (
                          <li key={c.id} className="grid grid-cols-[1fr_auto] gap-2 rounded-xl border bg-surface p-2 sm:grid-cols-[1fr_90px_110px_40px] sm:border-0 sm:bg-transparent sm:p-0">
                            <Input
                              className="col-span-2 sm:col-span-1"
                              value={c.name}
                              placeholder="Course name"
                              onChange={(e) => updateCourse(sem.id, c.id, { name: e.target.value })}
                              aria-label="Course name"
                            />
                            <div className="col-span-2 grid grid-cols-[1fr_1fr_40px] gap-2 sm:contents">
                              <Input
                                inputMode="numeric"
                                value={c.credits}
                                onChange={(e) => updateCourse(sem.id, c.id, { credits: Math.min(10, parseInt(e.target.value.replace(/\D/g, ""), 10) || 0) })}
                                aria-label="Credits"
                              />
                              <Select value={c.grade} onValueChange={(g) => updateCourse(sem.id, c.id, { grade: g })}>
                                <SelectTrigger aria-label="Grade">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {GRADES.map((g) => (
                                    <SelectItem key={g} value={g}>
                                      {g} ({GRADE_POINTS[g]})
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-muted-foreground hover:text-destructive"
                                onClick={() => updateSem(sem.id, (s) => ({ ...s, courses: s.courses.filter((x) => x.id !== c.id) }))}
                                aria-label="Remove course"
                              >
                                <Trash2 />
                              </Button>
                            </div>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4 flex flex-wrap justify-between gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateSem(sem.id, (s) => ({ ...s, courses: [...s.courses, { id: newId("c"), name: "", credits: 3, grade: "A" }] }))}
                        >
                          <Plus /> Add course
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => {
                            setSemesters((xs) => xs.filter((s) => s.id !== sem.id));
                            toast.success(`${sem.name} removed`);
                          }}
                        >
                          <Trash2 /> Remove semester
                        </Button>
                      </div>
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        </div>

        <div className="space-y-6 xl:sticky xl:top-24 xl:self-start">
          <TargetSimulator currentCgpa={overall} completedCredits={credits} />
          <SectionCard title="Grade scale" icon={Award}>
            <div className="grid grid-cols-4 gap-2">
              {GRADES.map((g) => (
                <div key={g} className="rounded-lg border bg-surface p-2 text-center">
                  <p className="font-display font-semibold">{g}</p>
                  <p className="text-xs text-muted-foreground">{GRADE_POINTS[g]} pts</p>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
