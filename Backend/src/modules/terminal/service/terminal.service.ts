import { TerminalRepository } from "../repository/terminal.repository";
import { CreateTerminalDto, UpdateTerminalDto, TerminalSearchParams } from "../types/terminal.types";
import { RecordStatus } from "@prisma/client";
import { websocketService, WEBSOCKET_EVENTS } from "../../websocket";

export class TerminalService {
  private terminalRepo: TerminalRepository;

  constructor() {
    this.terminalRepo = new TerminalRepository();
  }

  async createTerminal(data: CreateTerminalDto) {
    const existing = await this.terminalRepo.findByCode(data.terminalCode);
    if (existing) {
      throw new Error(`Terminal with code ${data.terminalCode} already exists`);
    }

    return this.terminalRepo.create(data);
  }

  async getAllTerminals(params: TerminalSearchParams) {
    return this.terminalRepo.findAll(params);
  }

  async getTerminalById(id: number) {
    const terminal = await this.terminalRepo.findById(id);
    if (!terminal) throw new Error("Terminal not found");
    return terminal;
  }

  async updateTerminal(id: number, data: UpdateTerminalDto) {
    const terminal = await this.terminalRepo.findById(id);
    if (!terminal) throw new Error("Terminal not found");

    return this.terminalRepo.update(id, data);
  }

  async changeTerminalStatus(id: number, status: RecordStatus) {
    const terminal = await this.terminalRepo.findById(id);
    if (!terminal) throw new Error("Terminal not found");

    const updated = await this.terminalRepo.changeStatus(id, status);

    if (status === RecordStatus.ACTIVE) {
        websocketService.publish(WEBSOCKET_EVENTS.MACHINE_ONLINE, updated);
    } else {
        websocketService.publish(WEBSOCKET_EVENTS.MACHINE_OFFLINE, updated);
    }

    return updated;
  }
}
