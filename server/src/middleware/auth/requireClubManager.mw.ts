import type { NextFunction, Request, Response } from "express";
import prisma from "../../db/prisma.js";
import { AppError } from "../../utils/AppError.js";

//requires requireAuth.mw beforehand & req.params.clubId
async function requireClubManager(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const clubId = parseInt(req.params.id as string, 10);
  if (!Number.isInteger(clubId)) {
    throw new AppError("invalid club id", 400);
  }

  const userMembership = await prisma.membership.findUnique({
    where: { userId_clubId: { userId: req.user!.id, clubId: clubId } },
    select: { isManager: true },
  });

  if (!userMembership?.isManager) {
    throw new AppError("user is not a manager of this club", 403);
  }

  next();
}

export default requireClubManager;
