import { FloorRepository } from "../repository/floor.repository";
import { CreateFloorDTO, UpdateFloorDTO } from "../validation/floor.validation";

export class FloorService {
  private repository: FloorRepository;

  constructor(repository?: FloorRepository) {
    this.repository = repository || new FloorRepository();
  }

  async create(data: CreateFloorDTO) {
    const existing = await this.repository.findByFloorNumber(data.floorNumber);
    if (existing) {
      throw new Error("Floor number already exists.");
    }
    return await this.repository.create({
      name: data.name,
      floorNumber: data.floorNumber,
      factoryName: data.factoryName,
      status: data.status,
    });
  }

  async getById(id: number) {
    return await this.repository.findById(id);
  }

  async getAll() {
    return await this.repository.findAll();
  }

  async update(id: number, data: UpdateFloorDTO) {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new Error("Floor not found.");
    }

    if (data.floorNumber !== undefined && data.floorNumber !== existing.floorNumber) {
      const conflict = await this.repository.findByFloorNumber(data.floorNumber);
      if (conflict) {
        throw new Error("Floor number already exists.");
      }
    }

    return await this.repository.update(id, data);
  }

  async delete(id: number) {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new Error("Floor not found.");
    }
    return await this.repository.delete(id);
  }
}
