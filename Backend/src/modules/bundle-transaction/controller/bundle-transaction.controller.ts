import { Request, Response } from 'express';
import { BundleTransactionService } from '../service/bundle-transaction.service';
import { createBundleTransactionSchema } from '../dto/bundle-transaction.dto';

const service = new BundleTransactionService();

export class BundleTransactionController {
  async create(req: Request, res: Response): Promise<any> {
    try {
      const validatedData = createBundleTransactionSchema.parse(req.body);
      const transaction = await service.createTransaction(validatedData);
      return res.status(201).json(transaction);
    } catch (error: any) {
      return res.status(400).json({ error: error.message || error });
    }
  }

  async getAll(req: Request, res: Response): Promise<any> {
    try {
      const transactions = await service.getAllTransactions();
      return res.json(transactions);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response): Promise<any> {
    try {
      const transaction = await service.getTransactionById(Number(req.params.id));
      if (!transaction) {
        return res.status(404).json({ error: 'Transaction not found' });
      }
      return res.json(transaction);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async getByBundle(req: Request, res: Response): Promise<any> {
    try {
      const transactions = await service.getTransactionsByBundle(Number(req.params.bundleId));
      return res.json(transactions);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}
