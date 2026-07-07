import { AttendanceHeader } from "./components/AttendanceHeader";
import { AttendanceKPIs } from "./components/AttendanceKPIs";
import { AttendanceFilter } from "./components/AttendanceFilter";
import { AttendanceTable } from "./components/AttendanceTable";
import { LiveAttendancePanel } from "./components/LiveAttendancePanel";
import { AttendanceDetailsDrawer } from "./components/AttendanceDetailsDrawer";
import { useAttendanceStore } from "./store/attendance.store";
import { AnimatePresence, motion } from "framer-motion";

export default function AttendancePage() {
  const store = useAttendanceStore();

  return (
    <div className="flex h-full bg-zinc-950 overflow-hidden relative">
      <div className="flex flex-col flex-1 min-w-0">
        <AttendanceHeader />
        <AttendanceKPIs />
        <AttendanceFilter />
        <AttendanceTable />
      </div>

      <AnimatePresence initial={false}>
        {store.isLivePanelOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
            className="flex-shrink-0"
          >
            <LiveAttendancePanel />
          </motion.div>
        )}
      </AnimatePresence>

      <AttendanceDetailsDrawer />
    </div>
  );
}
