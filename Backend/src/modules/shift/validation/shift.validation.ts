import { z } from "zod";
import { RecordStatus } from "@prisma/client";

// Regex for HH:mm
const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

export const createShiftSchema = z.object({
  shiftCode: z.string().min(1, "Shift Code is required"),
  shiftName: z.string().min(1, "Shift Name is required"),
  startTime: z.string().regex(timeRegex, "Start time must be in HH:mm format"),
  endTime: z.string().regex(timeRegex, "End time must be in HH:mm format"),
  breakStart: z.string().regex(timeRegex, "Break start must be in HH:mm format").optional(),
  breakEnd: z.string().regex(timeRegex, "Break end must be in HH:mm format").optional(),
  status: z.nativeEnum(RecordStatus).optional(),
}).refine(data => {
  if ((data.breakStart && !data.breakEnd) || (!data.breakStart && data.breakEnd)) {
    return false;
  }
  return true;
}, {
  message: "Both breakStart and breakEnd must be provided together",
  path: ["breakStart"],
});

export const updateShiftSchema = z.object({
  shiftName: z.string().min(1).optional(),
  startTime: z.string().regex(timeRegex).optional(),
  endTime: z.string().regex(timeRegex).optional(),
  breakStart: z.string().regex(timeRegex).optional().nullable(),
  breakEnd: z.string().regex(timeRegex).optional().nullable(),
}).refine(data => {
  if (data.breakStart === null || data.breakEnd === null) return true; // allows unsetting
  if ((data.breakStart && !data.breakEnd) || (!data.breakStart && data.breakEnd)) {
    return false;
  }
  return true;
}, {
  message: "Both breakStart and breakEnd must be provided together",
  path: ["breakStart"],
});

export const changeShiftStatusSchema = z.object({
  status: z.nativeEnum(RecordStatus, { message: "Status is required" }),
});
