import { DepartmentRepository } from "../repository/department.repository";
import { CreateDepartmentDTO, UpdateDepartmentDTO } from "../validation/department.validation";

export class DepartmentService {
  private repository: DepartmentRepository;

  constructor(repository?: DepartmentRepository) {
    this.repository = repository || new DepartmentRepository();
  }

  /**
   * Create Department
   */
  async create(data: CreateDepartmentDTO) {
    // Check duplicate code
    const existingCode = await this.repository.findByCode(data.code);
    if (existingCode) {
      throw new Error("Department code already exists.");
    }

    // Check duplicate name
    const existingName = await this.repository.findByName(data.name);
    if (existingName) {
      throw new Error("Department name already exists.");
    }

    return await this.repository.create({
      code: data.code,
      name: data.name,
      description: data.description,
      status: data.status as any,
    });
  }

  /**
   * Get Department by ID
   */
  async getById(id: number) {
    return await this.repository.findById(id);
  }

  /**
   * Get All Departments
   */
  async getAll(options?: { search?: string; status?: string }) {
    return await this.repository.findAll(options);
  }

  /**
   * Update Department
   */
  async update(id: number, data: UpdateDepartmentDTO) {
    // Verify department exists
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new Error("Department not found.");
    }

    // Check unique code constraint (if changing code)
    if (data.code && data.code !== existing.code) {
      const codeConflict = await this.repository.findByCode(data.code);
      if (codeConflict) {
        throw new Error("Department code already exists.");
      }
    }

    // Check unique name constraint (if changing name)
    if (data.name && data.name !== existing.name) {
      const nameConflict = await this.repository.findByName(data.name);
      if (nameConflict) {
        throw new Error("Department name already exists.");
      }
    }

    return await this.repository.update(id, {
      ...(data.code !== undefined && { code: data.code }),
      ...(data.name !== undefined && { name: data.name }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.status !== undefined && { status: data.status as any }),
    });
  }

  /**
   * Delete Department
   */
  async delete(id: number) {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new Error("Department not found.");
    }
    return await this.repository.delete(id);
  }
}