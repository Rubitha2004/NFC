import { z } from "zod";
import { createOperationSchema, updateOperationSchema } from "../validation/operation.validation";

export type CreateOperationDto = z.infer<typeof createOperationSchema>;
export type UpdateOperationDto = z.infer<typeof updateOperationSchema>;
