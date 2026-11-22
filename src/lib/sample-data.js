/**
 * Realistic demo data. Every export is a function so dates are computed at runtime
 * relative to today (module-scope Date is unsafe on the edge runtime).
 */
import { isoDaysFromNow } from "./dates";

export const COLLEGE_NAME = "Greenfield Institute of Technology";

export const SUBJECTS = [
  { code: "CS501", name: "Database Management Systems", faculty: "Dr. Meera Iyer" },
  { code: "CS502", name: "Operating Systems", faculty: "Prof. Rajesh Kulkarni" },
  { code: "CS503", name: "Computer Networks", faculty: "Dr. Ananya Bose" },
  { code: "CS504", name: "Design & Analysis of Algorithms", faculty: "Dr. Vikram Nair" },
  { code: "CS505", name: "Software Engineering", faculty: "Prof. Sneha Patil" },
  { code: "HS501", name: "Professional Ethics", faculty: "Dr. Kavita Rao" },
];

export const SUBJECT_NAMES = SUBJECTS.map((s) => s.name);

export const DEPARTMENTS = [
  "Computer Science & Engineering",
  "Information Technology",
  "Electronics & Communication",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
];

export function defaultProfile() {
  return {
    name: "Aarav Sharma",
    email: "aarav.sharma@gitcollege.edu.in",
    rollNo: "22CSE1047",
    department: "Computer Science & Engineering",
    program: "B.Tech",
    year: "3rd Year",
    semester: "Semester 5",
    section: "B",
    phone: "+91 98765 43210",
    college: COLLEGE_NAME,
    bio: "Interested in databases, backend systems and competitive programming.",
  };
}

export function defaultSettings() {
  return {
    attendanceThreshold: 75,
    emailNotices: true,
    deadlineReminders: true,
    examAlerts: true,
    compactSidebar: false,
  };
}

export function sampleNotices() {
  return [
    {
      id: "n1",
      title: "Mid-semester examination timetable released",
      category: "Exam",
      date: isoDaysFromNow(0),
      from: "Office of the Controller of Examinations",
      summary: "Mid-sem exams for Semester 5 begin next week. Check your seat allocation.",
      body: "The mid-semester examinations for all Semester 5 B.Tech students will be conducted as per the published schedule. Students must carry their college ID card and hall ticket. Seat allocation is available on the Exam Information page. Reporting time is 15 minutes before the start of each exam. Use of electronic devices is strictly prohibited inside the examination hall.",
      pinned: true,
      important: true,
    },
    {
      id: "n2",
      title: "Campus placement drive: Infosys & TCS Digital",
      category: "Placement",
      date: isoDaysFromNow(-1),
      from: "Training & Placement Cell",
      summary: "Pre-placement talk on Friday at 10:00 AM in the Main Auditorium.",
      body: "Eligible students (CGPA ≥ 7.0, no active backlogs) from the 2027 batch are requested to register on the placement portal by Thursday 5:00 PM. A pre-placement talk will be held on Friday at 10:00 AM in the Main Auditorium. Formal attire is mandatory. Bring two printed copies of your resume.",
      important: true,
    },
    {
      id: "n3",
      title: "Last date for minimum attendance verification",
      category: "Academic",
      date: isoDaysFromNow(-2),
      from: "Dean of Academics",
      summary: "Students below 75% attendance will not be permitted for end-semester exams.",
      body: "As per university regulations, a minimum of 75% attendance in each course is mandatory to appear for end-semester examinations. Students with medical or other valid reasons must submit supporting documents to their class advisor before the verification deadline. Use the Attendance Tracker to check where you stand.",
      pinned: true,
    },
    {
      id: "n4",
      title: "TechNova 2026: Annual technical fest registrations open",
      category: "Events",
      date: isoDaysFromNow(-3),
      from: "Student Activities Council",
      summary: "Hackathon, robotics, coding contests and paper presentations. Register by month end.",
      body: "TechNova 2026 brings a 24-hour hackathon, RoboWars, a competitive programming contest, and technical paper presentations. Teams of 2 to 4 members can register on the fest website. Winners receive cash prizes and internship interview opportunities with sponsor companies.",
    },
    {
      id: "n5",
      title: "Library extended hours during examinations",
      category: "Library",
      date: isoDaysFromNow(-4),
      from: "Central Library",
      summary: "The reading hall will stay open until 11:00 PM on weekdays during exams.",
      body: "To support exam preparation, the central library reading hall will remain open from 8:00 AM to 11:00 PM on weekdays and 9:00 AM to 6:00 PM on Saturdays during the examination period. Students must sign in with their ID cards.",
    },
    {
      id: "n6",
      title: "Hostel mess menu revised for November",
      category: "Hostel",
      date: isoDaysFromNow(-6),
      from: "Chief Warden",
      summary: "New menu effective from Monday. Feedback forms available at the mess counter.",
      body: "Based on student feedback, the mess menu has been revised. Breakfast timings are now 7:15 AM to 9:15 AM. Students may submit feedback through the forms available at the mess counter or via the hostel committee representatives.",
    },
    {
      id: "n7",
      title: "Guest lecture: Building scalable systems at fintech startups",
      category: "Events",
      date: isoDaysFromNow(-8),
      from: "Department of CSE",
      summary: "Talk by an alumnus, Senior Engineer at a Bengaluru fintech, in Seminar Hall 2.",
      body: "The Department of Computer Science & Engineering invites all students to a guest lecture on designing distributed, fault-tolerant systems. Attendance is compulsory for 3rd year CSE students and counts towards the Software Engineering internal assessment.",
    },
    {
      id: "n8",
      title: "Semester fee payment reminder",
      category: "Academic",
      date: isoDaysFromNow(-10),
      from: "Accounts Section",
      summary: "Pay the even semester fee before the due date to avoid a late fine.",
      body: "Students are reminded to clear the semester tuition fee through the online fee portal. A late fine of ₹50 per day will be charged after the due date. Contact the accounts section for instalment requests.",
    },
  ];
}

