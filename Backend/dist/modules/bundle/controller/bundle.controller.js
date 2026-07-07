"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BundleController = void 0;
const bundle_service_1 = require("../service/bundle.service");
const bundle_validation_1 = require("../validation/bundle.validation");
class BundleController {
    service;
    constructor() {
        this.service = new bundle_service_1.BundleService();
    }
    create = async (req, res) => {
        try {
            const validatedData = bundle_validation_1.createBundleSchema.parse(req.body);
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
            const validatedData = bundle_validation_1.updateBundleSchema.parse(req.body);
            const result = await this.service.update(Number(req.params.id), validatedData);
            res.json({ success: true, data: result });
        }
        catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    };
    changeStatus = async (req, res) => {
        try {
            const { status } = bundle_validation_1.updateBundleStatusSchema.parse(req.body);
            const result = await this.service.changeStatus(Number(req.params.id), status);
            res.json({ success: true, data: result });
        }
        catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    };
}
exports.BundleController = BundleController;
