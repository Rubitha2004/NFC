"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagService = void 0;
const tag_repository_1 = require("../repository/tag.repository");
const prisma_1 = __importDefault(require("../../../config/prisma"));
const repo = new tag_repository_1.TagRepository();
class TagService {
    async getAllTags() {
        return repo.findAll();
    }
    async getAvailableTags() {
        return repo.findAvailable();
    }
    async getTagById(id) {
        const tag = await repo.findById(id);
        if (!tag)
            throw new Error(`Tag ${id} not found`);
        return tag;
    }
    async createTag(dto) {
        const existing = await repo.findByCode(dto.tagCode);
        if (existing)
            throw new Error(`Tag with code "${dto.tagCode}" already exists`);
        return repo.create(dto.tagCode, dto.assignedBy);
    }
    async assignTag(id, dto) {
        const tag = await repo.findById(id);
        if (!tag)
            throw new Error('Tag not found');
        if (tag.status === 'ASSIGNED')
            throw new Error(`Tag is already assigned to bundle ${tag.bundleId}`);
        const bundle = await prisma_1.default.bundle.findUnique({ where: { id: dto.bundleId } });
        if (!bundle)
            throw new Error('Bundle not found');
        return repo.assign(id, dto.bundleId, dto.assignedBy);
    }
    async releaseTag(id) {
        const tag = await repo.findById(id);
        if (!tag)
            throw new Error('Tag not found');
        if (tag.status === 'AVAILABLE')
            throw new Error('Tag is already in Available pool');
        return repo.release(id);
    }
}
exports.TagService = TagService;
