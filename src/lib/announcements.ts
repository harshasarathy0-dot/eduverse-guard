export interface Announcement {
  id: string;
  title: string;
  message: string;
  priority: "info" | "warning" | "urgent";
  createdBy: string;
  createdAt: string;
  expiresAt: string;
  roles: string[]; // which roles can see this
}

export const mockAnnouncements: Announcement[] = [
  {
    id: "ann1",
    title: "Mid-Semester Exams Scheduled",
    message: "Mid-semester examinations will begin from April 5th. Check your timetable for details.",
    priority: "urgent",
    createdBy: "Admin User",
    createdAt: "2026-03-20",
    expiresAt: "2026-04-10",
    roles: ["admin", "staff", "student", "parent"],
  },
  {
    id: "ann2",
    title: "Library Hours Extended",
    message: "Library will remain open until 10 PM during exam week. All students are welcome.",
    priority: "info",
    createdBy: "Admin User",
    createdAt: "2026-03-19",
    expiresAt: "2026-04-15",
    roles: ["student", "staff"],
  },
  {
    id: "ann3",
    title: "Fee Payment Deadline",
    message: "Last date for semester fee payment is March 31st. Late fee of ₹500 will be applied after deadline.",
    priority: "warning",
    createdBy: "Admin User",
    createdAt: "2026-03-18",
    expiresAt: "2026-04-01",
    roles: ["student", "parent"],
  },
];
