export interface UserSession {
  id: string;
  userId: string;
  userName: string;
  device: string;
  ip: string;
  location: string;
  loginTime: string;
  lastActive: string;
  active: boolean;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  category: "auth" | "academic" | "admin" | "fee";
  details: string;
  timestamp: string;
  ip: string;
}

export const mockUserSessions: UserSession[] = [
  { id: "sess1", userId: "u1", userName: "Admin User", device: "Chrome / Windows 11", ip: "192.168.1.1", location: "New York, US", loginTime: "2026-03-17T08:30:00Z", lastActive: "2026-03-17T11:45:00Z", active: true },
  { id: "sess2", userId: "u1", userName: "Admin User", device: "Safari / iPhone 15", ip: "10.0.0.12", location: "New York, US", loginTime: "2026-03-17T09:00:00Z", lastActive: "2026-03-17T09:30:00Z", active: true },
  { id: "sess3", userId: "u2", userName: "Dr. Sarah Chen", device: "Chrome / macOS", ip: "192.168.1.45", location: "Boston, US", loginTime: "2026-03-17T09:15:00Z", lastActive: "2026-03-17T11:40:00Z", active: true },
  { id: "sess4", userId: "u3", userName: "James Wilson", device: "Chrome / Windows", ip: "10.0.0.55", location: "Chicago, US", loginTime: "2026-03-17T08:30:00Z", lastActive: "2026-03-17T10:00:00Z", active: true },
  { id: "sess5", userId: "u3", userName: "James Wilson", device: "Firefox / Ubuntu", ip: "172.16.0.99", location: "Unknown", loginTime: "2026-03-16T23:45:00Z", lastActive: "2026-03-17T00:15:00Z", active: false },
  { id: "sess6", userId: "u4", userName: "Robert Wilson", device: "Chrome / Android", ip: "192.168.2.10", location: "Chicago, US", loginTime: "2026-03-17T10:00:00Z", lastActive: "2026-03-17T10:30:00Z", active: true },
];

export const mockActivityLogs: ActivityLog[] = [
  { id: "act1", userId: "u1", userName: "Admin User", action: "LOGIN", category: "auth", details: "Successful login from 192.168.1.1", timestamp: "2026-03-17T08:30:00Z", ip: "192.168.1.1" },
  { id: "act2", userId: "u1", userName: "Admin User", action: "BLOCK_IP", category: "admin", details: "Blocked IP 203.45.67.89 - repeated attacks", timestamp: "2026-03-17T08:35:00Z", ip: "192.168.1.1" },
  { id: "act3", userId: "u2", userName: "Dr. Sarah Chen", action: "MARK_ATTENDANCE", category: "academic", details: "Marked attendance for CS301-A (45 students)", timestamp: "2026-03-17T09:20:00Z", ip: "192.168.1.45" },
  { id: "act4", userId: "u2", userName: "Dr. Sarah Chen", action: "CREATE_ASSIGNMENT", category: "academic", details: "Created 'Binary Tree Implementation' for CS301-B", timestamp: "2026-03-17T09:45:00Z", ip: "192.168.1.45" },
  { id: "act5", userId: "u3", userName: "James Wilson", action: "LOGIN", category: "auth", details: "Login from new device Firefox/Ubuntu", timestamp: "2026-03-16T23:45:00Z", ip: "172.16.0.99" },
  { id: "act6", userId: "u3", userName: "James Wilson", action: "SUBMIT_ASSIGNMENT", category: "academic", details: "Submitted 'Binary Tree Implementation'", timestamp: "2026-03-17T08:50:00Z", ip: "10.0.0.55" },
  { id: "act7", userId: "u1", userName: "Admin User", action: "UPDATE_FEE", category: "fee", details: "Recorded payment TXN20260310001 for James Wilson", timestamp: "2026-03-17T09:00:00Z", ip: "192.168.1.1" },
  { id: "act8", userId: "u4", userName: "Robert Wilson", action: "LOGIN", category: "auth", details: "Successful login from mobile device", timestamp: "2026-03-17T10:00:00Z", ip: "192.168.2.10" },
  { id: "act9", userId: "u4", userName: "Robert Wilson", action: "VIEW_ATTENDANCE", category: "academic", details: "Viewed attendance report for James Wilson", timestamp: "2026-03-17T10:05:00Z", ip: "192.168.2.10" },
  { id: "act10", userId: "u1", userName: "Admin User", action: "UNLOCK_ACCOUNT", category: "admin", details: "Unlocked account for Maria Garcia", timestamp: "2026-03-17T10:15:00Z", ip: "192.168.1.1" },
  { id: "act11", userId: "u2", userName: "Dr. Sarah Chen", action: "GRADE_ASSIGNMENT", category: "academic", details: "Graded 'Matrix Decomposition' submissions", timestamp: "2026-03-17T10:30:00Z", ip: "192.168.1.45" },
  { id: "act12", userId: "u3", userName: "James Wilson", action: "PAY_FEE", category: "fee", details: "Partial payment of ₹2,500 for Exam Fee", timestamp: "2026-03-10T14:00:00Z", ip: "10.0.0.55" },
];
