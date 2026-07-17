import { Request, Response } from 'express';
import { IotService } from '../service/iot.service';
import { z } from 'zod';

const service = new IotService();

const ScanSchema = z.object({
  tagCode: z.string(),
  workerCardId: z.string(),
  terminalCode: z.string()
});

export class IotController {
  async handleScan(req: Request, res: Response): Promise<any> {
    try {
      const data = ScanSchema.parse(req.body);
      const result = await service.handleScan(data.tagCode, data.workerCardId, data.terminalCode);
      return res.json({ success: true, data: result });
    } catch (e: any) {
      return res.status(400).json({ success: false, error: e.message });
    }
  }

  async getDemoData(req: Request, res: Response): Promise<any> {
    try {
      const machineIdentifier = req.params.machineId;
      if (!machineIdentifier) throw new Error("Invalid machine ID");
      const data = await service.getDemoData(machineIdentifier);
      return res.json({ success: true, data });
    } catch (e: any) {
      return res.status(400).json({ success: false, error: e.message });
    }
  }
}
