import { cn } from "@/lib/utils";

interface RiskBadgeProps {
  level: "low" | "medium" | "high";
  score?: number;
}

export default function RiskBadge({ level, score }: RiskBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold font-mono",
        level === "low" && "bg-success/10 text-success",
        level === "medium" && "bg-warning/10 text-warning",
        level === "high" && "bg-destructive/10 text-destructive animate-pulse-alert"
      )}
    >
      {level.toUpperCase()}
      {score !== undefined && <span className="opacity-70">({score})</span>}
    </span>
  );
}
