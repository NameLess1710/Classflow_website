import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Info, LogIn } from "lucide-react";
import { toast } from "sonner";
import { AuthLayout, FieldError } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { profileStore, sessionStore } from "@/storage/app-stores";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sign in — Univo" },
      { name: "description", content: "Sign in to Univo to see your notices, deadlines, timetable, attendance and grades." },
      { property: "og:title", content: "Sign in — Univo" },
      { property: "og:description", content: "Your academic dashboard for college students." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});

  const submit = (e) => {
    e.preventDefault();
    const next = {};
    if (!email.trim()) next.email = "Enter your college email or roll number";
    if (password.length < 6) next.password = "Password must be at least 6 characters";
    setErrors(next);
    if (Object.keys(next).length) return;
    sessionStore.set({ loggedIn: true, email: email.trim() });
    toast.success(`Welcome back, ${profileStore.get().name.split(" ")[0]}!`);
    navigate({ to: "/dashboard" });
  };

  const fillDemo = () => {
    setEmail("aarav.sharma@gitcollege.edu.in");
    setPassword("campus123");
    setErrors({});
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your student account to continue.">
      <form onSubmit={submit} className="space-y-5" noValidate>
        <div>
          <Label htmlFor="email">College email or roll number</Label>
          <Input
            id="email"
            className="mt-1.5 h-11"
            placeholder="name@college.edu.in"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
          />
          <FieldError message={errors.email} />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <button
              type="button"
              className="text-xs font-medium text-cyan hover:underline"
              onClick={() => toast.info("Password reset will work once a backend is connected.")}
            >
              Forgot password?
            </button>
          </div>
          <div className="relative mt-1.5">
            <Input
              id="password"
              type={show ? "text" : "password"}
              className="h-11 pr-11"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground hover:text-foreground"
              aria-label={show ? "Hide password" : "Show password"}
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <FieldError message={errors.password} />
        </div>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <Checkbox defaultChecked /> Keep me signed in on this device
        </label>
        <Button type="submit" variant="gradient" size="lg" className="w-full">
          <LogIn /> Sign in
        </Button>
        <Button type="button" variant="outline" size="lg" className="w-full" onClick={fillDemo}>
          Use demo student account
        </Button>
      </form>

      <div className="mt-6 flex gap-2.5 rounded-xl border bg-card p-3.5 text-xs text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-cyan" />
        <p>
          Demo mode: sign-in is simulated and data is saved only in this browser. Real accounts will be
          verified once a backend is connected.
        </p>
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        New to Univo?{" "}
        <Link to="/register" className="font-semibold text-primary hover:underline">
          Create a student account
        </Link>
      </p>
    </AuthLayout>
  );
}
