import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { AlertTriangle, CheckCircle2, ClipboardCheck, Minus, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Meter } from "@/components/common/Meter";
import { AttendanceCalculator } from "@/components/attendance/AttendanceCalculator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { attendanceStatus } from "@/lib/academics";
import { attendanceStore, newId, settingsStore } from "@/lib/stores";
import { overallAttendance } from "@/lib/selectors";
import { attendanceTone } from "@/lib/tones";
import { pageHead } from "@/lib/seo";
import type { AttendanceSubject } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_student/attendance")({
  head: () => pageHead("Attendance Tracker", "Track attendance per subject and see how many classes you can miss or must attend under the 75% rule."),
  component: AttendancePage,
});

function AttendancePage() {
  const [subjects, setSubjects] = attendanceStore.useStore();
  const [settings] = settingsStore.useStore();
  const threshold = settings.attendanceThreshold;
  const [editing, setEditing] = useState<AttendanceSubject | "new" | null>(null);

  const overall = overallAttendance(subjects);
  const statuses = subjects.map((s) => attendanceStatus(s.attended, s.total, threshold));
  const shortCount = statuses.filter((s) => s.kind === "short").length;
  const totalCanMiss = statuses.reduce((sum, s) => (s.kind === "safe" ? sum + s.canMiss : sum), 0);

  const mark = (id: string, present: boolean) => {
    setSubjects((xs) => xs.map((s) => (s.id === id ? { ...s, total: s.total + 1, attended: s.attended + (present ? 1 : 0) } : s)));
    toast.success(present ? "Marked present" : "Marked absent");
  };
  const undo = (id: string) => {
    setSubjects((xs) =>
      xs.map((s) => (s.id === id && s.total > 0 ? { ...s, total: s.total - 1, attended: Math.min(s.attended, s.total - 1) } : s)),
    );
  };
  const remove = (id: string) => {
    setSubjects((xs) => xs.filter((s) => s.id !== id));
    toast.success("Subject removed");
  };

  return (
    <div>
      <PageHeader
        title="Attendance Tracker"
        description={`Your college requires at least ${threshold}% attendance in each subject. Mark each class as present or absent to stay on top of it.`}
        icon={ClipboardCheck}
        actions={
          <Button variant="gradient" onClick={() => setEditing("new")}>
            <Plus /> Add subject
          </Button>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard label="Overall" value={`${overall.percent.toFixed(1)}%`} hint={`${overall.attended}/${overall.total} classes`} icon={ClipboardCheck} tone={attendanceTone(overall.percent, threshold)} />
        <StatCard label="Required" value={`${threshold}%`} hint="Change in Settings" icon={CheckCircle2} tone="cyan" />
        <StatCard label="Below requirement" value={String(shortCount)} hint={shortCount ? "Needs attention" : "All subjects safe"} icon={AlertTriangle} tone={shortCount ? "destructive" : "success"} />
        <StatCard label="Total safe skips" value={String(totalCanMiss)} hint="Across safe subjects" icon={Minus} tone="primary" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
          {subjects.map((s) => {
            const st = attendanceStatus(s.attended, s.total, threshold);
            const tone = attendanceTone(st.percent, threshold);
            return (
              <li key={s.id} className="rounded-2xl border bg-card p-5 shadow-soft">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{s.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {s.code} · {s.attended}/{s.total} attended
                    </p>
                  </div>
                  <p className={cn("font-display text-2xl font-semibold", tone === "destructive" ? "text-destructive" : tone === "warning" ? "text-warning" : "text-success")}>
                    {st.percent.toFixed(1)}%
                  </p>
                </div>
                <Meter className="mt-3" value={st.percent} tone={tone} marker={threshold} />
                <p
                  className={cn(
                    "mt-3 rounded-lg px-3 py-2 text-sm font-medium",
                    st.kind === "short" ? "bg-destructive/10 text-destructive" : st.kind === "safe" && st.canMiss === 0 ? "bg-warning/10 text-warning" : "bg-success/10 text-success",
                  )}
                >
                  {st.kind === "empty"
                    ? "No classes recorded yet."
                    : st.kind === "short"
                      ? `Must attend the next ${st.mustAttend} class${st.mustAttend === 1 ? "" : "es"} to reach ${threshold}%`
                      : st.canMiss === 0
                        ? `On the edge: don't miss the next class`
                        : `Safe to miss ${st.canMiss} class${st.canMiss === 1 ? "" : "es"}`}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Button size="sm" variant="secondary" className="border border-success/30 text-success hover:bg-success/15" onClick={() => mark(s.id, true)}>
                    <Plus /> Present
                  </Button>
                  <Button size="sm" variant="secondary" className="border border-destructive/30 text-destructive hover:bg-destructive/15" onClick={() => mark(s.id, false)}>
                    <Minus /> Absent
                  </Button>
                  <div className="ml-auto flex">
                    <Button size="sm" variant="ghost" className="text-muted-foreground" onClick={() => undo(s.id)} disabled={s.total === 0}>
                      Undo
                    </Button>
                    <Button size="sm" variant="ghost" className="text-muted-foreground" onClick={() => setEditing(s)} aria-label={`Edit ${s.name}`}>
                      <Pencil />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-destructive" onClick={() => remove(s.id)} aria-label={`Delete ${s.name}`}>
                      <Trash2 />
                    </Button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="xl:sticky xl:top-24 xl:self-start">
          <AttendanceCalculator defaultThreshold={threshold} />
        </div>
      </div>

      <SubjectDialog
        key={editing === "new" ? "new" : (editing?.id ?? "none")}
        subject={editing}
        onClose={() => setEditing(null)}
        onSave={(sub) => {
          setSubjects((xs) => (xs.some((x) => x.id === sub.id) ? xs.map((x) => (x.id === sub.id ? sub : x)) : [...xs, sub]));
          toast.success("Subject saved");
          setEditing(null);
        }}
      />
    </div>
  );
}

function SubjectDialog({
  subject,
  onClose,
  onSave,
}: {
  subject: AttendanceSubject | "new" | null;
  onClose: () => void;
  onSave: (s: AttendanceSubject) => void;
}) {
  const existing = subject && subject !== "new" ? subject : null;
  const [name, setName] = useState(existing?.name ?? "");
  const [code, setCode] = useState(existing?.code ?? "");
  const [attended, setAttended] = useState(String(existing?.attended ?? 0));
  const [total, setTotal] = useState(String(existing?.total ?? 0));
  const [error, setError] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const a = parseInt(attended, 10) || 0;
    const t = parseInt(total, 10) || 0;
    if (!name.trim()) return setError("Enter a subject name.");
    if (a > t) return setError("Attended can't be more than total classes.");
    onSave({ id: existing?.id ?? newId("sub"), name: name.trim(), code: code.trim().toUpperCase() || "—", attended: a, total: t });
  };

  return (
    <Dialog open={subject !== null} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">{existing ? "Edit subject" : "Add subject"}</DialogTitle>
          <DialogDescription>Enter the classes held so far and how many you attended.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label htmlFor="sname">Subject name</Label>
            <Input id="sname" className="mt-1.5" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Compiler Design" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label htmlFor="scode">Code</Label>
              <Input id="scode" className="mt-1.5" value={code} onChange={(e) => setCode(e.target.value)} placeholder="CS601" />
            </div>
            <div>
              <Label htmlFor="satt">Attended</Label>
              <Input id="satt" inputMode="numeric" className="mt-1.5" value={attended} onChange={(e) => setAttended(e.target.value.replace(/\D/g, ""))} />
            </div>
            <div>
              <Label htmlFor="stot">Total</Label>
              <Input id="stot" inputMode="numeric" className="mt-1.5" value={total} onChange={(e) => setTotal(e.target.value.replace(/\D/g, ""))} />
            </div>
          </div>
          {error && <p className="text-sm font-medium text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="gradient">
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
