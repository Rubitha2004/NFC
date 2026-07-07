"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const department_controller_1 = require("../controller/department.controller");
const router = (0, express_1.Router)();
const controller = new department_controller_1.DepartmentController();
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
exports.default = router;
