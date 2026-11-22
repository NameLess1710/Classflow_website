export interface Profile {
  name: string;
  email: string;
  rollNo: string;
  department: string;
  program: string;
  year: string;
  semester: string;
  section: string;
  phone: string;
  college: string;
  bio: string;
}

export interface Settings {
  attendanceThreshold: number;
  emailNotices: boolean;
  deadlineReminders: boolean;
  examAlerts: boolean;
  compactSidebar: boolean;
}

export interface Session {
  loggedIn: boolean;
  email?: string;
}

export type NoticeCategory = "Academic" | "Exam" | "Events" | "Placement" | "Hostel" | "Library";

export interface Notice {
  id: string;
  title: string;
  category: NoticeCategory;
  date: string;
  from: string;
  summary: string;
  body: string;
  pinned?: boolean;
  important?: boolean;
}

export type NoteKind = "PDF" | "DOCX" | "PPT" | "Note";

export interface StudyNote {
  id: string;
  title: string;
  subject: string;
  kind: NoteKind;
  content: string;
  createdAt: string;
  size?: string;
  uploadedBy?: string;
  tags: string[];
}

export type Priority = "High" | "Medium" | "Low";

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  priority: Priority;
  description: string;
  completed: boolean;
  completedAt?: string;
  marks?: number;
}

export interface ClassSlot {
  id: string;
  day: string;
  start: string;
  end: string;
  subject: string;
  code: string;
  room: string;
  faculty: string;
  type: "Lecture" | "Lab" | "Tutorial";
}

export interface Exam {
  id: string;
  subject: string;
  code: string;
  type: "Mid-Semester" | "End-Semester" | "Lab Exam" | "Quiz";
  date: string;
  start: string;
  end: string;
  venue: string;
  seat: string;
  syllabus: string[];
  maxMarks: number;
}

export type EventKind = "Holiday" | "Exam" | "Event" | "Deadline" | "Academic";

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  endDate?: string;
  kind: EventKind;
  description?: string;
}

export interface AttendanceSubject {
  id: string;
  name: string;
  code: string;
  attended: number;
  total: number;
}

export interface Course {
  id: string;
  name: string;
  credits: number;
  grade: string;
}

export interface Semester {
  id: string;
  name: string;
  courses: Course[];
}
