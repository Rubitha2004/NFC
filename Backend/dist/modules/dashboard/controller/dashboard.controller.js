"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardController = exports.DashboardController = void 0;
const dashboard_service_1 = require("../service/dashboard.service");
class DashboardController {
    async getOverview(req, res, next) {
        try {
            const overview = await dashboard_service_1.dashboardService.getOverview();
            res.status(200).json(overview);
        }
        catch (error) {
            next(error);
        }
    }
    async getWorkersSummary(req, res, next) {
        try {
            const summary = await dashboard_service_1.dashboardService.getWorkersSummary();
            res.status(200).json(summary);
        }
        catch (error) {
            next(error);
        }
    }
    async getMachinesSummary(req, res, next) {
        try {
            const summary = await dashboard_service_1.dashboardService.getMachinesSummary();
            res.status(200).json(summary);
        }
        catch (error) {
            next(error);
        }
    }
    async getProductionSummary(req, res, next) {
        try {
            const summary = await dashboard_service_1.dashboardService.getProductionSummary();
            res.status(200).json(summary);
        }
        catch (error) {
            next(error);
        }
    }
    async getQCSummary(req, res, next) {
        try {
            const summary = await dashboard_service_1.dashboardService.getQCSummary();
            res.status(200).json(summary);
        }
        catch (error) {
            next(error);
        }
    }
    async getLiveFloor(req, res, next) {
        try {
            const liveFloor = await dashboard_service_1.dashboardService.getLiveFloor();
            res.status(200).json(liveFloor);
        }
        catch (error) {
            next(error);
        }
    }
    async getAttendanceSummary(req, res, next) {
        try {
            const summary = await dashboard_service_1.dashboardService.getAttendanceSummary();
            res.status(200).json(summary);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.DashboardController = DashboardController;
exports.dashboardController = new DashboardController();
