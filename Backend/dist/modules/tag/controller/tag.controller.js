"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagController = void 0;
const tag_service_1 = require("../service/tag.service");
const tag_dto_1 = require("../dto/tag.dto");
const service = new tag_service_1.TagService();
class TagController {
    async getAll(req, res) {
        try {
            const tags = await service.getAllTags();
            return res.json({ success: true, data: tags });
        }
        catch (e) {
            return res.status(500).json({ success: false, error: e.message });
        }
    }
    async getAvailable(req, res) {
        try {
            const tags = await service.getAvailableTags();
            return res.json({ success: true, data: tags });
        }
        catch (e) {
            return res.status(500).json({ success: false, error: e.message });
        }
    }
    async getById(req, res) {
        try {
            const tag = await service.getTagById(Number(req.params.id));
            return res.json({ success: true, data: tag });
        }
        catch (e) {
            return res.status(404).json({ success: false, error: e.message });
        }
    }
    async create(req, res) {
        try {
            const dto = tag_dto_1.CreateTagSchema.parse(req.body);
            const tag = await service.createTag(dto);
            return res.status(201).json({ success: true, data: tag });
        }
        catch (e) {
            return res.status(400).json({ success: false, error: e.message });
        }
    }
    async assign(req, res) {
        try {
            const dto = tag_dto_1.AssignTagSchema.parse(req.body);
            const tag = await service.assignTag(Number(req.params.id), dto);
            return res.json({ success: true, data: tag });
        }
        catch (e) {
            return res.status(400).json({ success: false, error: e.message });
        }
    }
    async release(req, res) {
        try {
            const tag = await service.releaseTag(Number(req.params.id));
            return res.json({ success: true, data: tag });
        }
        catch (e) {
            return res.status(400).json({ success: false, error: e.message });
        }
    }
}
exports.TagController = TagController;
