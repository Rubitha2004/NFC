import { Request, Response } from "express";
import { planningService } from "../service/planning.service";
import { CreateTaskSchema, UpdateTaskSchema, PublishPlanSchema } from "../dto/planning.dto";

export class PlanningController {
  async getDashboardMetrics(req: Request, res: Response) {
    try {
      const metrics = await planningService.getDashboardMetrics();
      res.json(metrics);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAllTasks(req: Request, res: Response) {
    try {
      const tasks = await planningService.getAllTasks();
      res.json(tasks);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getTaskById(req: Request, res: Response) {
    try {
      const task = await planningService.getTaskById(Number(req.params.id));
      if (!task) return res.status(404).json({ error: "Task not found" });
      res.json(task);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async createTask(req: Request, res: Response) {
    try {
      const parsedData = CreateTaskSchema.parse(req.body);
      const task = await planningService.createTask(parsedData);
      res.status(201).json(task);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateTask(req: Request, res: Response) {
    try {
      const parsedData = UpdateTaskSchema.parse(req.body);
      const task = await planningService.updateTask(Number(req.params.id), parsedData);
      res.json(task);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getResourceAvailability(req: Request, res: Response) {
    try {
      const resources = await planningService.getResourceAvailability();
      res.json(resources);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async runAutoScheduler(req: Request, res: Response) {
    try {
      const result = await planningService.runAutoScheduler(Number(req.params.id));
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async publishPlan(req: Request, res: Response) {
    try {
      const parsedData = PublishPlanSchema.parse(req.body);
      const result = await planningService.publishPlan(parsedData);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getHistory(req: Request, res: Response) {
    try {
      const result = await planningService.getHistory();
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getOpenBundles(req: Request, res: Response) {
    try {
      const operationId = Number(req.params.id);
      const result = await planningService.getOpenBundlesForOperation(operationId);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getTerminals(req: Request, res: Response) {
    try {
      const result = await planningService.getTerminals();
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export const planningController = new PlanningController();