export function sampleNotes() {
  return [
    {
      id: "d1",
      title: "DBMS Unit 3: Normalization (1NF to BCNF)",
      subject: "Database Management Systems",
      kind: "PDF",
      size: "2.4 MB",
      uploadedBy: "Dr. Meera Iyer",
      createdAt: isoDaysFromNow(-1),
      tags: ["normalization", "unit 3"],
      content:
        "Functional dependencies, closure of attributes, candidate keys.\n\n1NF: atomic values only.\n2NF: 1NF + no partial dependency on a composite key.\n3NF: 2NF + no transitive dependency.\nBCNF: for every FD X → Y, X must be a super key.\n\nPractice: decompose R(A,B,C,D) with A→B, B→C into BCNF.",
    },
    {
      id: "d2",
      title: "OS: Process scheduling algorithms cheat sheet",
      subject: "Operating Systems",
      kind: "Note",
      createdAt: isoDaysFromNow(-2),
      uploadedBy: "You",
      tags: ["scheduling", "mid-sem"],
      content:
        "FCFS: simple, convoy effect.\nSJF: optimal average waiting time, needs burst prediction.\nRound Robin: time quantum q; small q → more context switches.\nPriority: risk of starvation, fixed with ageing.\n\nFormulae: Turnaround = Completion − Arrival; Waiting = Turnaround − Burst.",
    },
    {
      id: "d3",
      title: "Computer Networks: OSI vs TCP/IP model slides",
      subject: "Computer Networks",
      kind: "PPT",
      size: "5.1 MB",
      uploadedBy: "Dr. Ananya Bose",
      createdAt: isoDaysFromNow(-3),
      tags: ["layers", "unit 1"],
      content:
        "7 OSI layers: Physical, Data Link, Network, Transport, Session, Presentation, Application.\nTCP/IP collapses these into 4: Link, Internet, Transport, Application.\n\nKey protocols by layer: Ethernet, IP, TCP/UDP, HTTP/DNS.",
    },
    {
      id: "d4",
      title: "DAA: Dynamic programming problem set",
      subject: "Design & Analysis of Algorithms",
      kind: "DOCX",
      size: "640 KB",
      uploadedBy: "Dr. Vikram Nair",
      createdAt: isoDaysFromNow(-5),
      tags: ["dp", "practice"],
      content:
        "1. 0/1 Knapsack: build table dp[i][w].\n2. Longest Common Subsequence.\n3. Matrix Chain Multiplication.\n4. Edit distance.\n\nFor each: write the recurrence, base cases, and time/space complexity.",
    },
    {
      id: "d5",
      title: "Software Engineering: SDLC models comparison",
      subject: "Software Engineering",
      kind: "PDF",
      size: "1.2 MB",
      uploadedBy: "Prof. Sneha Patil",
      createdAt: isoDaysFromNow(-7),
      tags: ["sdlc", "agile"],
      content:
        "Waterfall: sequential, good for fixed requirements.\nSpiral: risk-driven, iterative.\nAgile/Scrum: sprints, product backlog, daily stand-ups.\nV-Model: verification and validation paired at each stage.",
    },
  ];
}

