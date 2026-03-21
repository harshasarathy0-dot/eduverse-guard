import { BarChart3, PieChart as PieIcon } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import AppLayout from "@/components/AppLayout";
import { complaintAnalytics } from "@/lib/trustScore";

export default function ComplaintAnalyticsPage() {
  const { byCategory, byStatus, topIssues, trend } = complaintAnalytics;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-secondary" /> Complaint Analytics
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Data-driven insights from complaint patterns and trends.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="text-xs text-muted-foreground">Total Complaints</div>
            <div className="text-2xl font-bold mt-1">{byCategory.reduce((s, c) => s + c.count, 0)}</div>
          </div>
          <div className="bg-card border border-warning/20 rounded-xl p-4">
            <div className="text-xs text-muted-foreground">Pending</div>
            <div className="text-2xl font-bold text-warning mt-1">{byStatus.find(s => s.status === "Pending")?.count || 0}</div>
          </div>
          <div className="bg-card border border-success/20 rounded-xl p-4">
            <div className="text-xs text-muted-foreground">Resolved</div>
            <div className="text-2xl font-bold text-success mt-1">{byStatus.find(s => s.status === "Resolved")?.count || 0}</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="text-xs text-muted-foreground">Resolution Rate</div>
            <div className="text-2xl font-bold mt-1">
              {Math.round(((byStatus.find(s => s.status === "Resolved")?.count || 0) / byCategory.reduce((s, c) => s + c.count, 0)) * 100)}%
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-semibold text-sm mb-4">By Category</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={byCategory} dataKey="count" nameKey="category" cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={3}>
                  {byCategory.map((_, i) => <Cell key={i} fill={byCategory[i].fill} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "6px", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2 flex-wrap">
              {byCategory.map(c => (
                <div key={c.category} className="flex items-center gap-1.5 text-xs">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: c.fill }} />
                  <span className="text-muted-foreground">{c.category} ({c.count})</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-semibold text-sm mb-4">By Status</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={byStatus}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="status" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "6px", fontSize: 12 }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {byStatus.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-semibold text-sm mb-4">Complaint Trend (6 months)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "6px", fontSize: 12 }} />
                <Area type="monotone" dataKey="count" stroke="hsl(var(--secondary))" fill="hsl(var(--secondary) / 0.15)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-semibold text-sm mb-4">Top Issues</h3>
            <div className="space-y-3">
              {topIssues.map((issue, i) => (
                <div key={issue.issue} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-muted-foreground w-5">#{i + 1}</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{issue.issue}</span>
                      <span className="font-mono text-xs text-muted-foreground">{issue.count}</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-secondary rounded-full" style={{ width: `${(issue.count / topIssues[0].count) * 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
