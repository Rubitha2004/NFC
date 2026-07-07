import { Request, Response } from 'express';
import { StageLogService } from '../service/stage-log.service';
import { ScanInSchema, ScanOutSchema } from '../dto/stage-log.dto';

const service = new StageLogService();

export class StageLogController {
  async getAll(req: Request, res: Response): Promise<any> {
    try {
      const bundleId = req.query.bundleId ? Number(req.query.bundleId) : undefined;
      const logs = await service.getAll(bundleId);
      return res.json({ success: true, data: logs });
    } catch (e: any) {
      return res.status(500).json({ success: false, error: e.message });
    }
  }

  async getByBundle(req: Request, res: Response): Promise<any> {
    try {
      const logs = await service.getByBundle(Number(req.params.bundleId));
      return res.json({ success: true, data: logs });
    } catch (e: any) {
      return res.status(500).json({ success: false, error: e.message });
    }
  }

  async scanIn(req: Request, res: Response): Promise<any> {
    try {
      const dto = ScanInSchema.parse(req.body);
      const log = await service.scanIn(dto);
      return res.status(201).json({ success: true, data: log });
    } catch (e: any) {
      return res.status(400).json({ success: false, error: e.message });
    }
  }

  async scanOut(req: Request, res: Response): Promise<any> {
    try {
      const dto = ScanOutSchema.parse(req.body);
      const log = await service.scanOut(Number(req.params.id), dto);
      return res.json({ success: true, data: log });
    } catch (e: any) {
      return res.status(400).json({ success: false, error: e.message });
    }
  }
}
