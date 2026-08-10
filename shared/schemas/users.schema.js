import { z } from "zod";

export const roleSchema = z.enum(["ADMIN", "ORGANIZER", "STUDENT"]);

export const userCreationSchema = z.object({
  email: z.string().trim().email("invalid email format"),
  name: z.string().trim().min(3, "name cannot be less than 3 characters"),
  password: z.string().min(8, "password must be at least 8 characters"),
  role: roleSchema,
});
