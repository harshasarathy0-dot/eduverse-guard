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
      "bg-card border border-border rounded-xl p-6 shadow-card transition-all duration-300 ease-out",
      "hover:shadow-card-hover hover:border-primary/25 hover:-translate-y-1",
      className
    )}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        <span className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">{icon}</span>
      </div>
      <div className="text-3xl font-bold tracking-tight">{value}</div>
      {(description || trend) && (
        <div className="mt-2 flex items-center gap-2 text-xs">
          {trend && (
            <span className={cn("font-semibold px-2 py-1 rounded-lg", trend.positive ? "text-success bg-success/10" : "text-destructive bg-destructive/10")}>
              {trend.value}
            </span>
          )}
          {description && <span className="text-muted-foreground">{description}</span>}
        </div>
      )}
    </div>
  );
}
