import { z } from "zod";

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string(),
  role: z.string().optional()
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});
