import AppLayout from "@/components/AppLayout";
import { mockActivityLogs } from "@/lib/mockActivity";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

const categoryColors: Record<string, string> = {
  auth: "bg-secondary/10 text-secondary",
  academic: "bg-success/10 text-success",
  admin: "bg-warning/10 text-warning",
  fee: "bg-destructive/10 text-destructive",
};

export default function ActivityLogsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const filtered = mockActivityLogs
    .filter((l) => filter === "all" || l.category === filter)
    .filter((l) => l.userName.toLowerCase().includes(search.toLowerCase()) || l.action.toLowerCase().includes(search.toLowerCase()) || l.details.toLowerCase().includes(search.toLowerCase()));

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Activity Logs</h1>
          <p className="text-sm text-muted-foreground mt-1">Track all user actions across the system</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {["all", "auth", "academic", "admin", "fee"].map((cat) => (
            <button key={cat} onClick={() => setFilter(cat)} className={cn("px-3 py-1.5 text-xs font-medium rounded-md transition-colors capitalize", filter === cat ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80")}>{cat}</button>
          ))}
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search logs..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>

        <div className="bg-card border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border">
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Time</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">User</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Action</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Category</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Details</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">IP</th>
            </tr></thead>
            <tbody>
              {filtered.map((l) => (
                <tr key={l.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground whitespace-nowrap">{new Date(l.timestamp).toLocaleString()}</td>
                  <td className="px-4 py-3 font-medium">{l.userName}</td>
                  <td className="px-4 py-3 font-mono text-xs">{l.action}</td>
                  <td className="px-4 py-3"><span className={cn("text-xs font-semibold px-2 py-0.5 rounded capitalize", categoryColors[l.category])}>{l.category}</span></td>
                  <td className="px-4 py-3 text-muted-foreground max-w-[300px] truncate">{l.details}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{l.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
