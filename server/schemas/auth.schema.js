import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().trim().email("invalid email format"),
  name: z.string().trim().min(3, "name cannot be less than 3 characters"),
  password: z.string().min(8, "password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().trim().email("invalid email format"),
  password: z.string().min(8, "password must be at least 8 characters"),
});
