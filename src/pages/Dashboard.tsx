import {
  Users, GraduationCap, BookOpen, ShieldAlert, Activity, AlertTriangle, Globe, Calendar, FileText, DollarSign, Lock, Monitor, UserCheck, ClipboardList, TrendingUp, ShieldCheck, Heart, Bell, Zap, Settings, Megaphone, Target, BarChart2,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, LineChart, Line,
} from "recharts";
import StatCard from "@/components/StatCard";
import RiskBadge from "@/components/RiskBadge";
import {
  mockStudents, mockFaculty, mockCourses, mockAlerts, mockLoginLogs,
  mockBlockedIps, mockAssignments, mockAttendance, mockSessions, mockSubjects,
  loginActivityData, riskDistributionData, departmentEnrollmentData,
} from "@/lib/mockData";
import { mockFeePayments } from "@/lib/mockFees";
import { calculateTrustScore, getStudentHealth, generateSmartAlerts } from "@/lib/trustScore";
import { mockUserSessions, mockActivityLogs } from "@/lib/mockActivity";
import { mockAnnouncements } from "@/lib/announcements";
import AppLayout from "@/components/AppLayout";
import { useAuth } from "@/lib/authContext";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

// ── Announcements Banner ──
function AnnouncementsBanner({ role }: { role: string }) {
  const visible = mockAnnouncements.filter(a => a.roles.includes(role));
  if (visible.length === 0) return null;

  const priorityIcon = (p: string) => {
    if (p === "urgent") return <Zap className="h-4 w-4 text-destructive" />;
    if (p === "warning") return <AlertTriangle className="h-4 w-4 text-warning" />;
    return <Megaphone className="h-4 w-4 text-secondary" />;
  };
  const priorityBorder = (p: string) => {
    if (p === "urgent") return "border-destructive/30 bg-destructive/5";
    if (p === "warning") return "border-warning/30 bg-warning/5";
    return "border-secondary/30 bg-secondary/5";
  };

  return (
    <div className="space-y-2">
      {visible.slice(0, 2).map(a => (
        <div key={a.id} className={cn("rounded-xl p-4 flex items-start gap-3 border", priorityBorder(a.priority))}>
          {priorityIcon(a.priority)}
          <div>
            <div className="font-semibold text-sm">{a.title}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{a.message}</div>
            <div className="text-[10px] text-muted-foreground mt-1">Posted by {a.createdBy} · {a.createdAt}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Skill Radar (for Student) ──
const skillData = [
  { skill: "DSA", value: 85 },
  { skill: "DBMS", value: 72 },
  { skill: "OS", value: 68 },
  { skill: "Networks", value: 78 },
  { skill: "ML", value: 90 },
  { skill: "Web Dev", value: 82 },
];

// ── Progress Trend (for Student) ──
const progressData = [
  { month: "Oct", gpa: 3.4 },
  { month: "Nov", gpa: 3.5 },
  { month: "Dec", gpa: 3.55 },
  { month: "Jan", gpa: 3.6 },
  { month: "Feb", gpa: 3.65 },
  { month: "Mar", gpa: 3.7 },
];

// ── Class Performance (for Staff) ──
const classPerformanceData = [
  { subject: "Algorithm Design", avg: 76, highest: 95, lowest: 42 },
  { subject: "DS Implementation", avg: 72, highest: 90, lowest: 38 },
  { subject: "Neural Networks", avg: 81, highest: 98, lowest: 55 },
];

function AdminDashboard() {
  const unresolvedAlerts = mockAlerts.filter((a) => !a.resolved);
  const blockedCount = mockBlockedIps.filter((ip) => ip.status === "blocked").length;
  const totalFeesPending = mockFeePayments.reduce((s, p) => s + (p.amount - p.paidAmount), 0);
  const activeSessions = mockUserSessions.filter((s) => s.active).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Complete system overview with security monitoring.</p>
      </div>

      <AnnouncementsBanner role="admin" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 stagger-children">
        <StatCard title="Total Students" value={mockStudents.length} icon={<GraduationCap className="h-4 w-4" />} trend={{ value: "+12%", positive: true }} description="from last semester" />
        <StatCard title="Faculty Members" value={mockFaculty.length} icon={<Users className="h-4 w-4" />} description="across 5 departments" />
        <StatCard title="Active Courses" value={mockCourses.length} icon={<BookOpen className="h-4 w-4" />} trend={{ value: "+3", positive: true }} description="new this semester" />
        <StatCard title="Security Alerts" value={unresolvedAlerts.length} icon={<ShieldAlert className="h-4 w-4" />} trend={{ value: `${unresolvedAlerts.filter(a => a.severity === "high").length} critical`, positive: false }} className={unresolvedAlerts.some(a => a.severity === "high") ? "border-destructive/30" : ""} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5 stagger-children">
        <StatCard title="Blocked IPs" value={blockedCount} icon={<Globe className="h-4 w-4" />} className="border-destructive/20" description="actively blocked" />
        <StatCard title="Active Sessions" value={activeSessions} icon={<Monitor className="h-4 w-4" />} description="user sessions" />
        <StatCard title="Fees Pending" value={`₹${totalFeesPending.toLocaleString()}`} icon={<DollarSign className="h-4 w-4" />} className="border-warning/20" />
        <StatCard title="Open Assignments" value={mockAssignments.filter(a => a.status === "open").length} icon={<FileText className="h-4 w-4" />} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold text-sm">Login Activity (This Week)</h3>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={loginActivityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "6px", fontSize: 12 }} />
              <Area type="monotone" dataKey="logins" stroke="hsl(var(--secondary))" fill="hsl(var(--secondary) / 0.15)" strokeWidth={2} />
              <Area type="monotone" dataKey="failures" stroke="hsl(var(--destructive))" fill="hsl(var(--destructive) / 0.1)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold text-sm">Risk Distribution</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={riskDistributionData} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}>
                {riskDistributionData.map((entry, index) => (<Cell key={index} fill={entry.fill} />))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {riskDistributionData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.fill }} /><span className="text-muted-foreground">{d.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-card border border-border rounded-xl p-6 shadow-card">
          <h3 className="font-semibold text-sm mb-5">Department Enrollment</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={departmentEnrollmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="department" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "6px", fontSize: 12 }} />
              <Bar dataKey="students" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm">Recent Activity</h3>
            <Link to="/activity-logs" className="text-xs text-secondary hover:underline">View all</Link>
          </div>
          <div className="space-y-2 max-h-[220px] overflow-auto">
            {mockActivityLogs.slice(0, 6).map((log) => (
              <div key={log.id} className="flex items-center justify-between py-1.5 border-b border-border last:border-0 text-sm">
                <div className="min-w-0">
                  <span className="font-medium">{log.userName}</span>
                  <span className="text-muted-foreground text-xs ml-2">{log.action}</span>
                </div>
                <span className={cn("text-xs font-semibold px-2 py-0.5 rounded capitalize",
                  log.category === "auth" ? "bg-secondary/10 text-secondary" :
                  log.category === "admin" ? "bg-warning/10 text-warning" :
                  log.category === "fee" ? "bg-destructive/10 text-destructive" :
                  "bg-success/10 text-success"
                )}>{log.category}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Intelligence Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Link to="/trust-score" className="bg-card border border-border rounded-xl p-4 hover:border-secondary/40 hover:shadow-card-hover transition-all duration-200 flex items-center gap-3">
          <div className="h-10 w-10 rounded-md bg-secondary/10 flex items-center justify-center"><ShieldCheck className="h-5 w-5 text-secondary" /></div>
          <div><div className="text-sm font-semibold">Trust Scores</div><div className="text-xs text-muted-foreground">AI-computed</div></div>
        </Link>
        <Link to="/student-health" className="bg-card border border-border rounded-xl p-4 hover:border-secondary/40 hover:shadow-card-hover transition-all duration-200 flex items-center gap-3">
          <div className="h-10 w-10 rounded-md bg-success/10 flex items-center justify-center"><Heart className="h-5 w-5 text-success" /></div>
          <div><div className="text-sm font-semibold">Student Health</div><div className="text-xs text-muted-foreground">Combined status</div></div>
        </Link>
        <Link to="/smart-alerts" className="bg-card border border-border rounded-xl p-4 hover:border-secondary/40 hover:shadow-card-hover transition-all duration-200 flex items-center gap-3">
          <div className="h-10 w-10 rounded-md bg-warning/10 flex items-center justify-center"><Bell className="h-5 w-5 text-warning" /></div>
          <div><div className="text-sm font-semibold">Smart Alerts</div><div className="text-xs text-muted-foreground">{generateSmartAlerts().filter(a => !a.resolved).length} active</div></div>
        </Link>
        <Link to="/risk-timeline" className="bg-card border border-border rounded-xl p-4 hover:border-secondary/40 hover:shadow-card-hover transition-all duration-200 flex items-center gap-3">
          <div className="h-10 w-10 rounded-md bg-destructive/10 flex items-center justify-center"><Zap className="h-5 w-5 text-destructive" /></div>
          <div><div className="text-sm font-semibold">Risk Timeline</div><div className="text-xs text-muted-foreground">Security history</div></div>
        </Link>
        <Link to="/admin-control" className="bg-card border border-border rounded-xl p-4 hover:border-secondary/40 hover:shadow-card-hover transition-all duration-200 flex items-center gap-3">
          <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center"><Settings className="h-5 w-5 text-muted-foreground" /></div>
          <div><div className="text-sm font-semibold">Control Panel</div><div className="text-xs text-muted-foreground">System config</div></div>
        </Link>
      </div>
    </div>
  );
}

function StaffDashboard() {
  const myStudents = mockStudents.filter(s => s.department === "Computer Science" && s.status === "active");
  const myAssignments = mockAssignments.filter(a => a.faculty === "Dr. Sarah Chen");
  const mySubjects = mockSubjects.filter(s => s.faculty === "Dr. Sarah Chen");
  const todayAttendance = mockAttendance.filter(a => a.date === "2026-03-17" && a.markedBy === "Dr. Sarah Chen");
  const openAssignments = myAssignments.filter(a => a.status === "open");
  const totalSubmissions = myAssignments.reduce((s, a) => s + a.totalSubmissions, 0);
  const totalExpected = myAssignments.reduce((s, a) => s + a.totalStudents, 0);

  const studentIds = myStudents.map(s => s.id);
  const studentFees = mockFeePayments.filter(p => studentIds.includes(p.studentId));
  const pendingFees = studentFees.filter(p => p.status !== "paid");
  const overdueFees = studentFees.filter(p => p.status === "overdue");

  const lowAttStudents = myStudents.filter(s => {
    const records = mockAttendance.filter(a => a.studentId === s.id);
    if (records.length === 0) return false;
    const presentCount = records.filter(a => a.status === "present").length;
    return (presentCount / records.length) * 100 < 80;
  });

  const alerts: { type: string; message: string; severity: "warning" | "destructive" }[] = [];
  if (lowAttStudents.length > 0) alerts.push({ type: "Low Attendance", message: `${lowAttStudents.length} student(s) below 80%`, severity: "warning" });
  if (overdueFees.length > 0) alerts.push({ type: "Fee Overdue", message: `${overdueFees.length} overdue fee(s)`, severity: "destructive" });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Staff Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Your teaching overview, attendance, and assignments.</p>
      </div>

      <AnnouncementsBanner role="staff" />

      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((a, i) => (
            <div key={i} className={cn("rounded-lg p-4 flex items-center gap-3 border",
              a.severity === "destructive" ? "bg-destructive/5 border-destructive/20" : "bg-warning/5 border-warning/20"
            )}>
              <AlertTriangle className={cn("h-5 w-5 shrink-0", a.severity === "destructive" ? "text-destructive" : "text-warning")} />
              <div><span className="font-semibold text-sm">{a.type}: </span><span className="text-sm">{a.message}</span></div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 stagger-children">
        <StatCard title="My Students" value={myStudents.length} icon={<GraduationCap className="h-4 w-4" />} description="Computer Science" />
        <StatCard title="My Subjects" value={mySubjects.length} icon={<BookOpen className="h-4 w-4" />} description={mySubjects.map(s => s.code).join(", ")} />
        <StatCard title="Today's Attendance" value={todayAttendance.length} icon={<UserCheck className="h-4 w-4" />} description="records marked today" />
        <StatCard title="Open Assignments" value={openAssignments.length} icon={<FileText className="h-4 w-4" />} description={`${totalSubmissions}/${totalExpected} submissions`} />
        <StatCard title="Fee Alerts" value={pendingFees.length} icon={<DollarSign className="h-4 w-4" />} description="pending among students" className={overdueFees.length > 0 ? "border-destructive/30" : ""} />
      </div>

      {/* Class Performance Analytics */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-card">
        <div className="flex items-center gap-2 mb-4">
          <BarChart2 className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-semibold text-sm">Class Performance Analytics</h3>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={classPerformanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="subject" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
            <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "6px", fontSize: 12 }} />
            <Bar dataKey="avg" name="Average" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="highest" name="Highest" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="lowest" name="Lowest" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Student Remarks */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-card">
        <h3 className="font-semibold text-sm mb-4">Student Remarks</h3>
        <div className="space-y-3">
          {myStudents.slice(0, 4).map(s => {
            const att = mockAttendance.filter(a => a.studentId === s.id);
            const presentPct = att.length > 0 ? Math.round((att.filter(a => a.status === "present").length / att.length) * 100) : 0;
            const remark = presentPct >= 90 ? "Excellent participation" : presentPct >= 75 ? "Satisfactory" : "Needs improvement — low attendance";
            const remarkColor = presentPct >= 90 ? "text-success" : presentPct >= 75 ? "text-warning" : "text-destructive";
            return (
              <div key={s.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <div className="text-sm font-medium">{s.name}</div>
                  <div className="text-xs text-muted-foreground">{s.enrollmentNo} · GPA {s.gpa}</div>
                </div>
                <div className="text-right">
                  <div className={cn("text-xs font-semibold", remarkColor)}>{remark}</div>
                  <div className="text-[10px] text-muted-foreground">Attendance: {presentPct}%</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/attendance" className="bg-card border border-border rounded-xl p-4 hover:border-secondary/40 hover:shadow-card-hover transition-all duration-200 flex items-center gap-3">
          <div className="h-10 w-10 rounded-md bg-success/10 flex items-center justify-center"><UserCheck className="h-5 w-5 text-success" /></div>
          <div><div className="text-sm font-semibold">Mark Attendance</div><div className="text-xs text-muted-foreground">Daily class attendance</div></div>
        </Link>
        <Link to="/assignments" className="bg-card border border-border rounded-xl p-4 hover:border-secondary/40 hover:shadow-card-hover transition-all duration-200 flex items-center gap-3">
          <div className="h-10 w-10 rounded-md bg-secondary/10 flex items-center justify-center"><ClipboardList className="h-5 w-5 text-secondary" /></div>
          <div><div className="text-sm font-semibold">Assignments</div><div className="text-xs text-muted-foreground">Create & track</div></div>
        </Link>
        <Link to="/exam-results" className="bg-card border border-border rounded-xl p-4 hover:border-secondary/40 hover:shadow-card-hover transition-all duration-200 flex items-center gap-3">
          <div className="h-10 w-10 rounded-md bg-warning/10 flex items-center justify-center"><TrendingUp className="h-5 w-5 text-warning" /></div>
          <div><div className="text-sm font-semibold">Enter Marks</div><div className="text-xs text-muted-foreground">Exam & assignment</div></div>
        </Link>
        <Link to="/timetable" className="bg-card border border-border rounded-xl p-4 hover:border-secondary/40 hover:shadow-card-hover transition-all duration-200 flex items-center gap-3">
          <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center"><Calendar className="h-5 w-5 text-muted-foreground" /></div>
          <div><div className="text-sm font-semibold">My Timetable</div><div className="text-xs text-muted-foreground">Weekly schedule</div></div>
        </Link>
      </div>

      {/* Recent Assignments */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm">Recent Assignments</h3>
          <Link to="/assignments" className="text-xs text-secondary hover:underline">View all</Link>
        </div>
        <div className="space-y-3">
          {myAssignments.map(a => (
            <div key={a.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div>
                <div className="font-medium text-sm">{a.title}</div>
                <div className="text-xs text-muted-foreground">{a.subjectName} · Due {a.dueDate}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded uppercase",
                  a.status === "open" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                )}>{a.status}</span>
                <span className="text-xs font-mono text-muted-foreground">{a.totalSubmissions}/{a.totalStudents}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StudentDashboard() {
  const myAttendance = mockAttendance.filter(a => a.studentId === "s1");
  const present = myAttendance.filter(a => a.status === "present").length;
  const total = myAttendance.length;
  const myFees = mockFeePayments.filter(p => p.studentId === "s1");
  const pendingFees = myFees.filter(p => p.status !== "paid");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Student Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Your courses, attendance, and assignments.</p>
      </div>

      <AnnouncementsBanner role="student" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 stagger-children">
        <StatCard title="Enrolled Courses" value={2} icon={<BookOpen className="h-4 w-4" />} />
        <StatCard title="Attendance Rate" value={total > 0 ? `${Math.round((present / total) * 100)}%` : "N/A"} icon={<Users className="h-4 w-4" />} />
        <StatCard title="Open Assignments" value={mockAssignments.filter(a => a.status === "open").length} icon={<FileText className="h-4 w-4" />} />
        <StatCard title="Current GPA" value="3.70" icon={<GraduationCap className="h-4 w-4" />} />
        <StatCard title="Pending Fees" value={pendingFees.length} icon={<DollarSign className="h-4 w-4" />} className={pendingFees.length > 0 ? "border-warning/30" : ""} />
      </div>

      {/* Progress Tracker + Skill Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-card border border-border rounded-xl p-6 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold text-sm">GPA Progress Tracker</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis domain={[3, 4]} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "6px", fontSize: 12 }} />
              <Line type="monotone" dataKey="gpa" stroke="hsl(var(--secondary))" strokeWidth={2} dot={{ fill: "hsl(var(--secondary))", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold text-sm">Skill Tracker</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={skillData} cx="50%" cy="50%" outerRadius={70}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <PolarRadiusAxis tick={false} axisLine={false} domain={[0, 100]} />
              <Radar name="Skills" dataKey="value" stroke="hsl(var(--secondary))" fill="hsl(var(--secondary))" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-card border border-border rounded-xl p-6 shadow-card">
          <h3 className="font-semibold text-sm mb-4">Upcoming Assignments</h3>
          <div className="space-y-3">
            {mockAssignments.filter(a => a.status === "open").map(a => (
              <div key={a.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div><div className="font-medium text-sm">{a.title}</div><div className="text-xs text-muted-foreground">{a.subjectName}</div></div>
                <span className="text-xs font-semibold text-warning">Due {a.dueDate}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm">Fee Status</h3>
            <Link to="/fees" className="text-xs text-secondary hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {myFees.slice(0, 4).map(f => (
              <div key={f.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="text-sm font-medium">{f.feeName}</div>
                <span className={cn("text-xs font-semibold px-2 py-0.5 rounded",
                  f.status === "paid" ? "bg-success/10 text-success" :
                  f.status === "overdue" ? "bg-destructive/10 text-destructive" :
                  "bg-warning/10 text-warning"
                )}>{f.status} · ₹{(f.amount - f.paidAmount).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trust Score */}
      {(() => {
        const trust = calculateTrustScore("s1");
        const statusColor = trust.status === "Excellent" ? "text-success bg-success/10" : trust.status === "Good" ? "text-warning bg-warning/10" : "text-destructive bg-destructive/10";
        return (
          <div className="bg-card border border-border rounded-xl p-5 shadow-card">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-secondary" />
                <h3 className="font-semibold text-sm">Digital Trust Score</h3>
              </div>
              <Link to="/trust-score" className="text-xs text-secondary hover:underline">Details →</Link>
            </div>
            <div className="flex items-center gap-4">
              <div className={cn("text-3xl font-bold", trust.score >= 80 ? "text-success" : trust.score >= 60 ? "text-warning" : "text-destructive")}>{trust.score}</div>
              <span className={cn("text-xs font-semibold px-2 py-0.5 rounded", statusColor)}>{trust.status}</span>
            </div>
            {trust.recommendations.length > 0 && (
              <div className="mt-3 space-y-1">
                {trust.recommendations.slice(0, 2).map((r, i) => (
                  <div key={i} className="text-xs bg-muted/50 rounded-lg px-3 py-1.5">{r}</div>
                ))}
              </div>
            )}
          </div>
        );
      })()}

      <div className="bg-card border border-border rounded-xl p-5 flex items-center gap-4 shadow-card hover:shadow-card-hover transition-all duration-200">
        <Lock className="h-5 w-5 text-secondary" />
        <div className="flex-1">
          <div className="text-sm font-medium">Account Security</div>
          <div className="text-xs text-muted-foreground">Review your login history and manage active sessions</div>
        </div>
        <Link to="/my-security" className="text-xs font-medium text-secondary hover:underline">View →</Link>
      </div>
    </div>
  );
}

function ParentDashboard() {
  const childAttendance = mockAttendance.filter(a => a.studentId === "s1");
  const present = childAttendance.filter(a => a.status === "present").length;
  const total = childAttendance.length;
  const attendanceRate = total > 0 ? Math.round((present / total) * 100) : 0;
  const childFees = mockFeePayments.filter(p => p.studentId === "s1");
  const pendingFees = childFees.filter(p => p.status !== "paid");
  const totalDue = pendingFees.reduce((s, p) => s + (p.amount - p.paidAmount), 0);

  // Class average for comparison
  const classAvgGPA = mockStudents.filter(s => s.department === "Computer Science" && s.status === "active").reduce((s, st) => s + st.gpa, 0) / 2;
  const childGPA = 3.7;

  const alerts: { type: string; message: string; severity: "warning" | "destructive" }[] = [];
  if (attendanceRate < 80) alerts.push({ type: "Attendance", message: `Low attendance: ${attendanceRate}%`, severity: "warning" });
  if (pendingFees.some(f => f.status === "overdue")) alerts.push({ type: "Fee Due", message: `₹${totalDue.toLocaleString()} pending`, severity: "destructive" });

  // Weekly summary data
  const weekSummary = {
    classesAttended: 4,
    classesTotal: 5,
    assignmentsSubmitted: 2,
    assignmentsDue: 1,
    gpaChange: "+0.05",
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Parent Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Monitor your child's academic progress.</p>
      </div>

      <AnnouncementsBanner role="parent" />

      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((a, i) => (
            <div key={i} className={cn("rounded-lg p-4 flex items-center gap-3 border",
              a.severity === "destructive" ? "bg-destructive/5 border-destructive/20" : "bg-warning/5 border-warning/20"
            )}>
              <AlertTriangle className={cn("h-5 w-5 shrink-0", a.severity === "destructive" ? "text-destructive" : "text-warning")} />
              <div><span className="font-semibold text-sm">{a.type}: </span><span className="text-sm">{a.message}</span></div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 stagger-children">
        <StatCard title="Child" value="James Wilson" icon={<GraduationCap className="h-4 w-4" />} description="Computer Science, Sem 5" />
        <StatCard title="Attendance" value={`${attendanceRate}%`} icon={<Users className="h-4 w-4" />} className={attendanceRate < 80 ? "border-warning/30" : ""} description={`${present}/${total} present`} />
        <StatCard title="Current GPA" value="3.70" icon={<BookOpen className="h-4 w-4" />} />
        <StatCard title="Fees Due" value={`₹${totalDue.toLocaleString()}`} icon={<DollarSign className="h-4 w-4" />} className={totalDue > 0 ? "border-destructive/30" : ""} description={`${pendingFees.length} pending`} />
      </div>

      {/* Weekly Summary Report */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-card">
        <div className="flex items-center gap-2 mb-4">
          <Megaphone className="h-4 w-4 text-secondary" />
          <h3 className="font-semibold text-sm">Weekly Summary Report</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-success">{weekSummary.classesAttended}/{weekSummary.classesTotal}</div>
            <div className="text-xs text-muted-foreground mt-1">Classes Attended</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-secondary">{weekSummary.assignmentsSubmitted}</div>
            <div className="text-xs text-muted-foreground mt-1">Assignments Done</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-warning">{weekSummary.assignmentsDue}</div>
            <div className="text-xs text-muted-foreground mt-1">Pending Due</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-success">{weekSummary.gpaChange}</div>
            <div className="text-xs text-muted-foreground mt-1">GPA Change</div>
          </div>
        </div>
      </div>

      {/* Performance Comparison */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-card">
        <div className="flex items-center gap-2 mb-4">
          <BarChart2 className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-semibold text-sm">Performance Comparison (Child vs Class)</h3>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={[
            { metric: "GPA", child: childGPA, classAvg: Number(classAvgGPA.toFixed(2)) },
            { metric: "Attendance %", child: attendanceRate, classAvg: 82 },
            { metric: "Assignments %", child: 90, classAvg: 78 },
          ]}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="metric" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
            <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "6px", fontSize: 12 }} />
            <Bar dataKey="child" name="Your Child" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="classAvg" name="Class Average" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-card border border-border rounded-xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm">Recent Attendance</h3>
            <Link to="/attendance" className="text-xs text-secondary hover:underline">View all</Link>
          </div>
          <div className="space-y-2">
            {childAttendance.map(a => (
              <div key={a.id} className="flex items-center justify-between py-2 border-b border-border last:border-0 text-sm">
                <div><span className="font-medium">{a.subjectName}</span><span className="text-xs text-muted-foreground ml-2">{a.date}</span></div>
                <span className={cn("text-xs font-semibold px-2 py-0.5 rounded",
                  a.status === "present" ? "bg-success/10 text-success" :
                  a.status === "late" ? "bg-warning/10 text-warning" :
                  "bg-destructive/10 text-destructive"
                )}>{a.status}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm">Fee Status</h3>
            <Link to="/fees" className="text-xs text-secondary hover:underline">View all</Link>
          </div>
          <div className="space-y-2">
            {childFees.map(f => (
              <div key={f.id} className="flex items-center justify-between py-2 border-b border-border last:border-0 text-sm">
                <span className="font-medium">{f.feeName}</span>
                <span className={cn("text-xs font-semibold px-2 py-0.5 rounded",
                  f.status === "paid" ? "bg-success/10 text-success" :
                  f.status === "overdue" ? "bg-destructive/10 text-destructive" :
                  "bg-warning/10 text-warning"
                )}>{f.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Parent-Teacher Meeting Request */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-md bg-secondary/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <div className="text-sm font-semibold">Parent-Teacher Meeting</div>
              <div className="text-xs text-muted-foreground">Request a meeting with your child's faculty</div>
            </div>
          </div>
          <button className="px-4 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:opacity-90 transition-opacity">
            Request Meeting
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const content = (() => {
    switch (user?.role) {
      case "admin": return <AdminDashboard />;
      case "staff": return <StaffDashboard />;
      case "student": return <StudentDashboard />;
      case "parent": return <ParentDashboard />;
      default: return <AdminDashboard />;
    }
  })();
  return <AppLayout>{content}</AppLayout>;
}
