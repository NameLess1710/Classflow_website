import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Bell, Mail, RotateCcw, Save, ShieldCheck, UserCog } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { SectionCard } from "@/components/common/SectionCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DEPARTMENTS } from "@/lib/sample-data";
import { profileStore, resetDemoData, settingsStore } from "@/lib/stores";
import { initials } from "@/lib/tones";
import { pageHead } from "@/lib/seo";
import type { Profile, Settings } from "@/lib/types";

export const Route = createFileRoute("/_student/profile")({
  head: () => pageHead("Profile & Settings", "Update your student profile, notification preferences and attendance requirement."),
  component: ProfilePage,
});

const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
const SEMESTERS = Array.from({ length: 8 }, (_, i) => `Semester ${i + 1}`);

function ProfilePage() {
  const [profile, setProfile] = profileStore.useStore();
  const [settings, setSettings] = settingsStore.useStore();
  const [draft, setDraft] = useState<Profile>(profile);
  const [error, setError] = useState("");
  const dirty = JSON.stringify(draft) !== JSON.stringify(profile);

  const field = (k: keyof Profile) => (v: string) => setDraft((d) => ({ ...d, [k]: v }));

  const save = (e: FormEvent) => {
    e.preventDefault();
    if (draft.name.trim().length < 2) return setError("Name must be at least 2 characters.");
    if (!/^\S+@\S+\.\S+$/.test(draft.email.trim())) return setError("Enter a valid email address.");
    setError("");
    setProfile({ ...draft, name: draft.name.trim(), email: draft.email.trim() });
    toast.success("Profile updated");
  };

  const updateSetting = <K extends keyof Settings>(k: K, v: Settings[K]) => {
    setSettings((s) => ({ ...s, [k]: v }));
    toast.success("Setting saved");
  };

  return (
    <div>
      <PageHeader title="Profile & Settings" description="Keep your details up to date. Changes are saved on this device." icon={UserCog} />

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="space-y-6">
          <section className="rounded-2xl border bg-gradient-hero p-6 text-center shadow-soft">
            <span className="mx-auto inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-brand font-display text-2xl font-bold text-cyan-foreground">
              {initials(profile.name)}
            </span>
            <h2 className="mt-3 text-lg font-semibold">{profile.name}</h2>
            <p className="text-sm text-muted-foreground">{profile.rollNo}</p>
            <p className="mt-3 text-sm text-foreground/85">
              {profile.program} · {profile.department}
            </p>
            <p className="text-sm text-muted-foreground">
              {profile.year} · {profile.semester} · Section {profile.section}
            </p>
            <p className="mt-3 text-xs text-muted-foreground">{profile.college}</p>
          </section>

          <SectionCard title="Demo data" icon={RotateCcw}>
            <p className="mb-4 text-sm text-muted-foreground">Restore the original sample notes, assignments, attendance, grades and profile.</p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <RotateCcw /> Reset demo data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset all demo data?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Notes you added, completed assignments, attendance changes, grades and profile edits on this device will be replaced with the sample data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      resetDemoData();
                      setDraft(profileStore.get());
                      toast.success("Demo data restored");
                    }}
                  >
                    Reset
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard title="Personal details" icon={UserCog}>
            <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="p-name">Full name</Label>
                <Input id="p-name" className="mt-1.5" value={draft.name} onChange={(e) => field("name")(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="p-roll">Roll number</Label>
                <Input id="p-roll" className="mt-1.5" value={draft.rollNo} onChange={(e) => field("rollNo")(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="p-email">Email</Label>
                <Input id="p-email" type="email" className="mt-1.5" value={draft.email} onChange={(e) => field("email")(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="p-phone">Phone</Label>
                <Input id="p-phone" className="mt-1.5" value={draft.phone} onChange={(e) => field("phone")(e.target.value)} placeholder="+91" />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="p-dept">Department</Label>
                <Select value={draft.department} onValueChange={field("department")}>
                  <SelectTrigger id="p-dept" className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="p-year">Year</Label>
                <Select value={draft.year} onValueChange={field("year")}>
                  <SelectTrigger id="p-year" className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {YEARS.map((y) => (
                      <SelectItem key={y} value={y}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-[1fr_90px] gap-3">
                <div>
                  <Label htmlFor="p-sem">Semester</Label>
                  <Select value={draft.semester} onValueChange={field("semester")}>
                    <SelectTrigger id="p-sem" className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SEMESTERS.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="p-sec">Section</Label>
                  <Input id="p-sec" className="mt-1.5" value={draft.section} maxLength={3} onChange={(e) => field("section")(e.target.value.toUpperCase())} />
                </div>
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="p-bio">About me</Label>
                <Textarea id="p-bio" className="mt-1.5" value={draft.bio} onChange={(e) => field("bio")(e.target.value)} placeholder="Interests, goals, clubs…" />
              </div>
              {error && <p className="text-sm font-medium text-destructive sm:col-span-2">{error}</p>}
              <div className="flex justify-end gap-2 sm:col-span-2">
                <Button type="button" variant="ghost" disabled={!dirty} onClick={() => setDraft(profile)}>
                  Discard
                </Button>
                <Button type="submit" variant="gradient" disabled={!dirty}>
                  <Save /> Save changes
                </Button>
              </div>
            </form>
          </SectionCard>

          <SectionCard title="Academic settings" icon={ShieldCheck}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold">Minimum attendance requirement</p>
                <p className="text-xs text-muted-foreground">Used by the Attendance Tracker and dashboard. Most colleges use 75%.</p>
              </div>
              <Select value={String(settings.attendanceThreshold)} onValueChange={(v) => updateSetting("attendanceThreshold", Number(v))}>
                <SelectTrigger className="sm:w-32" aria-label="Minimum attendance">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[65, 70, 75, 80, 85].map((t) => (
                    <SelectItem key={t} value={String(t)}>
                      {t}%
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </SectionCard>

          <SectionCard title="Notifications" icon={Bell}>
            <ul className="divide-y">
              {(
                [
                  ["emailNotices", "Email me important notices", "Exam and placement announcements", Mail],
                  ["deadlineReminders", "Assignment reminders", "A reminder 24 hours before each deadline", Bell],
                  ["examAlerts", "Exam alerts", "Reminders 3 days and 1 day before exams", ShieldCheck],
                ] as const
              ).map(([key, title, hint, Icon]) => (
                <li key={key} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                  <div className="flex items-start gap-3">
                    <Icon className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div>
                      <Label htmlFor={key} className="text-sm font-semibold">
                        {title}
                      </Label>
                      <p className="text-xs text-muted-foreground">{hint}</p>
                    </div>
                  </div>
                  <Switch id={key} checked={settings[key]} onCheckedChange={(v) => updateSetting(key, v)} />
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-muted-foreground">Preferences are saved now; emails will be sent once a backend is connected.</p>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
