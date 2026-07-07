import { motion } from "framer-motion";
import { Outlet } from "react-router-dom";
import { Sidebar, MobileSidebar } from "@/shared/components/Sidebar";
import { TopNavbar } from "@/shared/components/TopNavbar";
import { NotificationPanel } from "@/shared/components/NotificationPanel";
import { useSidebarStore } from "@/store/sidebar.store";
import { SIDEBAR_WIDTH, SIDEBAR_COLLAPSED_WIDTH, NAVBAR_HEIGHT } from "@/shared/utils/constants";

// Page transitions
const pageVariants = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
};

export function DashboardLayout() {
  const { isCollapsed } = useSidebarStore();
  const sidebarWidth = isCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH;

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Drawer */}
      <MobileSidebar />

      {/* Navbar */}
      <TopNavbar sidebarWidth={sidebarWidth} />

      {/* Notification Panel (portal-like, fixed) */}
      <NotificationPanel />

      {/* Main content area */}
      <motion.div
        animate={{ paddingLeft: sidebarWidth }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        className="flex flex-col min-h-screen"
        style={{ paddingTop: NAVBAR_HEIGHT }}
      >
        <motion.div
          key="page-content"
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="flex-1"
        >
          <Outlet />
        </motion.div>

        {/* Footer */}
        <footer className="border-t px-6 py-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>FactoryOS ERP Platform — v1.0.0</span>
          <span>© {new Date().getFullYear()} Smart Factory Systems</span>
        </footer>
      </motion.div>
    </div>
  );
}
