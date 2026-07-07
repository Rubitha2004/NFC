import { z } from "zod";
import { AttendanceType } from "@prisma/client";

export const tapAttendanceSchema = z.object({
  workerId: z.number().int().positive("Worker ID is required"),
  terminalId: z.number().int().positive("Terminal ID is required"),
  attendanceType: z.nativeEnum(AttendanceType, { message: "AttendanceType (IN/OUT) is required" }),
});
