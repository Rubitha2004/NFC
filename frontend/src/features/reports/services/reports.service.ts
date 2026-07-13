import apiClient from '@/services/axios';

export const reportsService = {
  getProduction: () => apiClient.get('/reports/production').then(res => res.data),
  getWorkers: () => apiClient.get('/reports/workers').then(res => res.data),
  getMachines: () => apiClient.get('/reports/machines').then(res => res.data),
  getQC: () => apiClient.get('/reports/qc').then(res => res.data),
  getDashboard: () => apiClient.get('/dashboard').then(res => res.data), // Keep this for the global dashboard API
};
