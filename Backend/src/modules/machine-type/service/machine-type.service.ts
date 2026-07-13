import { MachineTypeRepository } from '../repository/machine-type.repository';

export class MachineTypeService {
  private repository = new MachineTypeRepository();

  async getAll() {
    return this.repository.findAll();
  }

  async getById(id: number) {
    const record = await this.repository.findById(id);
    if (!record) {
      throw new Error("Machine type not found");
    }
    return record;
  }

  async create(data: any) {
    return this.repository.create(data);
  }

  async update(id: number, data: any) {
    const record = await this.repository.findById(id);
    if (!record) {
      throw new Error("Machine type not found");
    }
    return this.repository.update(id, data);
  }

  async delete(id: number) {
    const record = await this.repository.findById(id);
    if (!record) {
      throw new Error("Machine type not found");
    }
    return this.repository.delete(id);
  }
}
