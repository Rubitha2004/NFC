import prisma from "../../../config/prisma";

export class MachineTypeRepository {
  findAll() { return prisma.machineType.findMany({ orderBy: { name: "asc" }, include: { machines: true } }); }
  findById(id: number) { return prisma.machineType.findUnique({ where: { id }, include: { machines: true } }); }
  create(data: any) { return prisma.machineType.create({ data, include: { machines: true } }); }
  update(id: number, data: any) { return prisma.machineType.update({ where: { id }, data, include: { machines: true } }); }
  delete(id: number) { return prisma.machineType.update({ where: { id }, data: { status: "INACTIVE" }, include: { machines: true } }); }
}
