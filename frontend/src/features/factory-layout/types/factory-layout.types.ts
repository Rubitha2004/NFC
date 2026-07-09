import type { MachineData } from "@/features/machine/types/machine.types";

export interface Floor {
  id: number;
  factoryName?: string;
  name: string;
  floorNumber: number;
  status: "ACTIVE" | "INACTIVE";
  rooms?: Room[];
  _count?: {
    rooms: number;
  };
}

export interface Room {
  id: number;
  floorId: number;
  name: string;
  roomType?: string;
  rowsCount: number;
  machinesPerRow: number;
  status: "ACTIVE" | "INACTIVE";
  floor?: Floor;
  machines?: MachineData[];
  _count?: {
    machines: number;
  };
}
