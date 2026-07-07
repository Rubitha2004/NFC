import { X, FileText, BarChart3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useBundleTxnStore } from "../store/bundle-txn.store";
import { useBundleTxnRecords } from "../hooks/useBundleTxnData";
import { cn } from "@/lib/utils";

import { TxnHistory } from "./drawer-tabs/TxnHistory";
import { InteractiveTimeline } from "./drawer-tabs/InteractiveTimeline";
import { TxnStatusBadge } from "./BundleTxnUIHelpers";

const TABS = [
  { id: "history", label: "Txn Details", icon: FileText },
  { id: "timeline", label: "Timeline", icon: BarChart3 },
];

export function BundleTxnDetailsDrawer() {
  const store = useBundleTxnStore();
  const { transactions } = useBundleTxnRecords();
  
  const txn = transactions.find(t => t.id === store.selectedTxnId);

  return (
    <AnimatePresence>
      {store.isDrawerOpen && txn && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => store.setDrawerOpen(false)}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: "100%", boxShadow: "-20px 0 25px -5px rgba(0, 0, 0, 0)" }}
            animate={{ x: 0, boxShadow: "-20px 0 25px -5px rgba(0, 0, 0, 0.5)" }}
            exit={{ x: "100%", boxShadow: "-20px 0 25px -5px rgba(0, 0, 0, 0)" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-xl bg-zinc-950 border-l border-white/10 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-zinc-900/50">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-white">{txn.transactionId}</h2>
                  <TxnStatusBadge status={txn.status} />
                </div>
                <p className="text-sm text-white/50 mt-1">
                  Bundle: {txn.bundleNumber}
                </p>
              </div>
              <button
                onClick={() => store.setDrawerOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10 bg-zinc-900/30">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = store.drawerTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => store.setDrawerTab(tab.id)}
                    className={cn(
                      "flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors relative outline-none",
                      isActive ? "text-blue-400" : "text-white/50 hover:text-white/80 hover:bg-white/5"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeTab-txn"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                        initial={false}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-zinc-950">
              <AnimatePresence mode="wait">
                <motion.div
                  key={store.drawerTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {store.drawerTab === "history" && <TxnHistory txn={txn} />}
                  {store.drawerTab === "timeline" && <InteractiveTimeline txn={txn} />}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
