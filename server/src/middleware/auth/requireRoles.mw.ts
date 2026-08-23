import type { NextFunction, Request, Response } from "express";
import type { Role } from "@ucms/shared";
import { AppError } from "../../utils/AppError.js";

//requires "requireAuth.mw" to be used beforehand
function requireRoles(allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError("not authenticated", 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError("Action not allowed for this user role", 403);
    }

    next();
  };
}

export default requireRoles;
