import { Request, Response } from 'express';
import { TagService } from '../service/tag.service';
import { CreateTagSchema, AssignTagSchema } from '../dto/tag.dto';

const service = new TagService();

export class TagController {
  async getAll(req: Request, res: Response): Promise<any> {
    try {
      const tags = await service.getAllTags();
      return res.json({ success: true, data: tags });
    } catch (e: any) {
      return res.status(500).json({ success: false, error: e.message });
    }
  }

  async getAvailable(req: Request, res: Response): Promise<any> {
    try {
      const tags = await service.getAvailableTags();
      return res.json({ success: true, data: tags });
    } catch (e: any) {
      return res.status(500).json({ success: false, error: e.message });
    }
  }

  async getById(req: Request, res: Response): Promise<any> {
    try {
      const tag = await service.getTagById(Number(req.params.id));
      return res.json({ success: true, data: tag });
    } catch (e: any) {
      return res.status(404).json({ success: false, error: e.message });
    }
  }

  async create(req: Request, res: Response): Promise<any> {
    try {
      const dto = CreateTagSchema.parse(req.body);
      const tag = await service.createTag(dto);
      return res.status(201).json({ success: true, data: tag });
    } catch (e: any) {
      return res.status(400).json({ success: false, error: e.message });
    }
  }

  async assign(req: Request, res: Response): Promise<any> {
    try {
      const dto = AssignTagSchema.parse(req.body);
      const tag = await service.assignTag(Number(req.params.id), dto);
      return res.json({ success: true, data: tag });
    } catch (e: any) {
      return res.status(400).json({ success: false, error: e.message });
    }
  }

  async release(req: Request, res: Response): Promise<any> {
    try {
      const tag = await service.releaseTag(Number(req.params.id));
      return res.json({ success: true, data: tag });
    } catch (e: any) {
      return res.status(400).json({ success: false, error: e.message });
    }
  }
}
