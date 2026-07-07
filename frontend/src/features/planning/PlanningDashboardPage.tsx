import { motion } from "framer-motion";
import {
  Package,
  Layers,
  Users,
  Cpu,
  Clock,
  CheckCircle,
  Activity
} from "lucide-react";
import { usePlanningDashboard } from "./hooks/usePlanning";
import type { PlanningDashboardMetrics } from "./types/planning.types";

export default function PlanningDashboardPage() {
  const { data: metrics, isLoading: loading } = usePlanningDashboard();

  if (loading || !metrics) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-zinc-950">
        <Activity className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-zinc-950 text-white overflow-y-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Planning Dashboard</h1>
          <p className="text-sm text-white/50 mt-1">Real-time overview of production planning</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Orders */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }} className="bg-zinc-900 border border-white/10 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-white/70">Production Orders</h3>
            <Package className="w-5 h-5 text-blue-500" />
          </div>
          <div className="flex items-baseline space-x-2 mb-2">
            <span className="text-3xl font-bold text-white">{metrics.orders.active}</span>
            <span className="text-sm font-medium text-white/40">Active</span>
          </div>
          <div className="flex items-center justify-between text-xs font-medium text-white/50 pt-2 border-t border-white/5">
            <span>Total: {metrics.orders.total}</span>
            <span className="text-emerald-500">Completed: {metrics.orders.completed}</span>
          </div>
        </motion.div>

        {/* Bundles */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-zinc-900 border border-white/10 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-white/70">Bundles in Progress</h3>
            <Layers className="w-5 h-5 text-purple-500" />
          </div>
          <div className="flex items-baseline space-x-2 mb-2">
            <span className="text-3xl font-bold text-white">{metrics.bundles.active}</span>
            <span className="text-sm font-medium text-white/40">Running</span>
          </div>
          <div className="flex items-center justify-between text-xs font-medium text-white/50 pt-2 border-t border-white/5">
            <span className="text-amber-500 flex items-center"><Clock className="w-3 h-3 mr-1" /> Waiting: {metrics.bundles.waiting}</span>
          </div>
        </motion.div>

        {/* Workers */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-zinc-900 border border-white/10 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-white/70">Worker Capacity</h3>
            <Users className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="flex items-baseline space-x-2 mb-2">
            <span className="text-3xl font-bold text-white">{metrics.workers.available}</span>
            <span className="text-sm font-medium text-white/40">Available</span>
          </div>
          <div className="flex items-center justify-between text-xs font-medium text-white/50 pt-2 border-t border-white/5">
            <span>Total: {metrics.workers.total}</span>
            <span className="text-amber-500">Busy: {metrics.workers.busy}</span>
          </div>
        </motion.div>

        {/* Machines */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-zinc-900 border border-white/10 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-white/70">Machine Occupancy</h3>
            <Cpu className="w-5 h-5 text-rose-500" />
          </div>
          <div className="flex items-baseline space-x-2 mb-2">
            <span className="text-3xl font-bold text-white">{metrics.machines.available}</span>
            <span className="text-sm font-medium text-white/40">Available</span>
          </div>
          <div className="flex items-center justify-between text-xs font-medium text-white/50 pt-2 border-t border-white/5">
            <span>Total: {metrics.machines.total}</span>
            <span className="text-amber-500">Busy: {metrics.machines.busy}</span>
          </div>
        </motion.div>
      </div>

      {/* Task Summary Banner */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-zinc-900/50 border border-emerald-500/20 rounded-xl p-6 flex items-center justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <CheckCircle className="w-48 h-48" />
        </div>
        <div className="relative z-10 flex items-center space-x-4">
          <div className="bg-emerald-500/20 p-3 rounded-full">
            <CheckCircle className="w-8 h-8 text-emerald-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Smart Planning Active</h2>
            <p className="text-sm text-white/60 mt-1">There are {metrics.tasks.pending} pending tasks waiting to be scheduled.</p>
          </div>
        </div>
        <div className="relative z-10 flex gap-4">
          <button className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm font-semibold transition-colors">
            View All Tasks
          </button>
          <button className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 shadow-lg shadow-emerald-500/20">
            <Activity className="w-4 h-4" />
            Auto Schedule All
          </button>
        </div>
      </motion.div>
    </div>
  );
}
