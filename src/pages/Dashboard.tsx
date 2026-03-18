import {
  Users, GraduationCap, BookOpen, ShieldAlert, Activity, AlertTriangle, Globe, Calendar, FileText, DollarSign, Lock, Monitor,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area,
} from "recharts";
import StatCard from "@/components/StatCard";
import RiskBadge from "@/components/RiskBadge";
import {
  mockStudents, mockFaculty, mockCourses, mockAlerts, mockLoginLogs,
  mockBlockedIps, mockAssignments, mockAttendance, mockSessions,
  loginActivityData, riskDistributionData, departmentEnrollmentData,
} from "@/lib/mockData";
import { mockFeePayments } from "@/lib/mockFees";
import { mockUserSessions, mockActivityLogs } from "@/lib/mockActivity";
import AppLayout from "@/components/AppLayout";
import { useAuth } from "@/lib/authContext";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

function AdminDashboard() {
  const unresolvedAlerts = mockAlerts.filter((a) => !a.resolved);
  const blockedCount = mockBlockedIps.filter((ip) => ip.status === "blocked").length;
  const totalFeesPending = mockFeePayments.reduce((s, p) => s + (p.amount - p.paidAmount), 0);
  const activeSessions = mockUserSessions.filter((s) => s.active).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Complete system overview with security monitoring.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Students" value={mockStudents.length} icon={<GraduationCap className="h-4 w-4" />} trend={{ value: "+12%", positive: true }} description="from last semester" />
        <StatCard title="Faculty Members" value={mockFaculty.length} icon={<Users className="h-4 w-4" />} description="across 5 departments" />
        <StatCard title="Active Courses" value={mockCourses.length} icon={<BookOpen className="h-4 w-4" />} trend={{ value: "+3", positive: true }} description="new this semester" />
        <StatCard title="Security Alerts" value={unresolvedAlerts.length} icon={<ShieldAlert className="h-4 w-4" />} trend={{ value: `${unresolvedAlerts.filter(a => a.severity === "high").length} critical`, positive: false }} className={unresolvedAlerts.some(a => a.severity === "high") ? "border-destructive/30" : ""} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard title="Blocked IPs" value={blockedCount} icon={<Globe className="h-4 w-4" />} className="border-destructive/20" description="actively blocked" />
        <StatCard title="Active Sessions" value={activeSessions} icon={<Monitor className="h-4 w-4" />} description="user sessions" />
        <StatCard title="Fees Pending" value={`₹${totalFeesPending.toLocaleString()}`} icon={<DollarSign className="h-4 w-4" />} className="border-warning/20" />
        <StatCard title="Open Assignments" value={mockAssignments.filter(a => a.status === "open").length} icon={<FileText className="h-4 w-4" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-5">
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

        <div className="bg-card border border-border rounded-lg p-5">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="font-semibold text-sm mb-4">Department Enrollment</h3>
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

        <div className="bg-card border border-border rounded-lg p-5">
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
    </div>
  );
}

