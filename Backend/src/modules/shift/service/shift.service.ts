import { ShiftRepository } from "../repository/shift.repository";
import { CreateShiftDto, UpdateShiftDto } from "../dto/shift.dto";
import { RecordStatus } from "@prisma/client";
import { ShiftSearchParams } from "../types/shift.types";

export class ShiftService {
  private repository = new ShiftRepository();

  private calculateHours(start: string, end: string): number {
    const [startH, startM] = start.split(":").map(Number);
    const [endH, endM] = end.split(":").map(Number);
    
    let diffMins = (endH * 60 + endM) - (startH * 60 + startM);
    // Overnight shift
    if (diffMins < 0) {
      diffMins += 24 * 60;
    }
    return diffMins / 60;
  }

  private calculateWorkingHours(startTime: string, endTime: string, breakStart?: string | null, breakEnd?: string | null): number {
    const totalHours = this.calculateHours(startTime, endTime);
    if (breakStart && breakEnd) {
      const breakHours = this.calculateHours(breakStart, breakEnd);
      return totalHours - breakHours;
    }
    return totalHours;
  }

  async create(data: CreateShiftDto) {
    const existingCode = await this.repository.findByCode(data.shiftCode);
    if (existingCode) {
      throw new Error("Shift Code already exists");
    }

    const existingName = await this.repository.findByName(data.shiftName);
    if (existingName) {
      throw new Error("Shift Name already exists");
    }

    const workingHours = this.calculateWorkingHours(data.startTime, data.endTime, data.breakStart, data.breakEnd);

    return await this.repository.create({ ...data, workingHours });
  }

  async getAll(params: any) {
    return await this.repository.findAll(params as ShiftSearchParams);
  }

  async getById(id: number) {
    const shift = await this.repository.findById(id);
    if (!shift) {
      throw new Error("Shift not found");
    }
    return shift;
  }

  async update(id: number, data: UpdateShiftDto) {
    const shift = await this.repository.findById(id);
    if (!shift) {
      throw new Error("Shift not found");
    }

    if (data.shiftName && data.shiftName !== shift.shiftName) {
      const existingName = await this.repository.findByName(data.shiftName);
      if (existingName) {
        throw new Error("Shift Name already exists");
      }
    }

    // Re-calculate working hours if time fields are being updated
    const newStartTime = data.startTime ?? shift.startTime;
    const newEndTime = data.endTime ?? shift.endTime;
    const newBreakStart = data.breakStart === null ? null : (data.breakStart ?? shift.breakStart);
    const newBreakEnd = data.breakEnd === null ? null : (data.breakEnd ?? shift.breakEnd);
    
    const workingHours = this.calculateWorkingHours(newStartTime, newEndTime, newBreakStart, newBreakEnd);

    // Remove breakStart and breakEnd from data if they are strictly undefined (to not override Prisma's ability to update them)
    // Actually Prisma's UncheckedUpdateInput accepts null
    return await this.repository.update(id, { ...data, workingHours });
  }

  async changeStatus(id: number, status: RecordStatus) {
    const shift = await this.repository.findById(id);
    if (!shift) {
      throw new Error("Shift not found");
    }
    return await this.repository.changeStatus(id, status);
  }
}
