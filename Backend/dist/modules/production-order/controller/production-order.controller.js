"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductionOrderController = void 0;
const production_order_service_1 = require("../service/production-order.service");
const production_order_validation_1 = require("../validation/production-order.validation");
class ProductionOrderController {
    service;
    constructor() {
        this.service = new production_order_service_1.ProductionOrderService();
    }
    create = async (req, res) => {
        try {
            const validatedData = production_order_validation_1.createProductionOrderSchema.parse(req.body);
            const result = await this.service.create(validatedData);
            res.status(201).json({ success: true, data: result });
        }
        catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    };
    findAll = async (req, res) => {
        try {
            const result = await this.service.findAll();
            res.json({ success: true, data: result });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    };
    findById = async (req, res) => {
        try {
            const result = await this.service.findById(Number(req.params.id));
            res.json({ success: true, data: result });
        }
        catch (error) {
            res.status(404).json({ success: false, error: error.message });
        }
    };
    update = async (req, res) => {
        try {
            const validatedData = production_order_validation_1.updateProductionOrderSchema.parse(req.body);
            const result = await this.service.update(Number(req.params.id), validatedData);
            res.json({ success: true, data: result });
        }
        catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    };
    changeStatus = async (req, res) => {
        try {
            const { status } = production_order_validation_1.updateProductionOrderStatusSchema.parse(req.body);
            const result = await this.service.changeStatus(Number(req.params.id), status);
            res.json({ success: true, data: result });
        }
        catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    };
}
exports.ProductionOrderController = ProductionOrderController;