function StaffDashboard() {
  const myStudents = mockStudents.filter(s => s.department === "Computer Science");
  const myAssignments = mockAssignments.filter(a => a.faculty === "Dr. Sarah Chen");
  const todayAttendance = mockAttendance.filter(a => a.date === "2026-03-17");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Staff Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Your teaching overview and assignments.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="My Students" value={myStudents.length} icon={<GraduationCap className="h-4 w-4" />} />
        <StatCard title="My Assignments" value={myAssignments.length} icon={<FileText className="h-4 w-4" />} />
        <StatCard title="Today's Attendance" value={todayAttendance.length} icon={<Users className="h-4 w-4" />} description="records marked" />
        <StatCard title="Courses Teaching" value={3} icon={<BookOpen className="h-4 w-4" />} />
      </div>
      <div className="bg-card border border-border rounded-lg p-5">
        <h3 className="font-semibold text-sm mb-4">Recent Assignments</h3>
        <div className="space-y-3">
          {myAssignments.map(a => (
            <div key={a.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div>
                <div className="font-medium text-sm">{a.title}</div>
                <div className="text-xs text-muted-foreground">{a.subjectName} · Due {a.dueDate}</div>
              </div>
              <span className="text-xs font-mono text-muted-foreground">{a.totalSubmissions}/{a.totalStudents} submitted</span>
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Student Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Your courses, attendance, and assignments.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Enrolled Courses" value={2} icon={<BookOpen className="h-4 w-4" />} />
        <StatCard title="Attendance Rate" value={total > 0 ? `${Math.round((present / total) * 100)}%` : "N/A"} icon={<Users className="h-4 w-4" />} />
        <StatCard title="Open Assignments" value={mockAssignments.filter(a => a.status === "open").length} icon={<FileText className="h-4 w-4" />} />
        <StatCard title="Current GPA" value="3.70" icon={<GraduationCap className="h-4 w-4" />} />
        <StatCard title="Pending Fees" value={pendingFees.length} icon={<DollarSign className="h-4 w-4" />} className={pendingFees.length > 0 ? "border-warning/30" : ""} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="font-semibold text-sm mb-4">Upcoming Assignments</h3>
          <div className="space-y-3">
            {mockAssignments.filter(a => a.status === "open").map(a => (
              <div key={a.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <div className="font-medium text-sm">{a.title}</div>
                  <div className="text-xs text-muted-foreground">{a.subjectName}</div>
                </div>
                <span className="text-xs font-semibold text-warning">Due {a.dueDate}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-5">
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

      <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-3">
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

  const alerts: { type: string; message: string; severity: "warning" | "destructive" | "info" }[] = [];
  if (attendanceRate < 80) alerts.push({ type: "Attendance", message: `Low attendance: ${attendanceRate}% (below 80% threshold)`, severity: "warning" });
  if (pendingFees.some(f => f.status === "overdue")) alerts.push({ type: "Fee Due", message: `Overdue fees: ₹${totalDue.toLocaleString()} pending`, severity: "destructive" });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Parent Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Monitor your child's academic progress.</p>
      </div>

      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((a, i) => (
            <div key={i} className={cn("rounded-lg p-4 flex items-center gap-3 border",
              a.severity === "destructive" ? "bg-destructive/5 border-destructive/20" : "bg-warning/5 border-warning/20"
            )}>
              <AlertTriangle className={cn("h-5 w-5 shrink-0", a.severity === "destructive" ? "text-destructive" : "text-warning")} />
              <div>
                <span className="font-semibold text-sm">{a.type}: </span>
                <span className="text-sm">{a.message}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Child" value="James Wilson" icon={<GraduationCap className="h-4 w-4" />} description="Computer Science, Sem 5" />
        <StatCard title="Attendance" value={`${attendanceRate}%`} icon={<Users className="h-4 w-4" />} className={attendanceRate < 80 ? "border-warning/30" : ""} description={`${present}/${total} present`} />
        <StatCard title="Current GPA" value="3.70" icon={<BookOpen className="h-4 w-4" />} />
        <StatCard title="Fees Due" value={`₹${totalDue.toLocaleString()}`} icon={<DollarSign className="h-4 w-4" />} className={totalDue > 0 ? "border-destructive/30" : ""} description={`${pendingFees.length} pending`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm">Recent Attendance</h3>
            <Link to="/attendance" className="text-xs text-secondary hover:underline">View all</Link>
          </div>
          <div className="space-y-2">
            {childAttendance.map(a => (
              <div key={a.id} className="flex items-center justify-between py-2 border-b border-border last:border-0 text-sm">
                <div>
                  <span className="font-medium">{a.subjectName}</span>
                  <span className="text-xs text-muted-foreground ml-2">{a.date}</span>
                </div>
                <span className={cn("text-xs font-semibold px-2 py-0.5 rounded",
                  a.status === "present" ? "bg-success/10 text-success" :
                  a.status === "late" ? "bg-warning/10 text-warning" :
                  "bg-destructive/10 text-destructive"
                )}>{a.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-5">
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
