import { StageLogRepository } from '../repository/stage-log.repository';
import { ScanInDTO, ScanOutDTO } from '../dto/stage-log.dto';
import prisma from '../../../config/prisma';
import { IotService } from '../../iot/service/iot.service';

const repo = new StageLogRepository();
const iotService = new IotService();

export class StageLogService {
  async getAll(bundleId?: number) {
    return repo.findAll(bundleId);
  }

  async getByBundle(bundleId: number) {
    return repo.findByBundle(bundleId);
  }

  async scanIn(dto: ScanInDTO) {
    // Route manual scan-in through the canonical IotService logic
    const tag = await prisma.bundleTagAssignment.findUnique({ where: { id: dto.tagId } });
    if (!tag) throw new Error('Tag not found');
    
    const worker = await prisma.worker.findUnique({ where: { id: dto.operatorId } });
    if (!worker) throw new Error('Operator not found');

    const assignment = await prisma.assignment.findFirst({
        where: { workerId: dto.operatorId, operationId: dto.operationId, status: 'ACTIVE' },
        include: { machine: { include: { terminal: true } } }
    });
    if (!assignment || !assignment.machine.terminal) {
        throw new Error('Worker must have an active assignment to a machine with a terminal to scan manually.');
    }

    return iotService.handleScan(tag.tagCode, worker.nfcCardId, assignment.machine.terminal.terminalCode);
  }

  async scanOut(logId: number, dto: ScanOutDTO) {
    const existing = await repo.findById(logId);
    if (!existing) throw new Error('Stage log not found');
    if (existing.outTime) throw new Error('This scan has already been closed');
    
    const tag = await prisma.bundleTagAssignment.findUnique({ where: { id: existing.tagId } });
    const worker = await prisma.worker.findUnique({ where: { id: existing.operatorId } });
    
    const assignment = await prisma.assignment.findFirst({
        where: { workerId: existing.operatorId, operationId: existing.operationId, status: 'ACTIVE' },
        include: { machine: { include: { terminal: true } } }
    });
    if (!assignment || !assignment.machine.terminal) {
        throw new Error('Worker must have an active assignment to a machine with a terminal to scan manually.');
    }

    return iotService.handleScan(tag!.tagCode, worker!.nfcCardId, assignment.machine.terminal.terminalCode);
  }
}
