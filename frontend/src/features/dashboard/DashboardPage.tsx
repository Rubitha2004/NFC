import { useState,  } from "react";
import { motion } from "framer-motion";
import {
  Users, Cpu, Package, Zap, AlertTriangle, ShieldCheck,
  ChevronDown, ChevronUp, Search, BarChart2, LayoutGrid, MonitorOff, RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";

// Hooks
import { useFactoryData } from "../factory/hooks/useFactoryData";
import { useSocketIntegration } from "./hooks/useSocketIntegration";
import { useSocketStore } from "@/store/useSocketStore";

// Components
import { KPICard } from "./components/KPICards/KPICard";
import { AlertsFeed } from "./components/Alerts/AlertsFeed";
import { ActivityTimeline } from "./components/Timeline/ActivityTimeline";
import { FactoryFloor } from "../factory/components/FactoryFloor";
import { AnalyticsDashboard } from "./components/Analytics/AnalyticsDashboard";
import { useDashboardOverview, useLiveFloor } from "./hooks/useDashboardQueries";
import type { AlertItem } from "./types/factory.types";

export default function DashboardPage() {
  useSocketIntegration(); // Mount socket listeners
  
  const { stats } = useFactoryData();
  const { alerts, timeline, status } = useSocketStore();
  const { isLoading: isOverviewLoading, isFetching: isOverviewFetching, isError: isOverviewError, error: overviewError, refetch: refetchOverview } = useDashboardOverview();
  const { isLoading: isFloorLoading, isFetching: isFloorFetching, isError: isFloorError, error: floorError, refetch: refetchFloor } = useLiveFloor();

  const [bottomCollapsed, setBottomCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'floor' | 'analytics'>('floor');
  const [searchQuery, setSearchQuery] = useState("");

  const handleAlertClick = (alert: AlertItem) => {
    console.log("Alert clicked:", alert);
  };

  const BOTTOM_H = bottomCollapsed ? 34 : 160;

  if (isOverviewLoading || isFloorLoading) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-zinc-950 text-emerald-500 flex-col gap-4">
        <RefreshCw className="w-8 h-8 animate-spin" />
        <p className="text-white/60 font-medium tracking-wide">Loading Smart Factory Data...</p>
      </div>
    );
  }

  const isRetrying = isOverviewFetching || isFloorFetching;

  if (isOverviewError || isFloorError) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-zinc-950 flex-col gap-4">
        <AlertTriangle className="w-12 h-12 text-red-500" />
        <h2 className="text-xl font-bold text-white">Connection Error</h2>
        <p className="text-white/60">Failed to communicate with Factory OS Backend.</p>
        <p className="text-red-400 font-mono text-xs max-w-lg text-center mt-2">
          Overview Error: {overviewError ? String(overviewError) : 'None'}<br/>
          Floor Error: {floorError ? String(floorError) : 'None'}
        </p>
        <button 
          onClick={() => { refetchOverview(); refetchFloor(); }} 
          disabled={isRetrying}
          className="px-4 py-2 mt-2 bg-emerald-600 hover:bg-emerald-500 rounded-md text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isRetrying && <RefreshCw className="w-4 h-4 animate-spin" />}
          {isRetrying ? 'Retrying...' : 'Retry Connection'}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-56px)] bg-zinc-950 text-white overflow-hidden">
      
      {/* ── Header: Global Search & Tabs ───────────────────────────────── */}
      <div className="flex-shrink-0 px-5 pt-3 pb-2 flex items-center justify-between border-b border-white/[0.05] bg-zinc-950/90 backdrop-blur-sm z-10">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold tracking-tight text-white leading-none">Factory Command Center</h1>
          <div className="h-4 w-px bg-white/20" />
          <div className="flex items-center bg-zinc-900 border border-white/10 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('floor')}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all",
                activeTab === 'floor' ? "bg-emerald-500/20 text-emerald-400" : "text-white/40 hover:text-white/80"
              )}
            >
              <LayoutGrid className="w-4 h-4" />
              Live Floor
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all",
                activeTab === 'analytics' ? "bg-blue-500/20 text-blue-400" : "text-white/40 hover:text-white/80"
              )}
            >
              <BarChart2 className="w-4 h-4" />
              Analytics
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-zinc-900 border border-white/10 rounded-full px-3 py-1 text-xs font-semibold mr-2">
            <span className={cn(
              "w-2 h-2 rounded-full",
              status === 'connected' ? "bg-emerald-500 animate-pulse" :
              status === 'reconnecting' ? "bg-amber-500 animate-pulse" :
              "bg-red-500"
            )} />
            <span className={cn(
              status === 'connected' ? "text-emerald-400" :
              status === 'reconnecting' ? "text-amber-400" :
              "text-red-400"
            )}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Machine, Worker, Bundle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-1.5 bg-zinc-900 border border-white/10 rounded-full text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 w-72 transition-all"
            />
          </div>
        </div>
      </div>

      {/* ── KPI Section ──────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-shrink-0 px-5 py-3 border-b border-white/[0.05] z-10 bg-zinc-950/80 backdrop-blur-sm"
      >
        <div className="grid grid-cols-4 xl:grid-cols-8 gap-3">
          <KPICard title="Workers Present"   value={stats.activeWorkers}                 icon={Users}        color="green"   trend={2.4}   delay={0.00} />
          <KPICard title="Workers Absent"    value={stats.absentWorkers}                 icon={Users}        color="rose"    trend={-1.2}  delay={0.02} />
          <KPICard title="Running Machines"  value={stats.byStatus.running}              icon={Cpu}          color="emerald" trend={5.1}   delay={0.04} />
          <KPICard title="Idle Machines"     value={stats.byStatus.idle}                 icon={AlertTriangle}color="amber"   trend={-2.0}  delay={0.06} />
          <KPICard title="Offline Machines"  value={stats.byStatus.offline}              icon={MonitorOff}   color="red"                   delay={0.08} />
          <KPICard title="Production Today"  value={stats.productionToday.toLocaleString()} icon={Package}   color="blue"    trend={4.5}   delay={0.10} subtitle="pcs" />
          <KPICard title="QC Pass Rate"      value={`${stats.qcPassRate}%`}              icon={ShieldCheck}  color="green"   trend={0.8}   delay={0.12} />
          <KPICard title="Efficiency"        value="92%"                                 icon={Zap}          color="cyan"    trend={3.2}   delay={0.14} />
        </div>
      </motion.div>

      {/* ── Main Flex Area ───────────────────────────────────────────── */}
      <div
        className="flex flex-1 min-h-0 bg-zinc-950"
        style={{ height: `calc(100% - 150px - ${BOTTOM_H}px)` }} // Adjust based on header+KPI height
      >
        {/* Alerts sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden xl:flex flex-col w-64 flex-shrink-0 border-r border-white/[0.05] bg-zinc-950 overflow-hidden"
        >
          {alerts.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center opacity-50">
              <ShieldCheck className="w-12 h-12 text-emerald-500 mb-3" />
              <p className="text-sm text-white">No active alerts.</p>
              <p className="text-xs text-white/50 mt-1">Everything is running smoothly.</p>
            </div>
          ) : (
            <AlertsFeed alerts={alerts} onAlertClick={handleAlertClick} />
          )}
        </motion.div>

        {/* Center Content */}
        <div className="flex-1 relative flex flex-col min-w-0 h-full overflow-hidden">
          {activeTab === 'floor' ? (
            <FactoryFloor />
          ) : (
            <AnalyticsDashboard />
          )}
        </div>
      </div>

      {/* ── Bottom Timeline ──────────────────────────────────────────── */}
      <div
        className="flex-shrink-0 border-t border-white/[0.05] bg-zinc-900/40 backdrop-blur-md flex flex-col transition-all duration-300"
        style={{ height: BOTTOM_H }}
      >
        <div className="flex items-center h-8 px-4 border-b border-white/[0.05] cursor-pointer" onClick={() => setBottomCollapsed(!bottomCollapsed)}>
          <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">Timeline Toggle</span>
          <button className="ml-auto text-white/40 hover:text-white transition-colors">
            {bottomCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
        {!bottomCollapsed && (
          <div className="flex-1 overflow-hidden">
            {timeline.length === 0 ? (
              <div className="flex items-center justify-center h-full opacity-50">
                <span className="text-sm text-white/50">Waiting for live events...</span>
              </div>
            ) : (
              <ActivityTimeline events={timeline} />
            )}
          </div>
        )}
      </div>
      
    </div>
  );
}
