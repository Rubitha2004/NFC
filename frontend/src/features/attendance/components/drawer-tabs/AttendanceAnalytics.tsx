import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const data = [
  { name: "Week 1", hours: 42, overtime: 2 },
  { name: "Week 2", hours: 45, overtime: 5 },
  { name: "Week 3", hours: 40, overtime: 0 },
  { name: "Week 4", hours: 48, overtime: 8 },
];

const trendData = [
  { date: "Jul 1", present: 1 },
  { date: "Jul 5", present: 1 },
  { date: "Jul 10", present: 0 }, // Absent
  { date: "Jul 15", present: 1 },
  { date: "Jul 20", present: 0.5 }, // Late
  { date: "Jul 25", present: 1 },
  { date: "Jul 30", present: 1 },
];

export function AttendanceAnalytics() {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-bold text-white mb-4">Working Hours (This Month)</h3>
        <div className="h-48 w-full bg-zinc-900/30 rounded-xl p-4 border border-white/5">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis dataKey="name" stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip 
                cursor={{ fill: '#ffffff05' }}
                contentStyle={{ backgroundColor: '#09090b', borderColor: '#ffffff10', borderRadius: '8px' }}
              />
              <Bar dataKey="hours" fill="#3b82f6" radius={[4, 4, 0, 0]} stackId="a" name="Regular Hours" />
              <Bar dataKey="overtime" fill="#f97316" radius={[4, 4, 0, 0]} stackId="a" name="Overtime" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-white mb-4">Attendance Trend</h3>
        <div className="h-48 w-full bg-zinc-900/30 rounded-xl p-4 border border-white/5">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis dataKey="date" stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} domain={[0, 1]} ticks={[0, 0.5, 1]} tickFormatter={v => v === 1 ? 'Present' : v === 0.5 ? 'Late' : 'Absent'} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#09090b', borderColor: '#ffffff10', borderRadius: '8px' }}
              />
              <Line type="monotone" dataKey="present" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
