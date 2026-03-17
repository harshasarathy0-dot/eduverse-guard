// Mock data for EduVerse application

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "faculty" | "student";
  status: "active" | "locked" | "suspended";
  failedAttempts: number;
  lastIp: string;
  lastLogin: string;
}

export interface LoginLog {
  id: string;
  userId: string;
  userName: string;
  ip: string;
  device: string;
  timestamp: string;
  riskScore: number;
  riskLevel: "low" | "medium" | "high";
  success: boolean;
}

export interface Alert {
  id: string;
  userId: string;
  userName: string;
  type: string;
  message: string;
  severity: "low" | "medium" | "high";
  timestamp: string;
  resolved: boolean;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  enrollmentNo: string;
  department: string;
  semester: number;
  gpa: number;
  status: "active" | "inactive";
}

export interface Faculty {
  id: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  courses: number;
  joinDate: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  department: string;
  credits: number;
  faculty: string;
  enrolled: number;
  capacity: number;
  semester: string;
}

export const mockUsers: User[] = [
  { id: "1", name: "Admin User", email: "admin@eduverse.com", role: "admin", status: "active", failedAttempts: 0, lastIp: "192.168.1.1", lastLogin: "2026-03-17T08:30:00Z" },
  { id: "2", name: "Dr. Sarah Chen", email: "sarah.chen@eduverse.com", role: "faculty", status: "active", failedAttempts: 0, lastIp: "192.168.1.45", lastLogin: "2026-03-17T09:15:00Z" },
  { id: "3", name: "James Wilson", email: "j.wilson@eduverse.com", role: "student", status: "active", failedAttempts: 3, lastIp: "10.0.0.55", lastLogin: "2026-03-16T23:45:00Z" },
  { id: "4", name: "Maria Garcia", email: "m.garcia@eduverse.com", role: "student", status: "locked", failedAttempts: 6, lastIp: "203.45.67.89", lastLogin: "2026-03-15T02:30:00Z" },
  { id: "5", name: "Prof. Alan Turing", email: "a.turing@eduverse.com", role: "faculty", status: "active", failedAttempts: 0, lastIp: "192.168.1.20", lastLogin: "2026-03-17T07:00:00Z" },
];

export const mockLoginLogs: LoginLog[] = [
  { id: "l1", userId: "3", userName: "James Wilson", ip: "10.0.0.55", device: "Chrome / Windows", timestamp: "2026-03-17T08:30:00Z", riskScore: 2, riskLevel: "low", success: true },
  { id: "l2", userId: "4", userName: "Maria Garcia", ip: "203.45.67.89", device: "Firefox / Linux", timestamp: "2026-03-15T02:30:00Z", riskScore: 9, riskLevel: "high", success: false },
  { id: "l3", userId: "4", userName: "Maria Garcia", ip: "45.67.89.12", device: "Unknown / Unknown", timestamp: "2026-03-15T02:25:00Z", riskScore: 11, riskLevel: "high", success: false },
  { id: "l4", userId: "3", userName: "James Wilson", ip: "172.16.0.99", device: "Safari / macOS", timestamp: "2026-03-16T23:45:00Z", riskScore: 5, riskLevel: "medium", success: true },
  { id: "l5", userId: "2", userName: "Dr. Sarah Chen", ip: "192.168.1.45", device: "Chrome / macOS", timestamp: "2026-03-17T09:15:00Z", riskScore: 0, riskLevel: "low", success: true },
  { id: "l6", userId: "1", userName: "Admin User", ip: "192.168.1.1", device: "Chrome / Windows", timestamp: "2026-03-17T08:30:00Z", riskScore: 0, riskLevel: "low", success: true },
  { id: "l7", userId: "4", userName: "Maria Garcia", ip: "203.45.67.89", device: "Firefox / Linux", timestamp: "2026-03-15T02:20:00Z", riskScore: 8, riskLevel: "high", success: false },
  { id: "l8", userId: "3", userName: "James Wilson", ip: "10.0.0.55", device: "Chrome / Windows", timestamp: "2026-03-16T14:00:00Z", riskScore: 1, riskLevel: "low", success: true },
];

export const mockAlerts: Alert[] = [
  { id: "a1", userId: "4", userName: "Maria Garcia", type: "ACCOUNT_LOCKED", message: "Account locked after 6 failed attempts from suspicious IP", severity: "high", timestamp: "2026-03-15T02:30:00Z", resolved: false },
  { id: "a2", userId: "3", userName: "James Wilson", type: "ODD_HOUR_LOGIN", message: "Login detected at unusual hour (23:45) from new device", severity: "medium", timestamp: "2026-03-16T23:45:00Z", resolved: false },
  { id: "a3", userId: "4", userName: "Maria Garcia", type: "NEW_IP_DETECTED", message: "Login attempt from previously unseen IP: 45.67.89.12", severity: "high", timestamp: "2026-03-15T02:25:00Z", resolved: false },
  { id: "a4", userId: "3", userName: "James Wilson", type: "MULTIPLE_FAILURES", message: "3 failed login attempts in 10 minutes", severity: "medium", timestamp: "2026-03-16T22:00:00Z", resolved: true },
];

