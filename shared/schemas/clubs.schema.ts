import { z } from "zod";

export const clubSchema = z.object({
  id: z.number().int(),
  name: z.string().trim().min(3, "name cannot be less than 3 characters"),
  description: z.string().nullable(),
});

export const clubCreationSchema = z.object({
  name: z.string().trim().min(3, "name cannot be less than 3 characters"),
  description: z.string().trim().nullable().optional(),
});

export type Club = z.infer<typeof clubSchema>;
export type ClubCreationInput = z.infer<typeof clubCreationSchema>;
