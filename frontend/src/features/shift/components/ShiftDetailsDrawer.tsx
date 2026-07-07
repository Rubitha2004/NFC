import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetDescription
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useShiftStore } from "../store/shift.store";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  Users, 
  Computer, 
  TrendingUp, 
  CalendarClock
} from "lucide-react";
import { cn } from "@/lib/utils";

import { useShift } from "../hooks/useShift";
import { Loader2 } from "lucide-react";

export function ShiftDetailsDrawer() {
  const { isDrawerOpen, setDrawerOpen, selectedShift, setSelectedShift } = useShiftStore();
  const { data: shift, isLoading } = useShift(selectedShift?.id || null);

  const handleClose = () => {
    setDrawerOpen(false);
    setSelectedShift(null);
  };

  if (!isDrawerOpen) return null;

  if (isLoading || !shift) {
    return (
      <Sheet open={isDrawerOpen} onOpenChange={handleClose}>
        <SheetContent className="w-[400px] sm:w-[540px] sm:max-w-none bg-zinc-950 border-zinc-800 text-white p-0 flex flex-col h-full overflow-hidden justify-center items-center">
           <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
           <p className="text-zinc-500 mt-4">Loading shift details...</p>
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
                {shift.shiftName}
              </SheetTitle>
              <Badge variant="outline" className={cn(
                "border",
                shift.status === "active" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                shift.status === "completed" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                "bg-amber-500/10 text-amber-500 border-amber-500/20"
              )}>
                {shift.status.toUpperCase()}
              </Badge>
            </div>
            <SheetDescription className="text-zinc-400">
              {shift.shiftCode} • {shift.startTime} - {shift.endTime}
            </SheetDescription>
          </SheetHeader>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col">
          <Tabs defaultValue="overview" className="w-full h-full flex flex-col">
            <TabsList className="w-full justify-start rounded-none border-b border-white/10 bg-transparent px-6 py-0 h-12 flex-wrap">
              <TabsTrigger value="overview" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 rounded-none h-full text-xs sm:text-sm">
                <Clock className="w-4 h-4 mr-2" /> Overview
              </TabsTrigger>
              <TabsTrigger value="workers" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 rounded-none h-full text-xs sm:text-sm">
                <Users className="w-4 h-4 mr-2" /> Workers
              </TabsTrigger>
              <TabsTrigger value="machines" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 rounded-none h-full text-xs sm:text-sm">
                <Computer className="w-4 h-4 mr-2" /> Machines
              </TabsTrigger>
              <TabsTrigger value="production" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 rounded-none h-full text-xs sm:text-sm">
                <TrendingUp className="w-4 h-4 mr-2" /> Production
              </TabsTrigger>
              <TabsTrigger value="timeline" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 rounded-none h-full text-xs sm:text-sm">
                <CalendarClock className="w-4 h-4 mr-2" /> Timeline
              </TabsTrigger>
            </TabsList>
            
            <div className="flex-1 overflow-y-auto p-6">
              <TabsContent value="overview" className="mt-0 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-zinc-900 p-4 rounded-lg border border-white/5">
                    <span className="text-xs text-zinc-500 block mb-1">Supervisor</span>
                    <span className="text-lg font-medium">{shift.supervisor}</span>
                  </div>
                  <div className="bg-zinc-900 p-4 rounded-lg border border-white/5">
                    <span className="text-xs text-zinc-500 block mb-1">Break Duration</span>
                    <span className="text-lg font-medium">{shift.breakDuration} mins</span>
                  </div>
                  <div className="bg-zinc-900 p-4 rounded-lg border border-white/5">
                    <span className="text-xs text-zinc-500 block mb-1">Assigned Workers</span>
                    <span className="text-lg font-medium">{shift.assignedWorkers}</span>
                  </div>
                  <div className="bg-zinc-900 p-4 rounded-lg border border-white/5">
                    <span className="text-xs text-zinc-500 block mb-1">Assigned Machines</span>
                    <span className="text-lg font-medium">{shift.assignedMachines}</span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="workers" className="mt-0">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-lg text-center">
                    <span className="text-3xl font-bold text-emerald-500">{shift.attendanceCount}</span>
                    <span className="text-xs text-emerald-500/80 block mt-1">Present</span>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg text-center">
                    <span className="text-3xl font-bold text-red-500">{shift.assignedWorkers - shift.attendanceCount}</span>
                    <span className="text-xs text-red-500/80 block mt-1">Absent</span>
                  </div>
                  <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg text-center">
                    <span className="text-3xl font-bold text-amber-500">
                      {Math.round((shift.attendanceCount / (shift.assignedWorkers || 1)) * 100)}%
                    </span>
                    <span className="text-xs text-amber-500/80 block mt-1">Attendance Rate</span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="machines" className="mt-0">
                <div className="text-center text-sm text-zinc-500 py-10">
                  Detailed machine assignment matrices and real-time status mapping will appear here.
                </div>
              </TabsContent>

              <TabsContent value="production" className="mt-0 space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                  <div className="bg-zinc-900 p-4 rounded-lg border border-white/5 text-center">
                    <span className="text-xs text-zinc-500 block mb-1">Target</span>
                    <span className="text-2xl font-bold text-white">{shift.productionTarget}</span>
                  </div>
                  <div className="bg-zinc-900 p-4 rounded-lg border border-white/5 text-center">
                    <span className="text-xs text-zinc-500 block mb-1">Completed</span>
                    <span className="text-2xl font-bold text-emerald-400">{shift.productionCompleted}</span>
                  </div>
                </div>
                
                <div className="bg-zinc-900 p-4 rounded-lg border border-white/5 mt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-zinc-400">Efficiency</span>
                    <span className="font-bold text-white">
                      {Math.round((shift.productionCompleted / (shift.productionTarget || 1)) * 100)}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 transition-all"
                      style={{ width: `${Math.min(100, (shift.productionCompleted / (shift.productionTarget || 1)) * 100)}%` }}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="timeline" className="mt-0">
                <div className="relative pl-6 border-l-2 border-zinc-800 space-y-8 py-4">
                  
                  <div className="relative">
                    <div className="absolute -left-[31px] bg-emerald-500 h-4 w-4 rounded-full border-4 border-zinc-950" />
                    <div>
                      <span className="text-sm font-bold text-emerald-400">{shift.startTime}</span>
                      <h4 className="font-medium text-white">Shift Start</h4>
                      <p className="text-xs text-zinc-500">Worker entry and machine boot up.</p>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-[31px] bg-amber-500 h-4 w-4 rounded-full border-4 border-zinc-950" />
                    <div>
                      <span className="text-sm font-bold text-amber-400">Mid-shift</span>
                      <h4 className="font-medium text-white">Scheduled Break</h4>
                      <p className="text-xs text-zinc-500">{shift.breakDuration} minutes allocated for rest.</p>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-[31px] bg-blue-500 h-4 w-4 rounded-full border-4 border-zinc-950" />
                    <div>
                      <span className="text-sm font-bold text-blue-400">{shift.endTime}</span>
                      <h4 className="font-medium text-white">Shift End</h4>
                      <p className="text-xs text-zinc-500">Production halt and data sync.</p>
                    </div>
                  </div>

                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
