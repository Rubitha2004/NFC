import { Router } from "express";
import { DepartmentController } from "../controller/department.controller";

const router = Router();
const controller = new DepartmentController();

// GET /api/v1/departments        – List all (with optional ?search=&status=)
router.get("/", controller.getAll);

// POST /api/v1/departments       – Create new
router.post("/", controller.create);

// GET /api/v1/departments/:id    – Get by ID
router.get("/:id", controller.getById);

// PUT /api/v1/departments/:id    – Update
router.put("/:id", controller.update);

// DELETE /api/v1/departments/:id – Delete
router.delete("/:id", controller.delete);

export default router;