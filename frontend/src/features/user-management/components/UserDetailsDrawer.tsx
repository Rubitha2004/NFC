import { X, User, Shield, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserStore } from "../store/user.store";
import { useUserRecords } from "../hooks/useUserData";
import { cn } from "@/lib/utils";

import { UserProfileTab } from "./drawer-tabs/UserProfileTab";
import { UserPermissionsTab } from "./drawer-tabs/UserPermissionsTab";
import { UserActivityTab } from "./drawer-tabs/UserActivityTab";

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "permissions", label: "Permissions", icon: Shield },
  { id: "activity", label: "Activity Log", icon: Activity },
];

export function UserDetailsDrawer() {
  const store = useUserStore();
  const { users } = useUserRecords();
  
  const user = users.find(u => u.id === store.selectedUserId);

  return (
    <AnimatePresence>
      {store.isDrawerOpen && user && (
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
              <div className="flex items-center gap-3">
                <img src={user.profilePhoto} alt={user.fullName} className="w-10 h-10 rounded-full border border-white/20" />
                <div>
                  <h2 className="text-lg font-bold text-white">{user.fullName}</h2>
                  <p className="text-xs text-white/50">{user.employeeId}</p>
                </div>
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
                      "flex flex-1 justify-center items-center gap-2 px-4 py-4 text-sm font-medium transition-colors relative outline-none",
                      isActive ? "text-blue-400" : "text-white/50 hover:text-white/80 hover:bg-white/5"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeTab-user"
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
                  {store.drawerTab === "profile" && <UserProfileTab user={user} />}
                  {store.drawerTab === "permissions" && <UserPermissionsTab user={user} />}
                  {store.drawerTab === "activity" && <UserActivityTab user={user} />}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
