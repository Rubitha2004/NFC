import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, GitBranch, ShieldCheck } from "lucide-react";
import { TagPoolTab } from "./components/TagPoolTab";
import { StageTrackingTab } from "./components/StageTrackingTab";
import { QCChecksTab } from "./components/QCChecksTab";

const TABS = [
  { id: "tags", label: "Tag Pool", icon: Tag, desc: "Manage the physical NFC tag pool" },
  { id: "stages", label: "Stage Tracking", icon: GitBranch, desc: "Log bundle stage transitions" },
  { id: "qc", label: "QC Checks", icon: ShieldCheck, desc: "Two-tier quality control log" },
] as const;

type TabId = typeof TABS[number]["id"];

export default function TagWorkflowPage() {
  const [activeTab, setActiveTab] = useState<TabId>("tags");

  return (
    <div className="h-full flex flex-col bg-zinc-950 overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-6 pt-6 pb-0 border-b border-white/[0.05]">
        <div className="mb-4">
          <h1 className="text-2xl font-black text-white tracking-tight">
            Tag &amp; QC Workflow
          </h1>
          <p className="text-sm text-white/40 mt-1">
            NFC tag lifecycle · Stage tracking · Two-tier quality control
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors rounded-t-lg outline-none ${
                  isActive
                    ? "text-white bg-zinc-900"
                    : "text-white/40 hover:text-white/70 hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {isActive && (
                  <motion.div
                    layoutId="tagWorkflowTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500"
                    initial={false}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="h-full"
          >
            {activeTab === "tags" && <TagPoolTab />}
            {activeTab === "stages" && <StageTrackingTab />}
            {activeTab === "qc" && <QCChecksTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
