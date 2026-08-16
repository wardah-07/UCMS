import { z } from "zod";

export const roleSchema = z.enum(["ADMIN", "ORGANIZER", "STUDENT"], {
  error: "role is required",
});

// field-level rules, reused by both the creation schema (all required) and
// the update schema (all optional) so validation stays defined once
const emailField = z.string().trim().email("invalid email format");
const nameField = z
  .string()
  .trim()
  .min(3, "name cannot be less than 3 characters");
const passwordField = z
  .string()
  .min(8, "password must be at least 8 characters");

export const userCreationSchema = z.object({
  email: emailField,
  name: nameField,
  password: passwordField,
  role: roleSchema,
});

// PATCH /api/users/:id — every field optional, but whichever are present
// are validated with the same rules as creation. Password is deliberately
// excluded: changing it needs its own hashing/flow, not a generic field PATCH.
export const userUpdateSchema = z
  .object({
    email: emailField,
    name: nameField,
    role: roleSchema,
    isActive: z.boolean(),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "at least one field must be provided",
  });

// The user record as the API sends it back (id + everything selectable,
// minus password). Not a request body - nothing validates *against* this
// server-side - but worth a schema so responses can be checked at runtime
// too, not just trusted at the type level.
export const userSchema = z.object({
  id: z.number().int(),
  email: emailField,
  name: nameField,
  role: roleSchema,
  isActive: z.boolean(),
});

// Types derived from the schemas above, so shape and validation can never
// drift apart. Both client and server should import these instead of
// hand-declaring their own copies.
//
// Naming convention: "...Input" = a request body schema validates against
// (userCreationSchema, userUpdateSchema); the bare resource name = a
// response shape (userSchema). Keep new schemas in this file following the
// same split.
export type Role = z.infer<typeof roleSchema>;
export type User = z.infer<typeof userSchema>;
export type UserCreationInput = z.infer<typeof userCreationSchema>;
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;
