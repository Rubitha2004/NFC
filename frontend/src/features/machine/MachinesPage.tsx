import { Cpu, Download, FileUp, Plus } from "lucide-react";
import { PageContainer, PageHeader } from "@/shared/components/PageHeader";
import { Button } from "@/components/ui/button";
import { MachinesKPIs } from './components/MachinesKPIs';
import { MachinesFilter } from './components/MachinesFilter';
import { MachinesTable } from './components/MachinesTable';
import { MachineDetailsDrawer } from './components/MachineDetailsDrawer';
import { AddMachineDialog } from './components/AddMachineDialog';
import { useMachineStore } from "./store/machine.store";

export default function MachinesPage() {
  const setAddDialogOpen = useMachineStore((s) => s.setAddDialogOpen);

  return (
    <PageContainer>
      <PageHeader 
        title="Machine Management" 
        description="Manage factory machines, terminals, health, production, and assignments."
        breadcrumbs={
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Cpu className="w-4 h-4" />
            <span>/</span>
            <span>Master Data</span>
            <span>/</span>
            <span className="text-foreground font-medium">Machines</span>
          </div>
        }
      >
        <Button variant="outline" className="gap-2">
          <FileUp className="w-4 h-4" />
          Import
        </Button>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export
        </Button>
        <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => setAddDialogOpen(true)}>
          <Plus className="w-4 h-4" />
          Add Machine
        </Button>
      </PageHeader>

      <MachinesKPIs />
      
      <div className="flex flex-col flex-1 min-h-0 bg-card border border-border/40 rounded-xl overflow-hidden shadow-sm">
        <MachinesFilter />
        <MachinesTable />
      </div>

      <MachineDetailsDrawer />
      <AddMachineDialog />
    </PageContainer>
  );
}
