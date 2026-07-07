import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Cpu, Wifi, QrCode, Printer, Database } from "lucide-react";

export function IntegrationsTab() {
  const INTEGRATIONS = [
    { id: "iot", label: "IoT Edge Gateway", desc: "Connects to physical factory sensors.", icon: Cpu, status: true },
    { id: "nfc", label: "NFC Reader Network", desc: "Worker badge and attendance terminals.", icon: Wifi, status: true },
    { id: "barcode", label: "Barcode Scanners", desc: "Zebra hardware integration for QC.", icon: QrCode, status: true },
    { id: "printer", label: "Thermal Printers", desc: "ZPL interface for bundle ticket printing.", icon: Printer, status: false },
    { id: "erp", label: "Legacy ERP Sync", desc: "Bi-directional sync with SAP ECC.", icon: Database, status: false },
  ];

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-xl font-bold text-white">Hardware Integrations & APIs</h2>
        <p className="text-sm text-white/50 mt-1">Manage connections to physical readers, sensors, and external systems.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {INTEGRATIONS.map((int) => {
          const Icon = int.icon;
          return (
            <div key={int.id} className="p-5 bg-zinc-900/50 rounded-xl border border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${int.status ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-800 text-zinc-400'}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    {int.label}
                    {int.status && <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-emerald-500/20 text-emerald-400">Connected</span>}
                  </h3>
                  <p className="text-xs text-white/40 mt-1">{int.desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 w-full md:w-auto mt-2 md:mt-0">
                <Button variant="outline" className="flex-1 md:flex-none border-white/10 text-white/80 hover:text-white bg-transparent hover:bg-white/5 h-9 text-xs">
                  Configure API
                </Button>
                <Switch defaultChecked={int.status} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