export function sampleAssignments() {
  return [
    {
      id: "a1",
      title: "ER diagram and relational schema for a library system",
      subject: "Database Management Systems",
      dueDate: isoDaysFromNow(1),
      priority: "High",
      description: "Draw the ER diagram, map it to relational tables, and identify primary and foreign keys. Submit as a PDF on the LMS.",
      completed: false,
    },
    {
      id: "a2",
      title: "Implement Round Robin scheduler in C",
      subject: "Operating Systems",
      dueDate: isoDaysFromNow(3),
      priority: "High",
      description: "Simulate RR with a configurable time quantum. Print Gantt chart, average waiting and turnaround time.",
      completed: false,
    },
    {
      id: "a3",
      title: "Subnetting worksheet (Class B & C)",
      subject: "Computer Networks",
      dueDate: isoDaysFromNow(5),
      priority: "Medium",
      description: "Solve all 12 subnetting problems. Show network address, broadcast address and usable host range.",
      completed: false,
    },
    {
      id: "a4",
      title: "Case study: Ethical issues in AI hiring tools",
      subject: "Professional Ethics",
      dueDate: isoDaysFromNow(8),
      priority: "Low",
      description: "800 to 1000 word report discussing bias, transparency and accountability.",
      completed: false,
    },
    {
      id: "a5",
      title: "SRS document for the mini project",
      subject: "Software Engineering",
      dueDate: isoDaysFromNow(10),
      priority: "Medium",
      description: "Prepare the Software Requirements Specification following the IEEE 830 template.",
      completed: false,
    },
    {
      id: "a6",
      title: "Greedy algorithms: Huffman coding problem set",
      subject: "Design & Analysis of Algorithms",
      dueDate: isoDaysFromNow(-2),
      priority: "Medium",
      description: "Solve problems 1 to 6 from Chapter 16 and submit handwritten solutions.",
      completed: true,
      completedAt: isoDaysFromNow(-3),
      marks: 9,
    },
    {
      id: "a7",
      title: "SQL queries lab record: joins and subqueries",
      subject: "Database Management Systems",
      dueDate: isoDaysFromNow(-5),
      priority: "Low",
      description: "Write and execute 15 queries on the university database. Attach output screenshots.",
      completed: true,
      completedAt: isoDaysFromNow(-6),
      marks: 10,
    },
  ];
}

export function sampleTimetable() {
  const s = (
    id,
    day,
    start,
    end,
    code,
    room,
    type = "Lecture",
  ) => {
    const sub = SUBJECTS.find((x) => x.code === code);
    return {
      id,
      day,
      start,
      end,
      code: type === "Lab" ? `${code}L` : code,
      subject: type === "Lab" ? `${sub.name} Lab` : sub.name,
      faculty: sub.faculty,
      room,
      type,
    };
  };
  return [
    s("t1", "Monday", "09:00", "09:50", "CS501", "LH-204"),
    s("t2", "Monday", "10:00", "10:50", "CS502", "LH-204"),
    s("t3", "Monday", "11:10", "12:00", "CS504", "LH-204"),
    s("t4", "Monday", "14:00", "16:00", "CS501", "DB Lab 2", "Lab"),
    s("t5", "Tuesday", "09:00", "09:50", "CS503", "LH-204"),
    s("t6", "Tuesday", "10:00", "10:50", "CS505", "LH-204"),
    s("t7", "Tuesday", "11:10", "12:00", "HS501", "LH-110"),
    s("t8", "Tuesday", "14:00", "14:50", "CS504", "LH-204", "Tutorial"),
    s("t9", "Wednesday", "09:00", "09:50", "CS502", "LH-204"),
    s("t10", "Wednesday", "10:00", "10:50", "CS501", "LH-204"),
    s("t11", "Wednesday", "11:10", "12:00", "CS503", "LH-204"),
    s("t12", "Wednesday", "14:00", "16:00", "CS502", "OS Lab 1", "Lab"),
    s("t13", "Thursday", "09:00", "09:50", "CS504", "LH-204"),
    s("t14", "Thursday", "10:00", "10:50", "CS505", "LH-204"),
    s("t15", "Thursday", "11:10", "12:00", "CS503", "LH-204"),
    s("t16", "Thursday", "14:00", "14:50", "HS501", "LH-110"),
    s("t17", "Friday", "09:00", "09:50", "CS501", "LH-204"),
    s("t18", "Friday", "10:00", "10:50", "CS502", "LH-204"),
    s("t19", "Friday", "11:10", "12:00", "CS505", "LH-204"),
    s("t20", "Friday", "14:00", "14:50", "CS503", "LH-204", "Tutorial"),
    s("t21", "Saturday", "09:00", "09:50", "CS504", "LH-204"),
    s("t22", "Saturday", "10:00", "10:50", "CS505", "LH-204", "Tutorial"),
  ];
}

