import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import { AuthLayout, FieldError } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { COLLEGE_NAME, DEPARTMENTS, defaultProfile } from "@/lib/sample-data";
import { profileStore, sessionStore } from "@/lib/stores";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create your student account — Univo" },
      { name: "description", content: "Register for Univo with your roll number, department and year." },
      { property: "og:title", content: "Create your student account — Univo" },
      { property: "og:description", content: "Join Univo and manage your semester in one place." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RegisterPage,
});

const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    rollNo: "",
    email: "",
    department: "",
    year: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState({});
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e) => {
    e.preventDefault();
    const next = {};
    if (form.name.trim().length < 2) next.name = "Enter your full name";
    if (!/^[A-Za-z0-9-]{4,15}$/.test(form.rollNo.trim())) next.rollNo = "Use 4–15 letters or numbers";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) next.email = "Enter a valid email address";
    if (!form.department) next.department = "Choose your department";
    if (!form.year) next.year = "Choose your year";
    if (form.password.length < 6) next.password = "At least 6 characters";
    if (form.confirm !== form.password) next.confirm = "Passwords do not match";
    setErrors(next);
    if (Object.keys(next).length) return;

    const yearIndex = YEARS.indexOf(form.year);
    profileStore.set({
      ...defaultProfile(),
      name: form.name.trim(),
      rollNo: form.rollNo.trim().toUpperCase(),
      email: form.email.trim(),
      department: form.department,
      year: form.year,
      semester: `Semester ${yearIndex * 2 + 1}`,
      college: COLLEGE_NAME,
      phone: "",
      bio: "",
    });
    sessionStore.set({ loggedIn: true, email: form.email.trim() });
    toast.success("Account created. Welcome to Univo!");
    navigate({ to: "/dashboard" });
  };

  return (
    <AuthLayout title="Create your account" subtitle="It takes less than a minute. You can edit details later in your profile.">
      <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2" noValidate>
        <div className="sm:col-span-2">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" className="mt-1.5 h-11" placeholder="e.g. Priya Menon" value={form.name} onChange={(e) => set("name")(e.target.value)} />
          <FieldError message={errors.name} />
        </div>
        <div>
          <Label htmlFor="roll">Roll number</Label>
          <Input id="roll" className="mt-1.5 h-11" placeholder="22CSE1047" value={form.rollNo} onChange={(e) => set("rollNo")(e.target.value)} />
          <FieldError message={errors.rollNo} />
        </div>
        <div>
          <Label htmlFor="remail">College email</Label>
          <Input id="remail" type="email" className="mt-1.5 h-11" placeholder="name@college.edu.in" value={form.email} onChange={(e) => set("email")(e.target.value)} />
          <FieldError message={errors.email} />
        </div>
        <div>
          <Label htmlFor="dept">Department</Label>
          <Select value={form.department} onValueChange={set("department")}>
            <SelectTrigger id="dept" className="mt-1.5 h-11">
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              {DEPARTMENTS.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError message={errors.department} />
        </div>
        <div>
          <Label htmlFor="year">Year of study</Label>
          <Select value={form.year} onValueChange={set("year")}>
            <SelectTrigger id="year" className="mt-1.5 h-11">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {YEARS.map((y) => (
                <SelectItem key={y} value={y}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError message={errors.year} />
        </div>
        <div>
          <Label htmlFor="rpass">Password</Label>
          <Input id="rpass" type="password" className="mt-1.5 h-11" value={form.password} onChange={(e) => set("password")(e.target.value)} autoComplete="new-password" />
          <FieldError message={errors.password} />
        </div>
        <div>
          <Label htmlFor="rconfirm">Confirm password</Label>
          <Input id="rconfirm" type="password" className="mt-1.5 h-11" value={form.confirm} onChange={(e) => set("confirm")(e.target.value)} autoComplete="new-password" />
          <FieldError message={errors.confirm} />
        </div>
        <Button type="submit" variant="gradient" size="lg" className="mt-2 w-full sm:col-span-2">
          <UserPlus /> Create account
        </Button>
        <p className="text-xs text-muted-foreground sm:col-span-2">
          Demo mode: your details are stored only in this browser until a backend is connected.
        </p>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already registered?{" "}
        <Link to="/" className="font-semibold text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
