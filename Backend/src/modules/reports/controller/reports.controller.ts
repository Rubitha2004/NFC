import { Request, Response, NextFunction } from "express";
import { reportsService } from "../service/reports.service";
import { reportQuerySchema } from "../dto/reports.dto";
import { exportToExcel } from "../utils/excel.export";
import { exportToPdf } from "../utils/pdf.export";

export class ReportsController {
  
  private getFilters(req: Request) {
    const result = reportQuerySchema.safeParse(req.query);
    if (!result.success) {
      throw new Error("Invalid query parameters");
    }
    return result.data;
  }

  async getAttendance(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = this.getFilters(req);
      const data = await reportsService.getAttendanceAnalytics(filters);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async getProduction(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = this.getFilters(req);
      const data = await reportsService.getProductionAnalytics(filters);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async getWorkers(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = this.getFilters(req);
      const data = await reportsService.getWorkerAnalytics(filters);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async getMachines(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = this.getFilters(req);
      const data = await reportsService.getMachineAnalytics(filters);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async getQC(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = this.getFilters(req);
      const data = await reportsService.getQCAnalytics(filters);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async getBundles(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = this.getFilters(req);
      const data = await reportsService.getBundleAnalytics(filters);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await reportsService.getDashboardAnalytics();
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async exportReport(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = this.getFilters(req);
      const reportType = req.query.type as string;
      const format = (req.query.format as string) || 'excel';

      if (!reportType) throw new Error("Report type is required for export");

      let title = "Report";
      let columns: { header: string, key: string, width?: number }[] = [];
      let data: any[] = [];
      let headersPdf: string[] = [];
      let rowsPdf: any[][] = [];

      // Only implementing a basic Workers export for demonstration
      // In a real scenario, this would switch based on `reportType` and format data for all reports
      if (reportType === 'workers') {
        title = "Worker Productivity Report";
        const analytics = await reportsService.getWorkerAnalytics(filters);
        
        columns = [
          { header: 'Worker ID', key: 'workerId', width: 10 },
          { header: 'Name', key: 'workerName', width: 25 },
          { header: 'Department', key: 'department', width: 20 },
          { header: 'Total Produced', key: 'totalProduced', width: 15 },
          { header: 'Transactions', key: 'transactionsCount', width: 15 },
        ];
        headersPdf = columns.map(c => c.header);
        
        data = analytics.data;
        rowsPdf = data.map(item => [
          item.workerId?.toString() || '',
          item.workerName,
          item.department,
          item.totalProduced.toString(),
          item.transactionsCount.toString()
        ]);
      } else {
        throw new Error("Export for this report type is not fully implemented in the demo");
      }

      if (format === 'excel' || format === 'csv') {
        const buffer = await exportToExcel(title, columns, data);
        const contentType = format === 'excel' 
          ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          : 'text/csv';
        const extension = format === 'excel' ? 'xlsx' : 'csv';

        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', `attachment; filename=${reportType}_report.${extension}`);
        res.send(buffer);
      } else if (format === 'pdf') {
        const buffer = await exportToPdf(title, headersPdf, rowsPdf);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${reportType}_report.pdf`);
        res.send(buffer);
      } else {
        throw new Error("Unsupported format");
      }
    } catch (error) {
      next(error);
    }
  }
}

export const reportsController = new ReportsController();