export const mockStudents: Student[] = [
  { id: "s1", name: "James Wilson", email: "j.wilson@eduverse.com", enrollmentNo: "EDU2024001", department: "Computer Science", semester: 5, gpa: 3.7, status: "active" },
  { id: "s2", name: "Maria Garcia", email: "m.garcia@eduverse.com", enrollmentNo: "EDU2024002", department: "Mathematics", semester: 3, gpa: 3.9, status: "active" },
  { id: "s3", name: "Liam O'Brien", email: "l.obrien@eduverse.com", enrollmentNo: "EDU2024003", department: "Physics", semester: 7, gpa: 3.2, status: "active" },
  { id: "s4", name: "Aisha Patel", email: "a.patel@eduverse.com", enrollmentNo: "EDU2024004", department: "Computer Science", semester: 5, gpa: 3.85, status: "active" },
  { id: "s5", name: "Chen Wei", email: "c.wei@eduverse.com", enrollmentNo: "EDU2024005", department: "Engineering", semester: 1, gpa: 3.5, status: "inactive" },
  { id: "s6", name: "Sophie Laurent", email: "s.laurent@eduverse.com", enrollmentNo: "EDU2024006", department: "Biology", semester: 3, gpa: 3.6, status: "active" },
];

export const mockFaculty: Faculty[] = [
  { id: "f1", name: "Dr. Sarah Chen", email: "sarah.chen@eduverse.com", department: "Computer Science", designation: "Associate Professor", courses: 3, joinDate: "2019-08-15" },
  { id: "f2", name: "Prof. Alan Turing", email: "a.turing@eduverse.com", department: "Mathematics", designation: "Professor", courses: 2, joinDate: "2015-01-10" },
  { id: "f3", name: "Dr. Emily Watson", email: "e.watson@eduverse.com", department: "Physics", designation: "Assistant Professor", courses: 4, joinDate: "2021-06-01" },
  { id: "f4", name: "Prof. Raj Mehta", email: "r.mehta@eduverse.com", department: "Engineering", designation: "Professor", courses: 2, joinDate: "2017-03-20" },
  { id: "f5", name: "Dr. Lisa Park", email: "l.park@eduverse.com", department: "Biology", designation: "Associate Professor", courses: 3, joinDate: "2020-09-01" },
];

export const mockCourses: Course[] = [
  { id: "c1", code: "CS301", name: "Data Structures & Algorithms", department: "Computer Science", credits: 4, faculty: "Dr. Sarah Chen", enrolled: 45, capacity: 60, semester: "Fall 2026" },
  { id: "c2", code: "CS405", name: "Machine Learning", department: "Computer Science", credits: 3, faculty: "Dr. Sarah Chen", enrolled: 38, capacity: 40, semester: "Fall 2026" },
  { id: "c3", code: "MA201", name: "Linear Algebra", department: "Mathematics", credits: 3, faculty: "Prof. Alan Turing", enrolled: 55, capacity: 80, semester: "Fall 2026" },
  { id: "c4", code: "PH101", name: "Classical Mechanics", department: "Physics", credits: 4, faculty: "Dr. Emily Watson", enrolled: 60, capacity: 70, semester: "Fall 2026" },
  { id: "c5", code: "EN202", name: "Thermodynamics", department: "Engineering", credits: 3, faculty: "Prof. Raj Mehta", enrolled: 35, capacity: 50, semester: "Fall 2026" },
  { id: "c6", code: "BI301", name: "Molecular Biology", department: "Biology", credits: 4, faculty: "Dr. Lisa Park", enrolled: 28, capacity: 40, semester: "Fall 2026" },
];

// Dashboard chart data
export const loginActivityData = [
  { day: "Mon", logins: 124, failures: 8 },
  { day: "Tue", logins: 145, failures: 12 },
  { day: "Wed", logins: 132, failures: 5 },
  { day: "Thu", logins: 158, failures: 15 },
  { day: "Fri", logins: 141, failures: 7 },
  { day: "Sat", logins: 52, failures: 3 },
  { day: "Sun", logins: 38, failures: 2 },
];

export const riskDistributionData = [
  { name: "Low Risk", value: 78, fill: "hsl(160, 84%, 39%)" },
  { name: "Medium Risk", value: 16, fill: "hsl(38, 92%, 50%)" },
  { name: "High Risk", value: 6, fill: "hsl(0, 84%, 60%)" },
];

export const departmentEnrollmentData = [
  { department: "CS", students: 120 },
  { department: "Math", students: 85 },
  { department: "Physics", students: 70 },
  { department: "Engineering", students: 95 },
  { department: "Biology", students: 60 },
];
