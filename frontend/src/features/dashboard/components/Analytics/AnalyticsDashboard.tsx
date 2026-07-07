import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { useDashboardOverview } from '../../hooks/useDashboardQueries';

// Dummy data for charts
const productionData = [
  { time: '08:00', actual: 400, target: 500 },
  { time: '10:00', actual: 1200, target: 1000 },
  { time: '12:00', actual: 2100, target: 2000 },
  { time: '14:00', actual: 3500, target: 3000 },
  { time: '16:00', actual: 4800, target: 4500 },
  { time: '18:00', actual: 6100, target: 6000 },
];

const workerPerfData = [
  { name: 'Stitching', eff: 92 },
  { name: 'Finishing', eff: 88 },
  { name: 'Packing', eff: 95 },
  { name: 'QC', eff: 90 },
];

export function AnalyticsDashboard() {
  const { data } = useDashboardOverview();

  const qcPass = data?.qc?.pass || 0;
  const qcRework = data?.qc?.rework || 0;
  const qcReject = data?.qc?.reject || 0;
  const qcTotal = qcPass + qcRework + qcReject;
  const qcPassRate = qcTotal > 0 ? ((qcPass / qcTotal) * 100).toFixed(1) : '0.0';

  const utilizationData = [
    { name: 'Running', value: data?.machines?.running || 0, color: '#10b981' },
    { name: 'Idle', value: data?.machines?.idle || 0, color: '#f59e0b' },
    { name: 'Offline', value: data?.machines?.offline || 0, color: '#ef4444' },
  ];

  return (
    <div className="flex-1 overflow-auto bg-zinc-950 p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
        
        {/* Production Trend */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900/50 border border-white/10 p-5 rounded-2xl"
        >
          <h3 className="text-sm font-bold text-white/80 mb-4">Production Trend (Today)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={productionData}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="time" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#ffffff20', borderRadius: '8px' }}
                  itemStyle={{ fontSize: 12 }}
                />
                <Area type="monotone" dataKey="target" stroke="#ffffff30" strokeDasharray="5 5" fill="none" name="Target" />
                <Area type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorActual)" name="Actual" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Machine Utilization */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-zinc-900/50 border border-white/10 p-5 rounded-2xl flex flex-col"
        >
          <h3 className="text-sm font-bold text-white/80 mb-4">Machine Utilization</h3>
          <div className="h-64 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={utilizationData.filter(d => d.value > 0)}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {utilizationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#ffffff20', borderRadius: '8px' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Worker Performance */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-zinc-900/50 border border-white/10 p-5 rounded-2xl"
        >
          <h3 className="text-sm font-bold text-white/80 mb-4">Department Efficiency %</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workerPerfData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip
                  cursor={{ fill: '#ffffff05' }}
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#ffffff20', borderRadius: '8px' }}
                />
                <Bar dataKey="eff" name="Efficiency %" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* QC Pass Rate */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-zinc-900/50 border border-white/10 p-5 rounded-2xl flex items-center justify-center flex-col"
        >
          <h3 className="text-sm font-bold text-white/80 mb-6 w-full text-left">QC Quality Summary</h3>
          <div className="flex items-center justify-center gap-12 w-full flex-1">
            <div className="text-center">
              <div className="text-5xl font-black text-emerald-400 mb-2">{qcPassRate}%</div>
              <div className="text-xs text-white/40 uppercase tracking-wider">First Time Right</div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-sm text-white/70">Passed: {qcPass.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="text-sm text-white/70">Rework: {qcRework.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-sm text-white/70">Rejected: {qcReject.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
