import { useState } from "react";
import { Bell, X, Check, AlertTriangle, Info, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/authContext";
import { mockAnnouncements } from "@/lib/announcements";
import { generateSmartAlerts } from "@/lib/trustScore";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "alert";
  time: string;
  read: boolean;
}

function getNotifications(role: string): Notification[] {
  const items: Notification[] = [];

  // Add announcements visible to this role
  mockAnnouncements
    .filter(a => a.roles.includes(role))
    .forEach(a => {
      items.push({
        id: `ann-${a.id}`,
        title: a.title,
        message: a.message,
        type: a.priority === "urgent" ? "alert" : a.priority === "warning" ? "warning" : "info",
        time: a.createdAt,
        read: false,
      });
    });

  // Add smart alerts for admin
  if (role === "admin") {
    generateSmartAlerts().filter(a => !a.resolved).slice(0, 3).forEach(a => {
      items.push({
        id: `smart-${a.id}`,
        title: a.type.replace(/_/g, " "),
        message: a.message,
        type: a.priority === "high" ? "alert" : "warning",
        time: a.timestamp,
        read: false,
      });
    });
  }

  return items;
}

export default function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const notifications = getNotifications(user?.role || "student");
  const unreadCount = notifications.filter(n => !readIds.has(n.id)).length;

  const markRead = (id: string) => setReadIds(prev => new Set([...prev, id]));
  const markAllRead = () => setReadIds(new Set(notifications.map(n => n.id)));

  const typeIcon = (type: string) => {
    if (type === "alert") return <Zap className="h-4 w-4 text-destructive" />;
    if (type === "warning") return <AlertTriangle className="h-4 w-4 text-warning" />;
    return <Info className="h-4 w-4 text-secondary" />;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-2 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full h-4 min-w-4 px-1 flex items-center justify-center animate-pulse-alert">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-card border border-border rounded-xl shadow-2xl z-50 animate-fade-up overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h3 className="font-semibold text-sm">Notifications</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-xs text-secondary hover:underline flex items-center gap-1">
                    <Check className="h-3 w-3" /> Mark all read
                  </button>
                )}
                <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="max-h-[400px] overflow-auto divide-y divide-border">
              {notifications.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">No notifications</div>
              ) : (
                notifications.map(n => (
                  <button
                    key={n.id}
                    onClick={() => markRead(n.id)}
                    className={cn(
                      "w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors flex gap-3",
                      !readIds.has(n.id) && "bg-primary/5"
                    )}
                  >
                    <div className="pt-0.5 shrink-0">{typeIcon(n.type)}</div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium truncate">{n.title}</span>
                        {!readIds.has(n.id) && <span className="h-2 w-2 rounded-full bg-secondary shrink-0" />}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                      <span className="text-[10px] text-muted-foreground mt-1 block">{n.time}</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
