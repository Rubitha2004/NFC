import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetDescription
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMachineTypeStore } from "../store/machineType.store";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, 
  Settings, 
  Users, 
  Wrench, 
  LineChart 
} from "lucide-react";

import { useMachineType } from "../hooks/useMachineType";
import { Loader2 } from "lucide-react";

export function MachineTypeDetailsDrawer() {
  const { isDrawerOpen, setDrawerOpen, selectedMachineType, setSelectedMachineType } = useMachineTypeStore();
  const { data: machineType, isLoading } = useMachineType(selectedMachineType?.id || null);

  const handleClose = () => {
    setDrawerOpen(false);
    setSelectedMachineType(null);
  };

  if (!isDrawerOpen) return null;

  if (isLoading || !machineType) {
    return (
      <Sheet open={isDrawerOpen} onOpenChange={handleClose}>
        <SheetContent className="w-[400px] sm:w-[540px] sm:max-w-none bg-zinc-950 border-zinc-800 text-white p-0 flex flex-col h-full overflow-hidden justify-center items-center">
           <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
           <p className="text-zinc-500 mt-4">Loading machine type details...</p>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={isDrawerOpen} onOpenChange={handleClose}>
      <SheetContent className="w-[400px] sm:w-[540px] sm:max-w-none bg-zinc-950 border-zinc-800 text-white p-0 flex flex-col h-full overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <SheetHeader>
            <div className="flex items-center justify-between">
              <SheetTitle className="text-2xl font-bold text-white">
                {machineType.typeName}
              </SheetTitle>
              <Badge variant={machineType.status === "active" ? "default" : "secondary"}>
                {machineType.status.toUpperCase()}
              </Badge>
            </div>
            <SheetDescription className="text-zinc-400">
              {machineType.typeCode} • {machineType.manufacturer}
            </SheetDescription>
          </SheetHeader>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col">
          <Tabs defaultValue="overview" className="w-full h-full flex flex-col">
            <TabsList className="w-full justify-start rounded-none border-b border-white/10 bg-transparent px-6 py-0 h-12">
              <TabsTrigger value="overview" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 rounded-none h-full">
                <Activity className="w-4 h-4 mr-2" /> Overview
              </TabsTrigger>
              <TabsTrigger value="operations" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 rounded-none h-full">
                <Settings className="w-4 h-4 mr-2" /> Operations
              </TabsTrigger>
              <TabsTrigger value="workers" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 rounded-none h-full">
                <Users className="w-4 h-4 mr-2" /> Workers
              </TabsTrigger>
              <TabsTrigger value="maintenance" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 rounded-none h-full">
                <Wrench className="w-4 h-4 mr-2" /> Maintenance
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 rounded-none h-full">
                <LineChart className="w-4 h-4 mr-2" /> Analytics
              </TabsTrigger>
            </TabsList>
            
            <div className="flex-1 overflow-y-auto p-6">
              <TabsContent value="overview" className="mt-0 space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-zinc-500 mb-2">Description</h4>
                  <p className="text-sm">{machineType.description || "No description provided."}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-zinc-900 p-4 rounded-lg border border-white/5">
                    <span className="text-xs text-zinc-500 block mb-1">Capacity</span>
                    <span className="text-lg font-medium">{machineType.capacity} units</span>
                  </div>
                  <div className="bg-zinc-900 p-4 rounded-lg border border-white/5">
                    <span className="text-xs text-zinc-500 block mb-1">Power Rating</span>
                    <span className="text-lg font-medium">{machineType.powerRating}</span>
                  </div>
                  <div className="bg-zinc-900 p-4 rounded-lg border border-white/5">
                    <span className="text-xs text-zinc-500 block mb-1">Speed</span>
                    <span className="text-lg font-medium">{machineType.speed}</span>
                  </div>
                  <div className="bg-zinc-900 p-4 rounded-lg border border-white/5">
                    <span className="text-xs text-zinc-500 block mb-1">Total Machines</span>
                    <span className="text-lg font-medium">{machineType.totalMachines}</span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="operations" className="mt-0">
                <h4 className="text-sm font-medium text-zinc-500 mb-4">Supported Operations</h4>
                <div className="flex flex-wrap gap-2">
                  {machineType.supportedOperations.map((op, idx) => (
                    <Badge key={idx} variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                      {op}
                    </Badge>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="workers" className="mt-0">
                <div className="text-center text-sm text-zinc-500 py-10">
                  Worker qualifications module integration required.
                </div>
              </TabsContent>

              <TabsContent value="maintenance" className="mt-0 space-y-4">
                <div className="bg-zinc-900 p-4 rounded-lg border border-white/5">
                  <span className="text-xs text-zinc-500 block mb-1">Maintenance Interval</span>
                  <span className="text-lg font-medium">{machineType.maintenanceIntervalDays} Days</span>
                </div>
                <div className="text-sm text-zinc-400">
                  Preventative maintenance schedules are automatically generated based on this interval.
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="mt-0">
                <div className="text-center text-sm text-zinc-500 py-10">
                  Analytics visualizations are currently rendered in the main dashboard view.
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
