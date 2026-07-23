import { Building2, Plus, Download, Upload, Filter, X } from 'lucide-react';
import { DepartmentKPICards } from './DepartmentKPICards';
import { DepartmentTable } from './DepartmentTable';
import { AddDepartmentDialog } from './AddDepartmentDialog';
import { DepartmentDetailsDrawer } from './DepartmentDetailsDrawer';
import { useDepartmentStore } from '../store/department.store';
import { PageContainer, PageHeader } from '@/shared/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function DepartmentManagement() {
  const store = useDepartmentStore();

  return (
    <PageContainer>
      
      <PageHeader 
        title="Department Management"
        description="Manage factory departments, production lines, resources, and performance."
        breadcrumbs={
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Building2 className="w-4 h-4" />
            <span>/</span>
            <span>Master Data</span>
            <span>/</span>
            <span className="text-foreground font-medium">Departments</span>
          </div>
        }
      >
        <Button variant="outline" className="gap-2">
          <Upload className="w-4 h-4" /> Import
        </Button>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" /> Export
        </Button>
        <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => store.setAddDialogOpen(true)}>
          <Plus className="w-4 h-4" /> Add Department
        </Button>
      </PageHeader>

      {/* KPI Cards */}
      <DepartmentKPICards />

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 bg-zinc-900/50 p-4 rounded-xl border border-white/5 items-center">
        <div className="flex-1 relative w-full">
          <Input 
            placeholder="Search departments by code or name..." 
            value={store.searchQuery}
            onChange={(e) => store.setSearchQuery(e.target.value)}
            className="w-full bg-zinc-950 border-white/10 text-white pl-10"
          />
          <Filter className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Select value={store.statusFilter} onValueChange={(v) => store.setStatusFilter(v || 'all')}>
            <SelectTrigger className="w-[150px] bg-zinc-950 border-white/10 text-sm">
              <span className="text-white/40 mr-1">Status:</span>
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>

          <Select value={store.typeFilter} onValueChange={(v) => store.setTypeFilter(v || 'all')}>
            <SelectTrigger className="w-[150px] bg-zinc-950 border-white/10 text-sm">
              <span className="text-white/40 mr-1">Type:</span>
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Production">Production</SelectItem>
              <SelectItem value="Quality">Quality</SelectItem>
              <SelectItem value="Logistics">Logistics</SelectItem>
              <SelectItem value="Finishing">Finishing</SelectItem>
              <SelectItem value="Support">Support</SelectItem>
            </SelectContent>
          </Select>

          {(store.searchQuery || store.statusFilter !== 'all' || store.typeFilter !== 'all') && (
            <button 
              onClick={() => {
                store.setSearchQuery('');
                store.setStatusFilter('all');
                store.setTypeFilter('all');
              }}
              className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title="Reset Filters"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Table */}
      <DepartmentTable />

      {/* Dialogs and Drawers */}
      <AddDepartmentDialog />
      <DepartmentDetailsDrawer />
    </PageContainer>
  );
}
