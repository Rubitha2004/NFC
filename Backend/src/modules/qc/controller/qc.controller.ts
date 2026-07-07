import { Request, Response } from 'express';
import { QCService } from '../service/qc.service';
import { createQCSchema, updateQCSchema } from '../dto/qc.dto';

const service = new QCService();

export class QCController {
  async create(req: Request, res: Response): Promise<any> {
    try {
      const validatedData = createQCSchema.parse(req.body);
      const qc = await service.createQC(validatedData);
      return res.status(201).json(qc);
    } catch (error: any) {
      return res.status(400).json({ error: error.message || error });
    }
  }

  async getAll(req: Request, res: Response): Promise<any> {
    try {
      const qcs = await service.getAllQC();
      return res.json(qcs);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response): Promise<any> {
    try {
      const qc = await service.getQCById(Number(req.params.id));
      if (!qc) {
        return res.status(404).json({ error: 'QC record not found' });
      }
      return res.json(qc);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<any> {
    try {
      const validatedData = updateQCSchema.parse(req.body);
      const qc = await service.updateQC(Number(req.params.id), validatedData);
      return res.json(qc);
    } catch (error: any) {
      return res.status(400).json({ error: error.message || error });
    }
  }
}
