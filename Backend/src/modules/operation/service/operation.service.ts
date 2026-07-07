import { OperationRepository } from "../repository/operation.repository";
import { CreateOperationDto, UpdateOperationDto } from "../dto/operation.dto";
import { RecordStatus } from "@prisma/client";
import { OperationSearchParams } from "../types/operation.types";

export class OperationService {
  private repository = new OperationRepository();

  async create(data: CreateOperationDto) {
    const existingCode = await this.repository.findByCode(data.operationCode);
    if (existingCode) {
      throw new Error("Operation Code already exists");
    }

    const existingName = await this.repository.findByName(data.operationName);
    if (existingName) {
      throw new Error("Operation Name already exists");
    }

    return await this.repository.create(data);
  }

  async getAll(params: any) {
    return await this.repository.findAll(params as OperationSearchParams);
  }

  async getById(id: number) {
    const operation = await this.repository.findById(id);
    if (!operation) {
      throw new Error("Operation not found");
    }
    return operation;
  }

  async update(id: number, data: UpdateOperationDto) {
    const operation = await this.repository.findById(id);
    if (!operation) {
      throw new Error("Operation not found");
    }

    if (data.operationName && data.operationName !== operation.operationName) {
      const existingName = await this.repository.findByName(data.operationName);
      if (existingName) {
        throw new Error("Operation Name already exists");
      }
    }

    return await this.repository.update(id, data);
  }

  async changeStatus(id: number, status: RecordStatus) {
    const operation = await this.repository.findById(id);
    if (!operation) {
      throw new Error("Operation not found");
    }
    return await this.repository.changeStatus(id, status);
  }
}
