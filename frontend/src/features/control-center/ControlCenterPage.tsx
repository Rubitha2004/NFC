import { useState } from "react";
import { useControlCenterStore } from "./store/controlCenter.store";

// Components
import { ControlCenterKPIs } from "./components/ControlCenterKPIs";
import { PlanningQueuePanel } from "./components/GridPanels/PlanningQueuePanel";
import { LiveFactoryPanel } from "./components/GridPanels/LiveFactoryPanel";
import { AIRecommendationsPanel } from "./components/GridPanels/AIRecommendationsPanel";
import { LiveAlertsPanel } from "./components/GridPanels/LiveAlertsPanel";
import { ResourceAllocationPanel } from "./components/GridPanels/ResourceAllocationPanel";
import { ProductionTimelinePanel } from "./components/GridPanels/ProductionTimelinePanel";
import { ProductionHistoryPanel } from "./components/GridPanels/ProductionHistoryPanel";
import { ValidationReleaseModal } from "./components/Modals/ValidationReleaseModal";

export default function ControlCenterPage() {
  const { isValidationModalOpen, setValidationModalOpen } = useControlCenterStore();

  return (
    <div className="flex flex-col min-h-[calc(100vh-56px)] bg-zinc-950 text-white overflow-y-auto">
      <div className="p-6 md:p-8 max-w-[1600px] mx-auto w-full flex-1 flex flex-col gap-8">
        
        {/* ── Page Header ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Factory Control Center</h1>
            <p className="text-zinc-400">Real-time overview of factory operations and performance metrics.</p>
          </div>
        </div>

        {/* ── KPIs ── */}
        <ControlCenterKPIs />

        {/* ── Main Dashboard Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-min">
          
          {/* Top Row */}
          <div className="md:col-span-12 xl:col-span-3 flex flex-col min-h-[400px] bg-zinc-900/40 rounded-2xl border border-white/5 shadow-xl shadow-black/20 overflow-hidden backdrop-blur-sm">
            <PlanningQueuePanel />
          </div>
          
          <div className="md:col-span-12 xl:col-span-6 flex flex-col min-h-[400px] bg-zinc-900/40 rounded-2xl border border-white/5 shadow-xl shadow-black/20 overflow-hidden backdrop-blur-sm">
            <LiveFactoryPanel />
          </div>
          
          <div className="md:col-span-12 xl:col-span-3 flex flex-col gap-6 min-h-[400px]">
            <div className="flex-1 flex flex-col bg-zinc-900/40 rounded-2xl border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)] overflow-hidden backdrop-blur-sm">
              <AIRecommendationsPanel />
            </div>
            <div className="flex-1 flex flex-col bg-zinc-900/40 rounded-2xl border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.05)] overflow-hidden backdrop-blur-sm">
              <LiveAlertsPanel />
            </div>
          </div>

          {/* Mid Row */}
          <div className="md:col-span-12 xl:col-span-3 flex flex-col min-h-[350px] bg-zinc-900/40 rounded-2xl border border-white/5 shadow-xl shadow-black/20 overflow-hidden backdrop-blur-sm">
            <ResourceAllocationPanel />
          </div>
          
          <div className="md:col-span-12 xl:col-span-9 flex flex-col min-h-[350px] bg-zinc-900/40 rounded-2xl border border-white/5 shadow-xl shadow-black/20 overflow-hidden backdrop-blur-sm">
            <ProductionTimelinePanel />
          </div>

          {/* Bottom Row */}
          <div className="md:col-span-12 flex flex-col min-h-[350px] bg-zinc-900/40 rounded-2xl border border-white/5 shadow-xl shadow-black/20 overflow-hidden backdrop-blur-sm">
            <ProductionHistoryPanel />
          </div>

        </div>
      </div>

      {/* Modals */}
      <ValidationReleaseModal 
        isOpen={isValidationModalOpen} 
        onClose={() => setValidationModalOpen(false)} 
      />
    </div>
  );
}
