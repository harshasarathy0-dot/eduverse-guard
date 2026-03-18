import AppLayout from "@/components/AppLayout";
import { mockUserSessions } from "@/lib/mockActivity";
import { useState } from "react";
import { Monitor, Smartphone, MapPin, Wifi, WifiOff, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function SessionManagementPage() {
  const [sessions, setSessions] = useState(mockUserSessions);
  const { toast } = useToast();

  const activeSessions = sessions.filter((s) => s.active);

  const handleTerminate = (id: string) => {
    setSessions((prev) => prev.map((s) => s.id === id ? { ...s, active: false } : s));
    toast({ title: "Session terminated", description: "The session has been forcefully ended." });
  };

  const handleTerminateAll = (userId: string) => {
    setSessions((prev) => prev.map((s) => s.userId === userId ? { ...s, active: false } : s));
    toast({ title: "All sessions terminated", description: "All active sessions for this user have been ended." });
  };

  const uniqueUsers = [...new Set(sessions.map((s) => s.userId))];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Session Management</h1>
          <p className="text-sm text-muted-foreground mt-1">{activeSessions.length} active sessions across {uniqueUsers.length} users</p>
        </div>

        <div className="space-y-4">
          {uniqueUsers.map((uid) => {
            const userSessions = sessions.filter((s) => s.userId === uid);
            const userName = userSessions[0].userName;
            const activeCount = userSessions.filter((s) => s.active).length;

            return (
              <div key={uid} className="bg-card border rounded-lg overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-md bg-secondary/10 flex items-center justify-center text-secondary text-xs font-bold">{userName.charAt(0)}</div>
                    <div>
                      <span className="font-semibold text-sm">{userName}</span>
                      <span className="text-xs text-muted-foreground ml-2">{activeCount} active</span>
                    </div>
                  </div>
                  {activeCount > 0 && (
                    <button onClick={() => handleTerminateAll(uid)} className="text-xs font-medium text-destructive hover:text-destructive/80 flex items-center gap-1">
                      <LogOut className="h-3 w-3" /> Logout all
                    </button>
                  )}
                </div>
                <div className="divide-y divide-border">
                  {userSessions.map((s) => (
                    <div key={s.id} className="flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-3">
                        {s.device.includes("iPhone") || s.device.includes("Android") ? (
                          <Smartphone className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Monitor className="h-4 w-4 text-muted-foreground" />
                        )}
                        <div>
                          <div className="text-sm font-medium">{s.device}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2">
                            <span className="font-mono">{s.ip}</span>
                            <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3" />{s.location}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-xs text-muted-foreground">Last active</div>
                          <div className="text-xs font-mono">{new Date(s.lastActive).toLocaleString()}</div>
                        </div>
                        <div className={cn("flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded", s.active ? "bg-success/10 text-success" : "bg-muted text-muted-foreground")}>
                          {s.active ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                          {s.active ? "Active" : "Ended"}
                        </div>
                        {s.active && (
                          <button onClick={() => handleTerminate(s.id)} className="text-xs text-destructive hover:text-destructive/80 font-medium">Terminate</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
