import { Shield, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { mockAlerts } from "@/lib/mockData";
import { useAuth } from "@/lib/authContext";

export default function SecurityHeader() {
  const { user } = useAuth();
  const unresolvedAlerts = mockAlerts.filter((a) => !a.resolved);
  const highAlerts = unresolvedAlerts.filter((a) => a.severity === "high");
  const hasHighRisk = highAlerts.length > 0;
  const showSecurity = user?.role === "admin" || user?.role === "staff";

  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md flex items-center justify-between px-8 shrink-0">
      <div className="flex items-center gap-3">
        {showSecurity && (
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              hasHighRisk
                ? "bg-destructive/10 text-destructive animate-pulse-alert"
                : "bg-success/10 text-success"
            }`}
          >
            <Shield className="h-3.5 w-3.5" />
            {hasHighRisk ? `${highAlerts.length} High Risk Alert${highAlerts.length > 1 ? "s" : ""}` : "System Secure"}
          </div>
        )}
        {!showSecurity && (
          <span className="text-sm font-medium text-muted-foreground">EduVerse Portal</span>
        )}
      </div>

      <div className="flex items-center gap-4">
        {showSecurity && (
          <Link
            to="/security"
            className="relative flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            <Bell className="h-4 w-4" />
            <span>Alerts</span>
            {unresolvedAlerts.length > 0 && (
              <span className="absolute -top-1.5 -right-3 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full h-4 min-w-4 px-1 flex items-center justify-center animate-pulse-alert">
                {unresolvedAlerts.length}
              </span>
            )}
          </Link>
        )}
        {user && (
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-secondary to-accent flex items-center justify-center text-white text-xs font-bold shadow-sm">
              {user.avatar}
            </div>
            <div className="text-sm">
              <span className="font-medium">{user.name}</span>
              <span className="text-muted-foreground ml-1.5 capitalize text-xs">({user.role})</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
