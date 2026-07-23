import { Request, Response } from 'express';
import { iotDemoService } from '../service/iot-demo.service';

export class IotDemoController {
  async getContext(req: Request, res: Response) {
    try {
      const orderIdStr = req.query.orderId as string;
      const orderId = orderIdStr ? Number(orderIdStr) : undefined;
      const context = await iotDemoService.getOrderWorkflowContext(orderId);
      return res.status(200).json({ success: true, data: context });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  async toggleWorker(req: Request, res: Response) {
    try {
      const { workerId } = req.body;
      if (!workerId) {
        return res.status(400).json({ success: false, error: 'workerId is required' });
      }
      const result = await iotDemoService.toggleWorker(Number(workerId));
      return res.status(200).json({ success: true, data: result });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  async toggleMachine(req: Request, res: Response) {
    try {
      const { machineId, targetStatus } = req.body;
      if (!machineId) {
        return res.status(400).json({ success: false, error: 'machineId is required' });
      }
      const result = await iotDemoService.toggleMachine(Number(machineId), targetStatus);
      return res.status(200).json({ success: true, data: result });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  async advanceBundle(req: Request, res: Response) {
    try {
      const { bundleId } = req.body;
      if (!bundleId) {
        return res.status(400).json({ success: false, error: 'bundleId is required' });
      }
      const result = await iotDemoService.advanceBundle(Number(bundleId));
      return res.status(200).json({ success: true, data: result });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  async resetDemo(req: Request, res: Response) {
    try {
      const { productionOrderId } = req.body;
      const result = await iotDemoService.resetDemo(productionOrderId ? Number(productionOrderId) : undefined);
      return res.status(200).json({ success: true, data: result });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  async getActivityLogs(_req: Request, res: Response) {
    try {
      const logs = await iotDemoService.getActivityLogs();
      return res.status(200).json({ success: true, data: logs });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
}

export const iotDemoController = new IotDemoController();
