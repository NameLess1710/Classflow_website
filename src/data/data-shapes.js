/**
 * Shapes of the data used across ClassFlow (Univo).
 *
 * JavaScript has no type system, so this file only documents what each data
 * object contains. Nothing here is imported; it is a reference for reading
 * sample-data.js and the pages. When the college API arrives, its responses
 * should be turned into these same shapes so the pages do not need to change.
 *
 * Profile        { name, email, rollNo, department, program, year, semester,
 *                  section, phone, college, bio }
 * Settings       { attendanceThreshold (number, default 75), emailNotices,
 *                  deadlineReminders, examAlerts, compactSidebar (booleans) }
 * Session        { loggedIn (boolean), email (optional) }
 *
 * Notice         { id, title, category, date, from, summary, body,
 *                  pinned (optional), important (optional) }
 *                category: "Academic" | "Exam" | "Events" | "Placement" |
 *                          "Hostel" | "Library"
 *
 * StudyNote      { id, title, subject, kind, content, createdAt, tags (array),
 *                  size (optional), uploadedBy (optional) }
 *                kind: "PDF" | "DOCX" | "PPT" | "Note"
 *
 * Assignment     { id, title, subject, dueDate, priority, description,
 *                  completed (boolean), completedAt (optional), marks (optional) }
 *                priority: "High" | "Medium" | "Low"
 *
 * ClassSlot      { id, day, start, end, subject, code, room, faculty, type }
 *                type: "Lecture" | "Lab" | "Tutorial"
 *
 * Exam           { id, subject, code, type, date, start, end, venue, seat,
 *                  syllabus (array of strings), maxMarks }
 *                type: "Mid-Semester" | "End-Semester" | "Lab Exam" | "Quiz"
 *
 * CalendarEvent  { id, title, date, kind, endDate (optional), description (optional) }
 *                kind: "Holiday" | "Exam" | "Event" | "Deadline" | "Academic"
 *
 * AttendanceSubject  { id, name, code, attended (number), total (number) }
 *
 * Course         { id, name, credits (number), grade }
 * Semester       { id, name, courses (array of Course) }
 */
export {};
