import apiClient from '@/services/axios';

export interface ControlCenterData {
  stats: {
    workersPresent: number;
    workersAbsent: number;
    workersBusy: number;
    workersAvailable: number;
    machinesRunning: number;
    machinesIdle: number;
    machinesOffline: number;
    machinesMaintenance: number;
    productionOrders: number;
    bundlesRunning: number;
    bundlesWaiting: number;
    tasksRunning: number;
    qcPending: number;
    efficiency: number;
    utilization: number;
    workerUtilization: number;
    targetToday: number;
    completedToday: number;
    delayedOrders: number;
  };
  planningQueue: Array<{
    id: string;
    customer: string;
    style: string;
    priority: "High" | "Normal" | "Low";
    dueDate: string;
    remainingQty: number;
    status: string;
    planner: string;
    supervisor: string;
  }>;
  alerts: Array<{
    id: string;
    type: "Offline" | "Absent" | "Reject" | "Shortage" | "Delay";
    message: string;
    time: string;
  }>;
}

export const controlCenterService = {
  async getDashboardData(): Promise<ControlCenterData> {
    const { data: overview } = await apiClient.get('/dashboard/overview');
    
    return {
      stats: {
        workersPresent: overview.workers.present,
        workersAbsent: overview.workers.absent,
        workersBusy: overview.workers.active,
        workersAvailable: overview.workers.idle,
        
        machinesRunning: overview.machines.running,
        machinesIdle: overview.machines.idle,
        machinesOffline: overview.machines.offline,
        machinesMaintenance: 0, 
        
        productionOrders: overview.production.planned, 
        bundlesRunning: overview.bundles.inProgress,
        bundlesWaiting: overview.bundles.created,
        tasksRunning: overview.bundles.inProgress, 
        qcPending: overview.bundles.qcPending,
        
        efficiency: overview.production.efficiency,
        utilization: overview.machines.total > 0 ? Math.round((overview.machines.running / overview.machines.total) * 100) : 0,
        workerUtilization: overview.workers.present > 0 ? Math.round((overview.workers.active / overview.workers.present) * 100) : 0,
        
        targetToday: overview.production.planned,
        completedToday: overview.production.completed,
        delayedOrders: 0, 
      },
      planningQueue: [],
      alerts: []
    };
  }
};
