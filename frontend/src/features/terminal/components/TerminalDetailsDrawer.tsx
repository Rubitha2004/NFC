import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetDescription
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTerminalStore } from "../store/terminal.store";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { 
  TerminalSquare, 
  Network, 
  Activity, 
  HeartPulse, 
  AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";

import { useTerminal } from "../hooks/useTerminal";
import { Loader2 } from "lucide-react";

export function TerminalDetailsDrawer() {
  const { isDrawerOpen, setDrawerOpen, selectedTerminal, setSelectedTerminal } = useTerminalStore();
  const { data: terminal, isLoading } = useTerminal(selectedTerminal?.terminalId || null);

  const handleClose = () => {
    setDrawerOpen(false);
    setSelectedTerminal(null);
  };

  if (!isDrawerOpen) return null;

  if (isLoading || !terminal) {
    return (
      <Sheet open={isDrawerOpen} onOpenChange={handleClose}>
        <SheetContent className="w-[400px] sm:w-[540px] sm:max-w-none bg-zinc-950 border-zinc-800 text-white p-0 flex flex-col h-full overflow-hidden justify-center items-center">
           <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
           <p className="text-zinc-500 mt-4">Loading terminal details...</p>
        </SheetContent>
      </Sheet>
    );
  }

  const isOnline = terminal.status === "online";
  const isLost = terminal.status === "heartbeat_lost";

  return (
    <Sheet open={isDrawerOpen} onOpenChange={handleClose}>
      <SheetContent className="w-[400px] sm:w-[540px] sm:max-w-none bg-zinc-950 border-zinc-800 text-white p-0 flex flex-col h-full overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <SheetHeader>
            <div className="flex items-center justify-between">
              <SheetTitle className="text-2xl font-bold text-white flex items-center gap-3">
                <TerminalSquare className={cn(
                  "w-6 h-6",
                  isOnline ? "text-emerald-500" : isLost ? "text-red-500" : "text-amber-500"
                )} />
                {terminal.name}
              </SheetTitle>
              <Badge variant="outline" className={cn(
                "border bg-transparent",
                isOnline ? "text-emerald-500 border-emerald-500" :
                isLost ? "text-red-500 border-red-500" :
                "text-amber-500 border-amber-500"
              )}>
                {terminal.status.toUpperCase().replace("_", " ")}
              </Badge>
            </div>
            <SheetDescription className="text-zinc-400">
              {terminal.terminalId} • Assigned to {terminal.machine}
            </SheetDescription>
          </SheetHeader>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col">
          <Tabs defaultValue="overview" className="w-full h-full flex flex-col">
            <TabsList className="w-full justify-start rounded-none border-b border-white/10 bg-transparent px-6 py-0 h-12">
              <TabsTrigger value="overview" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 rounded-none h-full text-xs sm:text-sm">
                <TerminalSquare className="w-4 h-4 mr-2" /> Overview
              </TabsTrigger>
              <TabsTrigger value="network" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 rounded-none h-full text-xs sm:text-sm">
                <Network className="w-4 h-4 mr-2" /> Network
              </TabsTrigger>
              <TabsTrigger value="logs" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 rounded-none h-full text-xs sm:text-sm">
                <Activity className="w-4 h-4 mr-2" /> NFC Logs
              </TabsTrigger>
              <TabsTrigger value="heartbeat" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 rounded-none h-full text-xs sm:text-sm">
                <HeartPulse className="w-4 h-4 mr-2" /> Heartbeat
              </TabsTrigger>
              <TabsTrigger value="events" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 rounded-none h-full text-xs sm:text-sm">
                <AlertTriangle className="w-4 h-4 mr-2" /> Events
              </TabsTrigger>
            </TabsList>
            
            <div className="flex-1 overflow-y-auto p-6">
              <TabsContent value="overview" className="mt-0 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-zinc-900 p-4 rounded-lg border border-white/5">
                    <span className="text-xs text-zinc-500 block mb-1">Assigned Machine</span>
                    <span className="text-lg font-medium">{terminal.machine}</span>
                  </div>
                  <div className="bg-zinc-900 p-4 rounded-lg border border-white/5">
                    <span className="text-xs text-zinc-500 block mb-1">Department</span>
                    <span className="text-lg font-medium">{terminal.department}</span>
                  </div>
                  <div className="bg-zinc-900 p-4 rounded-lg border border-white/5">
                    <span className="text-xs text-zinc-500 block mb-1">Firmware Version</span>
                    <span className="text-lg font-medium">{terminal.firmwareVersion}</span>
                  </div>
                  <div className="bg-zinc-900 p-4 rounded-lg border border-white/5">
                    <span className="text-xs text-zinc-500 block mb-1">Last Heartbeat</span>
                    <span className="text-lg font-medium">
                      {terminal.lastHeartbeat ? formatDistanceToNow(new Date(terminal.lastHeartbeat), { addSuffix: true }) : 'Never'}
                    </span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="network" className="mt-0">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-zinc-900 p-4 rounded-lg border border-white/5">
                    <span className="text-xs text-zinc-500 block mb-1">IP Address</span>
                    <span className="text-lg font-medium font-mono text-emerald-400">{terminal.ipAddress}</span>
                  </div>
                  <div className="bg-zinc-900 p-4 rounded-lg border border-white/5">
                    <span className="text-xs text-zinc-500 block mb-1">MAC Address</span>
                    <span className="text-lg font-medium font-mono text-blue-400">{terminal.macAddress}</span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="logs" className="mt-0">
                <div className="text-center text-sm text-zinc-500 py-10">
                  Worker RFID card scan logs will appear here.
                </div>
              </TabsContent>

              <TabsContent value="heartbeat" className="mt-0 space-y-4">
                 <div className="text-center text-sm text-zinc-500 py-10">
                  Historical heartbeat metrics and latency charts will appear here.
                </div>
              </TabsContent>

              <TabsContent value="events" className="mt-0">
                <div className="text-center text-sm text-zinc-500 py-10">
                  Firmware updates, connection drops, and system events will be logged here.
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
