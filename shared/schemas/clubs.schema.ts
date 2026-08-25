import { z } from "zod";

const idField = z.number().int();
const nameField = z
  .string()
  .trim()
  .min(3, "name cannot be less than 3 characters");
const descriptionField = z.string().nullable().optional();

export const clubSchema = z.object({
  id: idField,
  name: nameField,
  description: descriptionField,
});

export const clubCreationSchema = z.object({
  name: nameField,
  description: descriptionField,
});

export const clubUpdateSchema = z
  .object({
    name: nameField,
    description: descriptionField,
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "at least one field must be provided",
  });

export type Club = z.infer<typeof clubSchema>;
export type ClubCreationInput = z.infer<typeof clubCreationSchema>;
export type ClubUpdateInput = z.infer<typeof clubUpdateSchema>;
