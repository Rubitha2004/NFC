import { Request, Response } from 'express';
import { QCCheckService } from '../service/qc-check.service';
import { CreateQCCheckSchema } from '../dto/qc-check.dto';
import { QCTier, QCCheckStatus } from '@prisma/client';

const service = new QCCheckService();

export class QCCheckController {
  async getAll(req: Request, res: Response): Promise<any> {
    try {
      const bundleId = req.query.bundleId ? Number(req.query.bundleId) : undefined;
      const qcTier = req.query.qcTier as QCTier | undefined;
      const status = req.query.status as QCCheckStatus | undefined;
      const checks = await service.getAll({ bundleId, qcTier, status });
      return res.json({ success: true, data: checks });
    } catch (e: any) {
      return res.status(500).json({ success: false, error: e.message });
    }
  }

  async getById(req: Request, res: Response): Promise<any> {
    try {
      const check = await service.getById(Number(req.params.id));
      return res.json({ success: true, data: check });
    } catch (e: any) {
      return res.status(404).json({ success: false, error: e.message });
    }
  }

  async getByBundle(req: Request, res: Response): Promise<any> {
    try {
      const checks = await service.getByBundle(Number(req.params.bundleId));
      return res.json({ success: true, data: checks });
    } catch (e: any) {
      return res.status(500).json({ success: false, error: e.message });
    }
  }

  async getAccountabilityTrail(req: Request, res: Response): Promise<any> {
    try {
      const trail = await service.getAccountabilityTrail(Number(req.params.bundleId));
      return res.json({ success: true, data: trail });
    } catch (e: any) {
      return res.status(500).json({ success: false, error: e.message });
    }
  }

  async scan(req: Request, res: Response): Promise<any> {
    try {
      const { tagCode, qcPersonCardId } = req.body;
      if (!tagCode || !qcPersonCardId) {
        return res.status(400).json({ success: false, error: 'tagCode and qcPersonCardId are required' });
      }
      const data = await service.scanTagForQC(tagCode, qcPersonCardId);
      return res.json({ success: true, data });
    } catch (e: any) {
      return res.status(400).json({ success: false, error: e.message });
    }
  }

  async create(req: Request, res: Response): Promise<any> {
    try {
      const dto = CreateQCCheckSchema.parse(req.body);
      const check = await service.create(dto);
      return res.status(201).json({ success: true, data: check });
    } catch (e: any) {
      return res.status(400).json({ success: false, error: e.message });
    }
  }
}
