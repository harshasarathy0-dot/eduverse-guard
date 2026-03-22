import { Shield, Sun, Moon } from "lucide-react";
import { mockAlerts } from "@/lib/mockData";
import { useAuth } from "@/lib/authContext";
import { useTheme } from "@/lib/themeContext";
import GlobalSearch from "./GlobalSearch";
import NotificationCenter from "./NotificationCenter";

export default function SecurityHeader() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
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
        <GlobalSearch />

        <button
          onClick={toggleTheme}
          className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
        >
          {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </button>

        <NotificationCenter />

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
