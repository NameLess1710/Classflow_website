import {
  Bell,
  BookOpen,
  Bot,
  CalendarDays,
  ClipboardCheck,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  Calculator,
  UserCog,
  Clock,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  to:
    | "/dashboard"
    | "/notices"
    | "/notes"
    | "/assignments"
    | "/timetable"
    | "/exams"
    | "/calendar"
    | "/attendance"
    | "/cgpa"
    | "/ask-ai"
    | "/profile";
  label: string;
  description: string;
  icon: LucideIcon;
  group: "Overview" | "Academics" | "Planning" | "Tools" | "Account";
}

export const NAV_ITEMS: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", description: "Your day at a glance", icon: LayoutDashboard, group: "Overview" },
  { to: "/notices", label: "Notices", description: "College announcements", icon: Bell, group: "Overview" },
  { to: "/notes", label: "Study Notes", description: "Notes & documents", icon: BookOpen, group: "Academics" },
  { to: "/assignments", label: "Assignments", description: "Track deadlines", icon: ClipboardList, group: "Academics" },
  { to: "/exams", label: "Exam Information", description: "Schedule & syllabus", icon: GraduationCap, group: "Academics" },
  { to: "/timetable", label: "Timetable", description: "Weekly class schedule", icon: Clock, group: "Planning" },
  { to: "/calendar", label: "Academic Calendar", description: "Holidays & events", icon: CalendarDays, group: "Planning" },
  { to: "/attendance", label: "Attendance Tracker", description: "75% rule calculator", icon: ClipboardCheck, group: "Tools" },
  { to: "/cgpa", label: "CGPA Calculator", description: "Grades & target goals", icon: Calculator, group: "Tools" },
  { to: "/ask-ai", label: "Ask CampusPulse AI", description: "Study assistant (demo)", icon: Bot, group: "Tools" },
  { to: "/profile", label: "Profile & Settings", description: "Your account", icon: UserCog, group: "Account" },
];

export const NAV_GROUPS = ["Overview", "Academics", "Planning", "Tools", "Account"] as const;
