import { 
  Terminal, 
  Wifi, 
  WifiOff, 
  Wrench, 
  HeartCrack, 
  Download 
} from "lucide-react";
import { useTerminals } from "../hooks/useTerminals";

import { KPICard } from "@/shared/components/ui/KPICard";

export function TerminalKPIs() {
  const { data: terminals = [], isLoading } = useTerminals();

  const kpis = {
    totalTerminals: terminals.length,
    online: terminals.filter(t => t.status === 'online').length,
    offline: terminals.filter(t => t.status === 'offline').length,
    maintenance: terminals.filter(t => t.status === 'maintenance').length,
    heartbeatLost: terminals.filter(t => t.status === 'heartbeat_lost').length,
    firmwareUpdates: 0, // Not available directly in the model
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6 opacity-50 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-5 h-[116px] animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      <KPICard 
        title="Total Terminals" 
        value={kpis.totalTerminals} 
        icon={Terminal} 
        colorClass="bg-blue-500/10 text-blue-500" 
        delay={0.0} 
      />
      <KPICard 
        title="Online" 
        value={kpis.online} 
        icon={Wifi} 
        colorClass="bg-emerald-500/10 text-emerald-500" 
        delay={0.05} 
      />
      <KPICard 
        title="Offline" 
        value={kpis.offline} 
        icon={WifiOff} 
        colorClass="bg-zinc-500/10 text-zinc-500" 
        delay={0.1} 
      />
      <KPICard 
        title="Maintenance" 
        value={kpis.maintenance} 
        icon={Wrench} 
        colorClass="bg-amber-500/10 text-amber-500" 
        delay={0.15} 
      />
      <KPICard 
        title="Heartbeat Lost" 
        value={kpis.heartbeatLost} 
        icon={HeartCrack} 
        colorClass="bg-red-500/10 text-red-500" 
        delay={0.2} 
      />
      <KPICard 
        title="Firmware Updates" 
        value={kpis.firmwareUpdates} 
        icon={Download} 
        colorClass="bg-indigo-500/10 text-indigo-500" 
        delay={0.25} 
      />
    </div>
  );
}
