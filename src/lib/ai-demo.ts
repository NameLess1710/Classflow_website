/**
 * Pre-written sample conversations for the Ask CampusPulse AI demo.
 * Nothing here is generated: the UI labels every reply as a demo placeholder
 * until a real AI backend is connected.
 */
export interface SamplePrompt {
  id: string;
  label: string;
  category: "Study" | "Planning" | "Campus";
  prompt: string;
  sampleAnswer: string;
}

export const SAMPLE_PROMPTS: SamplePrompt[] = [
  {
    id: "p1",
    label: "DBMS revision plan",
    category: "Planning",
    prompt: "Make a 5-day revision plan for my DBMS mid-semester exam.",
    sampleAnswer:
      "Here's an example of a 5-day plan:\n\n• Day 1: ER model and mapping to relational schema. Solve 3 ER diagram questions.\n• Day 2: Relational algebra. Practise selection, projection, joins and division.\n• Day 3: SQL. Write 15 queries covering joins, GROUP BY, subqueries.\n• Day 4: Normalization 1NF → BCNF. Decompose 4 relations.\n• Day 5: Full mock paper under timed conditions, then revise weak areas.\n\nTip: keep 30 minutes daily for revising formulas and definitions.",
  },
  {
    id: "p2",
    label: "Explain BCNF simply",
    category: "Study",
    prompt: "Explain BCNF with a simple example.",
    sampleAnswer:
      "BCNF (Boyce–Codd Normal Form) means: for every functional dependency X → Y, X must be a super key.\n\nExample: Teaching(Student, Course, Professor) where each professor teaches only one course (Professor → Course). Professor is not a super key, so the table violates BCNF.\n\nFix: split into Teaches(Professor, Course) and Enrolment(Student, Professor). Now every determinant is a key.",
  },
  {
    id: "p3",
    label: "Can I skip OS class?",
    category: "Planning",
    prompt: "How many Operating Systems classes can I still skip?",
    sampleAnswer:
      "With 29 of 38 classes attended (76.3%), you could skip 0 more classes and stay at 75%. Missing the next class would drop you to 74.4%.\n\nWhen connected, CampusPulse AI will read your live attendance. Meanwhile, the Attendance Tracker gives exact numbers for every subject.",
  },
  {
    id: "p4",
    label: "Summarise notices",
    category: "Campus",
    prompt: "Summarise this week's important college notices.",
    sampleAnswer:
      "This week's highlights:\n\n1. Mid-sem timetable released. Exams start next week, check your seat number.\n2. Infosys & TCS Digital placement drive. Register by Thursday, 5 PM.\n3. Attendance verification. Students below 75% may be debarred from end-sems.\n4. TechNova 2026 registrations are open.",
  },
  {
    id: "p5",
    label: "SGPA for 9.0 CGPA",
    category: "Planning",
    prompt: "What SGPA do I need in the remaining semesters to reach a 9.0 CGPA?",
    sampleAnswer:
      "Assuming a current CGPA of about 8.4 over 70 credits and 4 semesters of 20 credits left, you'd need an average SGPA of roughly 9.5 in each remaining semester.\n\nThe CGPA Calculator's target simulator does this calculation with your actual grades.",
  },
  {
    id: "p6",
    label: "Quiz me: CPU scheduling",
    category: "Study",
    prompt: "Quiz me with 3 questions on CPU scheduling.",
    sampleAnswer:
      "Sample quiz:\n\n1. Which algorithm gives the minimum average waiting time for a given set of processes?\n2. What problem does ageing solve in priority scheduling?\n3. In Round Robin, what happens if the time quantum is very large?\n\nAnswers: 1) SJF  2) Starvation  3) It behaves like FCFS.",
  },
];

export const NOT_CONNECTED_REPLY =
  "CampusPulse AI isn't connected to an AI service yet, so I can't answer custom questions. Try one of the sample prompts to see the kind of help this assistant will offer.";
