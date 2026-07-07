import { Users, Download, FileUp, Plus } from 'lucide-react';
import { useWorkerStore } from './store/worker.store';
import { WorkersKPIs } from './components/WorkersKPIs';
import { WorkersFilter } from './components/WorkersFilter';
import { WorkersTable } from './components/WorkersTable';
import { WorkerDetailsDrawer } from './components/WorkerDetailsDrawer';
import { AddWorkerDialog } from './components/AddWorkerDialog';
import { PageContainer, PageHeader } from '@/shared/components/PageHeader';
import { Button } from '@/components/ui/button';

export default function WorkersPage() {
  const setAddDialogOpen = useWorkerStore((s) => s.setAddDialogOpen);

  return (
    <PageContainer>
      <PageHeader 
        title="Workers"
        description="Manage employee information, NFC cards, grades, skills, and departments."
        breadcrumbs={
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>/</span>
            <span>Master Data</span>
            <span>/</span>
            <span className="text-foreground font-medium">Workers</span>
          </div>
        }
      >
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" /> Template
        </Button>
        <Button variant="outline" className="gap-2">
          <FileUp className="w-4 h-4" /> Import
        </Button>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" /> Export
        </Button>
        <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => setAddDialogOpen(true)}>
          <Plus className="w-4 h-4" /> Add Worker
        </Button>
      </PageHeader>
      
      <WorkersKPIs />
      <WorkersFilter />
      <WorkersTable />
      
      <WorkerDetailsDrawer />
      <AddWorkerDialog />
    </PageContainer>
  );
}
