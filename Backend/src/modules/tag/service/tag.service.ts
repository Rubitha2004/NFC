import { TagRepository } from '../repository/tag.repository';
import { CreateTagDTO, AssignTagDTO } from '../dto/tag.dto';
import prisma from '../../../config/prisma';

const repo = new TagRepository();

export class TagService {
  async getAllTags() {
    return repo.findAll();
  }

  async getAvailableTags() {
    return repo.findAvailable();
  }

  async getTagById(id: number) {
    const tag = await repo.findById(id);
    if (!tag) throw new Error(`Tag ${id} not found`);
    return tag;
  }

  async createTag(dto: CreateTagDTO) {
    const existing = await repo.findByCode(dto.tagCode);
    if (existing) throw new Error(`Tag with code "${dto.tagCode}" already exists`);
    return repo.create(dto.tagCode, dto.assignedBy);
  }

  async assignTag(id: number, dto: AssignTagDTO) {
    const tag = await repo.findById(id);
    if (!tag) throw new Error('Tag not found');
    if (tag.status === 'ASSIGNED') throw new Error(`Tag is already assigned to bundle ${tag.bundleId}`);

    const bundle = await prisma.bundle.findUnique({ where: { id: dto.bundleId } });
    if (!bundle) throw new Error('Bundle not found');

    return repo.assign(id, dto.bundleId, dto.assignedBy);
  }

  async releaseTag(id: number) {
    const tag = await repo.findById(id);
    if (!tag) throw new Error('Tag not found');
    if (tag.status === 'AVAILABLE') throw new Error('Tag is already in Available pool');
    return repo.release(id);
  }
}
