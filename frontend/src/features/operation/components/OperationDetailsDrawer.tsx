import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetDescription
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useOperationStore } from "../store/operation.store";
import { Badge } from "@/components/ui/badge";
import { 
  Wrench, 
  Settings, 
  Users, 
  Computer, 
  LineChart 
} from "lucide-react";

import { useOperation } from "../hooks/useOperation";
import { Loader2 } from "lucide-react";

export function OperationDetailsDrawer() {
  const { isDrawerOpen, setDrawerOpen, selectedOperation, setSelectedOperation } = useOperationStore();
  const { data: operation, isLoading } = useOperation(selectedOperation?.id || null);

  const handleClose = () => {
    setDrawerOpen(false);
    setSelectedOperation(null);
  };

  if (!isDrawerOpen) return null;

  if (isLoading || !operation) {
    return (
      <Sheet open={isDrawerOpen} onOpenChange={handleClose}>
        <SheetContent className="w-[400px] sm:w-[540px] sm:max-w-none bg-zinc-950 border-zinc-800 text-white p-0 flex flex-col h-full overflow-hidden justify-center items-center">
           <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
           <p className="text-zinc-500 mt-4">Loading operation details...</p>
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
                {operation.name}
              </SheetTitle>
              <Badge variant={operation.status === "active" ? "default" : "secondary"}>
                {operation.status.toUpperCase()}
              </Badge>
            </div>
            <SheetDescription className="text-zinc-400">
              {operation.operationCode} • {operation.department}
            </SheetDescription>
          </SheetHeader>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col">
          <Tabs defaultValue="overview" className="w-full h-full flex flex-col">
            <TabsList className="w-full justify-start rounded-none border-b border-white/10 bg-transparent px-6 py-0 h-12">
              <TabsTrigger value="overview" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 rounded-none h-full text-xs sm:text-sm">
                <Wrench className="w-4 h-4 mr-2" /> Overview
              </TabsTrigger>
              <TabsTrigger value="sequence" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 rounded-none h-full text-xs sm:text-sm">
                <Settings className="w-4 h-4 mr-2" /> Sequence
              </TabsTrigger>
              <TabsTrigger value="skills" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 rounded-none h-full text-xs sm:text-sm">
                <Users className="w-4 h-4 mr-2" /> Skills
              </TabsTrigger>
              <TabsTrigger value="machines" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 rounded-none h-full text-xs sm:text-sm">
                <Computer className="w-4 h-4 mr-2" /> Machines
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 rounded-none h-full text-xs sm:text-sm">
                <LineChart className="w-4 h-4 mr-2" /> Analytics
              </TabsTrigger>
            </TabsList>
            
            <div className="flex-1 overflow-y-auto p-6">
              <TabsContent value="overview" className="mt-0 space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-zinc-500 mb-2">Description</h4>
                  <p className="text-sm">{operation.description || "No description provided."}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-zinc-900 p-4 rounded-lg border border-white/5">
                    <span className="text-xs text-zinc-500 block mb-1">SMV (Standard Minute Value)</span>
                    <span className="text-lg font-medium">{operation.smv} mins</span>
                  </div>
                  <div className="bg-zinc-900 p-4 rounded-lg border border-white/5">
                    <span className="text-xs text-zinc-500 block mb-1">Required Grade</span>
                    <span className="text-lg font-medium">Grade {operation.requiredGrade}</span>
                  </div>
                  <div className="bg-zinc-900 p-4 rounded-lg border border-white/5">
                    <span className="text-xs text-zinc-500 block mb-1">Assigned Workers</span>
                    <span className="text-lg font-medium">{operation.assignedWorkers}</span>
                  </div>
                  <div className="bg-zinc-900 p-4 rounded-lg border border-white/5">
                    <span className="text-xs text-zinc-500 block mb-1">Assigned Machines</span>
                    <span className="text-lg font-medium">{operation.assignedMachines}</span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="sequence" className="mt-0">
                <div className="text-center text-sm text-zinc-500 py-10">
                  Operation sequence mapping integration will appear here.
                </div>
              </TabsContent>

              <TabsContent value="skills" className="mt-0">
                <h4 className="text-sm font-medium text-zinc-500 mb-4">Required Skill Mapping</h4>
                <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/20 text-base py-1 px-3">
                  {operation.requiredSkill}
                </Badge>
                <p className="text-sm text-zinc-400 mt-4">
                  Only workers with this primary skill and at least Grade {operation.requiredGrade} can be assigned to this operation.
                </p>
              </TabsContent>

              <TabsContent value="machines" className="mt-0 space-y-4">
                <h4 className="text-sm font-medium text-zinc-500 mb-4">Compatible Machine Types</h4>
                <div className="flex flex-wrap gap-2">
                  {operation.compatibleMachines.map((machine, idx) => (
                    <Badge key={idx} variant="outline" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 text-sm py-1">
                      {machine}
                    </Badge>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="mt-0">
                <div className="text-center text-sm text-zinc-500 py-10">
                  Production history and analytics charts will be rendered here.
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
