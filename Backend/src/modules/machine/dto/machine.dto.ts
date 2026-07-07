import { z } from "zod";
import { createMachineSchema, updateMachineSchema } from "../validation/machine.validation";

export type CreateMachineDto = z.infer<typeof createMachineSchema>;
export type UpdateMachineDto = z.infer<typeof updateMachineSchema>;
