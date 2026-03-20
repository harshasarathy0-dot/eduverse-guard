import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
  trend?: { value: string; positive: boolean };
  className?: string;
}

export default function StatCard({ title, value, icon, description, trend, className }: StatCardProps) {
  return (
    <div className={cn(
      "bg-card border border-border rounded-xl p-5 shadow-card transition-all duration-300 ease-out",
      "hover:shadow-card-hover hover:border-secondary/25 hover:-translate-y-0.5",
      "active:scale-[0.98]",
      className
    )}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        <span className="h-8 w-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">{icon}</span>
      </div>
      <div className="text-2xl font-bold tracking-tight">{value}</div>
      {(description || trend) && (
        <div className="mt-1.5 flex items-center gap-2 text-xs">
          {trend && (
            <span className={cn("font-semibold px-1.5 py-0.5 rounded-md", trend.positive ? "text-success bg-success/10" : "text-destructive bg-destructive/10")}>
              {trend.value}
            </span>
          )}
          {description && <span className="text-muted-foreground">{description}</span>}
        </div>
      )}
    </div>
  );
}
