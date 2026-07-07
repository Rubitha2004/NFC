import { Request, Response, NextFunction } from "express";
import { DepartmentService } from "../service/department.service";
import { createDepartmentSchema, updateDepartmentSchema } from "../validation/department.validation";

export class DepartmentController {

    private service = new DepartmentService();

    /**
     * POST /api/v1/departments
     * Create a new department
     */
    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = createDepartmentSchema.parse(req.body);
            const department = await this.service.create(data);
            return res.status(201).json({
                success: true,
                message: "Department created successfully",
                data: department
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * GET /api/v1/departments
     * Get all departments with optional search/filter
     */
    getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { search, status } = req.query;
            const departments = await this.service.getAll({
                search: search as string | undefined,
                status: status as string | undefined,
            });
            return res.status(200).json({
                success: true,
                data: departments,
                total: departments.length,
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * GET /api/v1/departments/:id
     * Get department by ID
     */
    getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(String(req.params.id), 10);
            if (isNaN(id)) {
                return res.status(400).json({ success: false, message: "Invalid department ID" });
            }
            const department = await this.service.getById(id);
            if (!department) {
                return res.status(404).json({ success: false, message: "Department not found" });
            }
            return res.status(200).json({ success: true, data: department });
        } catch (error) {
            next(error);
        }
    };

    /**
     * PUT /api/v1/departments/:id
     * Update department
     */
    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(String(req.params.id), 10);
            if (isNaN(id)) {
                return res.status(400).json({ success: false, message: "Invalid department ID" });
            }
            const data = updateDepartmentSchema.parse(req.body);
            const department = await this.service.update(id, data);
            return res.status(200).json({
                success: true,
                message: "Department updated successfully",
                data: department,
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * DELETE /api/v1/departments/:id
     * Delete (soft-delete via status) a department
     */
    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(String(req.params.id), 10);
            if (isNaN(id)) {
                return res.status(400).json({ success: false, message: "Invalid department ID" });
            }
            await this.service.delete(id);
            return res.status(200).json({
                success: true,
                message: "Department deleted successfully",
            });
        } catch (error) {
            next(error);
        }
    };
}