import { LogIn, LogOut, Settings, Coffee } from "lucide-react";

// Mock Timeline Events for a specific worker
function getMockTimeline(_workerId: string) {
  return [
    { id: 1, time: "08:00 AM", type: "check_in", title: "Factory Check In", location: "Main Gate Terminal 1" },
    { id: 2, time: "08:15 AM", type: "machine_login", title: "Machine Login", location: "Juki-01 (MCH-102)" },
    { id: 3, time: "12:30 PM", type: "break_start", title: "Lunch Break Start", location: "Cafeteria Gate" },
    { id: 4, time: "01:15 PM", type: "break_end", title: "Lunch Break End", location: "Cafeteria Gate" },
    { id: 5, time: "05:00 PM", type: "machine_logout", title: "Machine Logout", location: "Juki-01 (MCH-102)" },
    { id: 6, time: "05:10 PM", type: "check_out", title: "Factory Check Out", location: "Main Gate Terminal 2" },
  ];
}

export function AttendanceTimeline({ workerId }: { workerId: string }) {
  const events = getMockTimeline(workerId);

  const getIcon = (type: string) => {
    switch (type) {
      case "check_in": return <LogIn className="w-4 h-4 text-emerald-400" />;
      case "check_out": return <LogOut className="w-4 h-4 text-amber-400" />;
      case "machine_login":
      case "machine_logout": return <Settings className="w-4 h-4 text-blue-400" />;
      case "break_start":
      case "break_end": return <Coffee className="w-4 h-4 text-purple-400" />;
      default: return <div className="w-2 h-2 rounded-full bg-white/40" />;
    }
  };

  return (
    <div className="relative pl-4 space-y-6">
      <div className="absolute top-2 bottom-2 left-[21px] w-0.5 bg-white/10" />
      {events.map((event) => (
        <div key={event.id} className="relative pl-10">
          <div className="absolute left-[-1px] top-0 w-8 h-8 rounded-full bg-zinc-950 border border-white/10 flex items-center justify-center z-10 shadow-md">
            {getIcon(event.type)}
          </div>
          <div className="bg-zinc-900/50 p-3 rounded-lg border border-white/5">
            <div className="flex justify-between items-start mb-1">
              <p className="text-sm font-bold text-white">{event.title}</p>
              <span className="text-[10px] text-white/40 font-mono bg-zinc-950 px-2 py-0.5 rounded border border-white/5">
                {event.time}
              </span>
            </div>
            <p className="text-xs text-white/50">{event.location}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
