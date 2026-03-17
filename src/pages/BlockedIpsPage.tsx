import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { mockBlockedIps, type BlockedIp } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Globe, Plus, ShieldOff, ShieldCheck, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import StatCard from "@/components/StatCard";

export default function BlockedIpsPage() {
  const [ips, setIps] = useState<BlockedIp[]>(mockBlockedIps);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const blocked = ips.filter((ip) => ip.status === "blocked");
  const filtered = ips.filter((ip) => ip.ipAddress.includes(search) || ip.reason.toLowerCase().includes(search.toLowerCase()));

  const handleBlock = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setIps((prev) => [
      {
        id: `b${Date.now()}`,
        ipAddress: fd.get("ip") as string,
        reason: fd.get("reason") as string,
        status: "blocked",
        createdAt: new Date().toISOString(),
        attemptCount: 0,
      },
      ...prev,
    ]);
    setDialogOpen(false);
  };

  const toggleStatus = (id: string) => {
    setIps((prev) =>
      prev.map((ip) =>
        ip.id === id ? { ...ip, status: ip.status === "blocked" ? "active" : "blocked" } : ip
      )
    );
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Globe className="h-6 w-6 text-secondary" />
              <h1 className="text-2xl font-bold tracking-tight">IP Blocking Management</h1>
            </div>
            <p className="text-sm text-muted-foreground mt-1">Control which IP addresses can access the system.</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive"><Plus className="h-4 w-4 mr-1" /> Block IP</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Block IP Address</DialogTitle></DialogHeader>
              <form onSubmit={handleBlock} className="space-y-4 mt-2">
                <div>
                  <Label htmlFor="ip">IP Address</Label>
                  <Input id="ip" name="ip" placeholder="e.g. 192.168.1.100" required pattern="^[\d.]+$" />
                </div>
                <div>
                  <Label htmlFor="reason">Reason for Blocking</Label>
                  <Textarea id="reason" name="reason" placeholder="Describe why this IP is being blocked..." required />
                </div>
                <Button type="submit" variant="destructive" className="w-full">Block This IP</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard title="Total Blocked" value={blocked.length} icon={<ShieldOff className="h-4 w-4" />} className="border-destructive/20" />
          <StatCard title="Total Unblocked" value={ips.length - blocked.length} icon={<ShieldCheck className="h-4 w-4" />} />
          <StatCard title="Total Attempts Caught" value={ips.reduce((s, ip) => s + ip.attemptCount, 0)} icon={<Globe className="h-4 w-4" />} />
        </div>

        {/* How IP Blocking Works */}
        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <Globe className="h-4 w-4 text-secondary" /> How IP Blocking Works
          </h3>
          <div className="text-xs text-muted-foreground space-y-1 font-mono">
            <p>1. On every login → ipCheckMiddleware checks blocked_ips table</p>
            <p>2. If IP status = 'blocked' → ❌ "Access denied: IP blocked"</p>
            <p>3. AuthGuard auto-blocks IPs with repeated high-risk attempts</p>
            <p>4. Admin can manually block/unblock any IP address</p>
          </div>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search IP or reason..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>

        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">IP Address</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Reason</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Attempts</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Blocked At</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((ip) => (
                <tr key={ip.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors duration-100">
                  <td className="px-4 py-3 font-mono font-medium">{ip.ipAddress}</td>
                  <td className="px-4 py-3 text-muted-foreground max-w-xs truncate">{ip.reason}</td>
                  <td className="px-4 py-3 font-mono">{ip.attemptCount}</td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "text-xs font-semibold px-2 py-0.5 rounded",
                      ip.status === "blocked" ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"
                    )}>
                      {ip.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(ip.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <Button
                      size="sm"
                      variant={ip.status === "blocked" ? "outline" : "destructive"}
                      onClick={() => toggleStatus(ip.id)}
                      className="text-xs h-7"
                    >
                      {ip.status === "blocked" ? "Unblock" : "Block"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
