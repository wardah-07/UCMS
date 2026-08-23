import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { Role } from "@ucms/shared";
import { AppError } from "../../utils/AppError.js";

interface AuthTokenPayload {
  userId: number;
  role: Role;
}

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
    const payload = jwt.verify(token, jwtSecret) as AuthTokenPayload;
    req.user = { id: payload.userId, role: payload.role };
    next();
  } catch (err) {
    throw new AppError("invalid or expired token", 401);
  }
}

export default requireAuth;
