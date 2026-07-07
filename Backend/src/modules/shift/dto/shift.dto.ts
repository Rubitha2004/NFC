import { z } from "zod";
import { createShiftSchema, updateShiftSchema } from "../validation/shift.validation";

export type CreateShiftDto = z.infer<typeof createShiftSchema>;
export type UpdateShiftDto = z.infer<typeof updateShiftSchema>;
