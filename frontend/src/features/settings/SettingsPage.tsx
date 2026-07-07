import { motion, AnimatePresence } from "framer-motion";
import { useSettingsStore } from "./store/settings.store";

import { SettingsHeader } from "./components/SettingsHeader";
import { SettingsSidebar } from "./components/SettingsSidebar";
import { SettingsActionFooter } from "./components/SettingsActionFooter";

import { GeneralSettingsTab } from "./components/tabs/GeneralSettingsTab";
import { FactorySettingsTab } from "./components/tabs/FactorySettingsTab";
import { DepartmentsSettingsTab } from "./components/tabs/DepartmentsSettingsTab";
import { ShiftsSettingsTab } from "./components/tabs/ShiftsSettingsTab";
import { NotificationSettingsTab } from "./components/tabs/NotificationSettingsTab";
import { SecuritySettingsTab } from "./components/tabs/SecuritySettingsTab";
import { AppearanceSettingsTab } from "./components/tabs/AppearanceSettingsTab";
import { BackupSettingsTab } from "./components/tabs/BackupSettingsTab";
import { IntegrationsTab } from "./components/tabs/IntegrationsTab";
import { AuditLogsTab } from "./components/tabs/AuditLogsTab";

export default function SettingsPage() {
  const store = useSettingsStore();

  return (
    <div className="h-full flex flex-col bg-zinc-950 overflow-hidden">
      <SettingsHeader />
      
      <div className="flex-1 flex overflow-hidden">
        <SettingsSidebar />
        
        <div className="flex-1 flex flex-col bg-zinc-950 overflow-hidden relative">
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={store.activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                {store.activeTab === "General" && <GeneralSettingsTab />}
                {store.activeTab === "Factory" && <FactorySettingsTab />}
                {store.activeTab === "Departments" && <DepartmentsSettingsTab />}
                {store.activeTab === "Shifts" && <ShiftsSettingsTab />}
                {store.activeTab === "Notifications" && <NotificationSettingsTab />}
                {store.activeTab === "Security" && <SecuritySettingsTab />}
                {store.activeTab === "Appearance" && <AppearanceSettingsTab />}
                {store.activeTab === "Backup" && <BackupSettingsTab />}
                {store.activeTab === "Integrations" && <IntegrationsTab />}
                {store.activeTab === "Audit Logs" && <AuditLogsTab />}
              </motion.div>
            </AnimatePresence>
          </div>
          
          <SettingsActionFooter />
        </div>
      </div>
    </div>
  );
}