export function sampleExams() {
  return [
    {
      id: "e1",
      subject: "Database Management Systems",
      code: "CS501",
      type: "Mid-Semester",
      date: isoDaysFromNow(6),
      start: "10:00",
      end: "11:30",
      venue: "Exam Hall A, Block 2",
      seat: "A-47",
      maxMarks: 30,
      syllabus: ["ER model", "Relational algebra", "SQL", "Normalization (Unit 1–3)"],
    },
    {
      id: "e2",
      subject: "Operating Systems",
      code: "CS502",
      type: "Mid-Semester",
      date: isoDaysFromNow(7),
      start: "10:00",
      end: "11:30",
      venue: "Exam Hall A, Block 2",
      seat: "A-47",
      maxMarks: 30,
      syllabus: ["Processes & threads", "CPU scheduling", "Synchronization"],
    },
    {
      id: "e3",
      subject: "Computer Networks",
      code: "CS503",
      type: "Mid-Semester",
      date: isoDaysFromNow(8),
      start: "14:00",
      end: "15:30",
      venue: "Exam Hall B, Block 2",
      seat: "B-12",
      maxMarks: 30,
      syllabus: ["OSI & TCP/IP", "Physical layer", "Data link layer", "IP addressing"],
    },
    {
      id: "e4",
      subject: "Design & Analysis of Algorithms",
      code: "CS504",
      type: "Mid-Semester",
      date: isoDaysFromNow(9),
      start: "10:00",
      end: "11:30",
      venue: "Exam Hall A, Block 2",
      seat: "A-47",
      maxMarks: 30,
      syllabus: ["Asymptotic analysis", "Divide & conquer", "Greedy algorithms"],
    },
    {
      id: "e5",
      subject: "Software Engineering",
      code: "CS505",
      type: "Quiz",
      date: isoDaysFromNow(4),
      start: "11:10",
      end: "11:40",
      venue: "LH-204",
      seat: "Regular seating",
      maxMarks: 10,
      syllabus: ["SDLC models", "Requirement engineering"],
    },
    {
      id: "e6",
      subject: "Database Management Systems Lab",
      code: "CS501L",
      type: "Lab Exam",
      date: isoDaysFromNow(20),
      start: "14:00",
      end: "16:00",
      venue: "DB Lab 2",
      seat: "System 18",
      maxMarks: 50,
      syllabus: ["DDL & DML", "Joins", "Views & triggers", "PL/SQL procedures"],
    },
  ];
}

