import {
  Users,
  GraduationCap,
  BookOpen,
  ShieldAlert,
  Activity,
  AlertTriangle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import StatCard from "@/components/StatCard";
import RiskBadge from "@/components/RiskBadge";
import {
  mockStudents,
  mockFaculty,
  mockCourses,
  mockAlerts,
  mockLoginLogs,
  loginActivityData,
  riskDistributionData,
  departmentEnrollmentData,
} from "@/lib/mockData";
import AppLayout from "@/components/AppLayout";

export default function Dashboard() {
  const unresolvedAlerts = mockAlerts.filter((a) => !a.resolved);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Welcome back — here's your system overview.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Students"
            value={mockStudents.length}
            icon={<GraduationCap className="h-4 w-4" />}
            trend={{ value: "+12%", positive: true }}
            description="from last semester"
          />
          <StatCard
            title="Faculty Members"
            value={mockFaculty.length}
            icon={<Users className="h-4 w-4" />}
            description="across 5 departments"
          />
          <StatCard
            title="Active Courses"
            value={mockCourses.length}
            icon={<BookOpen className="h-4 w-4" />}
            trend={{ value: "+3", positive: true }}
            description="new this semester"
          />
          <StatCard
            title="Security Alerts"
            value={unresolvedAlerts.length}
            icon={<ShieldAlert className="h-4 w-4" />}
            trend={{ value: `${unresolvedAlerts.filter((a) => a.severity === "high").length} critical`, positive: false }}
            className={unresolvedAlerts.some((a) => a.severity === "high") ? "border-destructive/30" : ""}
          />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Login Activity */}
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
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                    fontSize: 12,
                  }}
                />
                <Area type="monotone" dataKey="logins" stroke="hsl(var(--secondary))" fill="hsl(var(--secondary) / 0.15)" strokeWidth={2} />
                <Area type="monotone" dataKey="failures" stroke="hsl(var(--destructive))" fill="hsl(var(--destructive) / 0.1)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Risk Distribution */}
          <div className="bg-card border border-border rounded-lg p-5">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm">Risk Distribution</h3>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={riskDistributionData} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}>
                  {riskDistributionData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2">
              {riskDistributionData.map((d) => (
                <div key={d.name} className="flex items-center gap-1.5 text-xs">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.fill }} />
                  <span className="text-muted-foreground">{d.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Department Enrollment + Recent Logs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-lg p-5">
            <h3 className="font-semibold text-sm mb-4">Department Enrollment</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={departmentEnrollmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="department" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="students" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card border border-border rounded-lg p-5">
            <h3 className="font-semibold text-sm mb-4">Recent Login Logs</h3>
            <div className="space-y-2 max-h-[220px] overflow-auto">
              {mockLoginLogs.slice(0, 6).map((log) => (
                <div key={log.id} className="flex items-center justify-between py-1.5 border-b border-border last:border-0 text-sm">
                  <div className="min-w-0">
                    <span className="font-medium">{log.userName}</span>
                    <span className="text-muted-foreground font-mono text-xs ml-2">{log.ip}</span>
                  </div>
                  <RiskBadge level={log.riskLevel} score={log.riskScore} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
