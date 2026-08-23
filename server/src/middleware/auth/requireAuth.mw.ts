import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { roleSchema } from "@ucms/shared";
import { AppError } from "../../utils/AppError.js";

// jwt.verify only proves the signature is valid and the token isn't
// expired - it says nothing about the payload's shape. Parsing the
// decoded result against this schema (instead of just `as`-casting it)
// makes sure req.user is only ever set from a payload that actually
// looks like one we would have signed.
const authTokenPayloadSchema = z.object({
  userId: z.number().int(),
  role: roleSchema,
});

async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.token;

  if (!token) {
    throw new AppError("not authenticated", 401);
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new AppError("server misconfigured: missing JWT_SECRET", 500);
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    const payload = authTokenPayloadSchema.parse(decoded);
    req.user = { id: payload.userId, role: payload.role };
    next();
  } catch (err) {
    throw new AppError("invalid or expired token", 401);
  }
}

export default requireAuth;