export function sampleCalendarEvents() {
  const year = new Date().getFullYear();
  const fixed = [
    { id: "c1", title: "Guru Nanak Jayanti", date: `${year}-11-24`, kind: "Holiday" },
    { id: "c2", title: "Christmas", date: `${year}-12-25`, kind: "Holiday" },
    { id: "c3", title: "New Year's Day", date: `${year + 1}-01-01`, kind: "Holiday" },
    { id: "c4", title: "Republic Day", date: `${year + 1}-01-26`, kind: "Holiday" },
    { id: "c5", title: "Last instructional day (odd semester)", date: `${year}-12-05`, kind: "Academic" },
    {
      id: "c6",
      title: "End-semester examinations",
      date: `${year}-12-08`,
      endDate: `${year}-12-20`,
      kind: "Exam",
      description: "Theory examinations for all odd semesters.",
    },
    { id: "c7", title: "Winter vacation", date: `${year}-12-21`, endDate: `${year + 1}-01-03`, kind: "Holiday" },
    { id: "c8", title: "Even semester classes begin", date: `${year + 1}-01-05`, kind: "Academic" },
  ];
  const relative = [
    { id: "r1", title: "Attendance verification deadline", date: isoDaysFromNow(2), kind: "Deadline" },
    { id: "r2", title: "Mid-semester examinations", date: isoDaysFromNow(6), endDate: isoDaysFromNow(9), kind: "Exam" },
    { id: "r3", title: "TechNova 2026 technical fest", date: isoDaysFromNow(12), endDate: isoDaysFromNow(13), kind: "Event" },
    { id: "r4", title: "Placement pre-talk: Infosys & TCS", date: isoDaysFromNow(4), kind: "Event" },
    { id: "r5", title: "Mini project SRS submission", date: isoDaysFromNow(10), kind: "Deadline" },
    { id: "r6", title: "Parent–teacher meeting", date: isoDaysFromNow(15), kind: "Academic" },
  ];
  return [...relative, ...fixed].sort((a, b) => a.date.localeCompare(b.date));
}

export function sampleAttendance() {
  return [
    { id: "s1", name: "Database Management Systems", code: "CS501", attended: 34, total: 40 },
    { id: "s2", name: "Operating Systems", code: "CS502", attended: 29, total: 38 },
    { id: "s3", name: "Computer Networks", code: "CS503", attended: 25, total: 36 },
    { id: "s4", name: "Design & Analysis of Algorithms", code: "CS504", attended: 33, total: 37 },
    { id: "s5", name: "Software Engineering", code: "CS505", attended: 27, total: 35 },
    { id: "s6", name: "Professional Ethics", code: "HS501", attended: 16, total: 22 },
  ];
}

export function sampleSemesters() {
  return [
    {
      id: "sem1",
      name: "Semester 1",
      courses: [
        { id: "c11", name: "Engineering Mathematics I", credits: 4, grade: "A" },
        { id: "c12", name: "Engineering Physics", credits: 4, grade: "B+" },
        { id: "c13", name: "Programming in C", credits: 4, grade: "O" },
        { id: "c14", name: "Basic Electrical Engineering", credits: 3, grade: "A" },
        { id: "c15", name: "Communication Skills", credits: 2, grade: "A+" },
      ],
    },
    {
      id: "sem2",
      name: "Semester 2",
      courses: [
        { id: "c21", name: "Engineering Mathematics II", credits: 4, grade: "B+" },
        { id: "c22", name: "Engineering Chemistry", credits: 4, grade: "A" },
        { id: "c23", name: "Data Structures", credits: 4, grade: "A+" },
        { id: "c24", name: "Engineering Graphics", credits: 3, grade: "B" },
        { id: "c25", name: "Environmental Science", credits: 2, grade: "A" },
      ],
    },
    {
      id: "sem3",
      name: "Semester 3",
      courses: [
        { id: "c31", name: "Discrete Mathematics", credits: 4, grade: "A" },
        { id: "c32", name: "Object Oriented Programming", credits: 4, grade: "O" },
        { id: "c33", name: "Digital Logic Design", credits: 4, grade: "A+" },
        { id: "c34", name: "Computer Organization", credits: 3, grade: "A" },
        { id: "c35", name: "Economics for Engineers", credits: 2, grade: "B+" },
      ],
    },
    {
      id: "sem4",
      name: "Semester 4",
      courses: [
        { id: "c41", name: "Probability & Statistics", credits: 4, grade: "A" },
        { id: "c42", name: "Theory of Computation", credits: 4, grade: "B+" },
        { id: "c43", name: "Microprocessors", credits: 3, grade: "A" },
        { id: "c44", name: "Java Programming", credits: 4, grade: "A+" },
        { id: "c45", name: "Web Technologies", credits: 3, grade: "O" },
      ],
    },
  ];
}
