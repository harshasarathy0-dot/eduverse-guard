import { Clock, Calendar } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { useAuth } from "@/lib/authContext";
import { cn } from "@/lib/utils";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const timetableData: Record<string, { time: string; subject: string; faculty: string; room: string }[]> = {
  Monday: [
    { time: "09:00 - 10:00", subject: "Algorithm Design", faculty: "Dr. Sarah Chen", room: "CS-201" },
    { time: "10:15 - 11:15", subject: "Matrix Theory", faculty: "Prof. Alan Turing", room: "MA-105" },
    { time: "14:00 - 15:30", subject: "Neural Networks", faculty: "Dr. Sarah Chen", room: "CS-Lab 3" },
  ],
  Tuesday: [
    { time: "09:00 - 10:00", subject: "Data Structure Implementation", faculty: "Dr. Sarah Chen", room: "CS-202" },
    { time: "11:00 - 12:00", subject: "Newtonian Mechanics", faculty: "Dr. Emily Watson", room: "PH-101" },
  ],
  Wednesday: [
    { time: "09:00 - 10:00", subject: "Algorithm Design", faculty: "Dr. Sarah Chen", room: "CS-201" },
    { time: "10:15 - 11:15", subject: "Matrix Theory", faculty: "Prof. Alan Turing", room: "MA-105" },
    { time: "14:00 - 16:00", subject: "ML Lab", faculty: "Dr. Sarah Chen", room: "CS-Lab 3" },
  ],
  Thursday: [
    { time: "09:00 - 10:00", subject: "Data Structure Implementation", faculty: "Dr. Sarah Chen", room: "CS-202" },
    { time: "11:00 - 12:00", subject: "Genetics", faculty: "Dr. Lisa Park", room: "BI-201" },
    { time: "14:00 - 15:00", subject: "Newtonian Mechanics", faculty: "Dr. Emily Watson", room: "PH-101" },
  ],
  Friday: [
    { time: "09:00 - 10:30", subject: "Algorithm Design", faculty: "Dr. Sarah Chen", room: "CS-201" },
    { time: "11:00 - 12:00", subject: "Matrix Theory", faculty: "Prof. Alan Turing", room: "MA-105" },
  ],
};

const colorMap: Record<string, string> = {
  "Algorithm Design": "bg-secondary/10 border-secondary/30",
  "Matrix Theory": "bg-warning/10 border-warning/30",
  "Neural Networks": "bg-accent/50 border-accent",
  "Data Structure Implementation": "bg-success/10 border-success/30",
  "Newtonian Mechanics": "bg-destructive/10 border-destructive/30",
  "ML Lab": "bg-accent/50 border-accent",
  "Genetics": "bg-primary/10 border-primary/30",
};

export default function TimetablePage() {
  const { user } = useAuth();

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Calendar className="h-6 w-6 text-secondary" /> Weekly Timetable
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {user?.role === "student" ? "Your class schedule for this week." : "Manage weekly class schedules."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {days.map((day) => (
            <div key={day} className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="bg-muted px-4 py-2.5 border-b border-border">
                <h3 className="font-semibold text-sm">{day}</h3>
              </div>
              <div className="p-3 space-y-2 min-h-[200px]">
                {(timetableData[day] || []).map((slot, i) => (
                  <div key={i} className={cn("rounded-md border p-2.5", colorMap[slot.subject] || "bg-muted border-border")}>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                      <Clock className="h-3 w-3" /> {slot.time}
                    </div>
                    <div className="font-semibold text-sm">{slot.subject}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{slot.faculty}</div>
                    <div className="text-xs text-muted-foreground">Room: {slot.room}</div>
                  </div>
                ))}
                {(!timetableData[day] || timetableData[day].length === 0) && (
                  <div className="text-xs text-muted-foreground text-center py-8">No classes</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
