"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignmentController = void 0;
const assignment_service_1 = require("../service/assignment.service");
const assignment_validation_1 = require("../validation/assignment.validation");
const assignmentService = new assignment_service_1.AssignmentService();
class AssignmentController {
    async createAssignment(req, res) {
        try {
            const validatedData = assignment_validation_1.createAssignmentSchema.parse(req.body);
            const assignment = await assignmentService.createAssignment(validatedData);
            return res.status(201).json({
                success: true,
                message: "Assignment created successfully",
                data: assignment,
            });
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message || "Failed to create assignment",
            });
        }
    }
    async getAllAssignments(req, res) {
        try {
            const result = await assignmentService.getAllAssignments(req.query);
            return res.status(200).json({
                success: true,
                data: result,
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: "Failed to fetch assignments",
            });
        }
    }
    async getAssignmentById(req, res) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id))
                throw new Error("Invalid ID");
            const assignment = await assignmentService.getAssignmentById(id);
            return res.status(200).json({
                success: true,
                data: assignment,
            });
        }
        catch (error) {
            return res.status(404).json({
                success: false,
                message: error.message || "Assignment not found",
            });
        }
    }
    async releaseAssignment(req, res) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id))
                throw new Error("Invalid ID");
            const assignment = await assignmentService.releaseAssignment(id);
            return res.status(200).json({
                success: true,
                message: "Assignment released successfully",
                data: assignment,
            });
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message || "Failed to release assignment",
            });
        }
    }
    async updateAssignment(req, res) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id))
                throw new Error("Invalid ID");
            const validatedData = assignment_validation_1.updateAssignmentSchema.parse(req.body);
            const assignment = await assignmentService.updateAssignment(id, validatedData);
            return res.status(200).json({
                success: true,
                message: "Assignment updated successfully",
                data: assignment,
            });
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message || "Failed to update assignment",
            });
        }
    }
}
exports.AssignmentController = AssignmentController;
