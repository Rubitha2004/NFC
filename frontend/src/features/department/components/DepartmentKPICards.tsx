import { motion } from 'framer-motion';
import { useDepartments } from '../hooks/useDepartments';
import { 
  Building2, 
  CheckCircle2, 
  XCircle, 
  Users, 
  Cog, 
  Activity, 
  TrendingUp, 
  Loader2
} from 'lucide-react';

export function DepartmentKPICards() {
  const { departments, isLoading } = useDepartments();
  
  const totalDepartments = departments.length;
  const activeDepartments = departments.filter(d => d.status === 'active').length;
  const inactiveDepartments = departments.filter(d => d.status === 'inactive' || d.status === 'maintenance').length;
  const totalWorkers = departments.reduce((acc, curr) => acc + curr.workers, 0);
  const totalMachines = departments.reduce((acc, curr) => acc + curr.machines, 0);
  const totalLines = departments.reduce((acc, curr) => acc + curr.productionLines, 0);

  const kpis = [
    { title: 'Total Departments', value: isLoading ? '—' : totalDepartments, icon: Building2, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Active', value: isLoading ? '—' : activeDepartments, icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10' },
    { title: 'Inactive/Maint', value: isLoading ? '—' : inactiveDepartments, icon: XCircle, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { title: 'Total Workers', value: isLoading ? '—' : totalWorkers, icon: Users, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { title: 'Total Machines', value: isLoading ? '—' : totalMachines, icon: Cog, color: 'text-zinc-400', bg: 'bg-zinc-500/10' },
    { title: 'Prod. Lines', value: isLoading ? '—' : totalLines, icon: Activity, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
    { title: 'Avg Efficiency', value: '—', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { title: "Today's Prod", value: '—', icon: Building2, color: 'text-indigo-500', bg: 'bg-indigo-500/10' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4 mb-6">
      {kpis.map((kpi, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          whileHover={{ y: -5, scale: 1.02 }}
          className="bg-zinc-950 border border-white/10 rounded-xl p-4 flex flex-col justify-between hover:border-white/20 transition-colors shadow-lg"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-white/60 text-xs font-medium uppercase tracking-wider">{kpi.title}</h3>
            <div className={`p-1.5 rounded-lg ${kpi.bg}`}>
              {isLoading ? (
                <Loader2 className={`w-4 h-4 ${kpi.color} animate-spin`} />
              ) : (
                <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
              )}
            </div>
          </div>
          <div className="flex items-end gap-2 mt-2">
            <span className="text-2xl font-bold text-white tracking-tight">{kpi.value}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
