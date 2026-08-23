import type { NextFunction, Request, Response } from "express";
import prisma from "../../db/prisma.js";
import { AppError } from "../../utils/AppError.js";

//requires requireAuth.mw beforehand & req.params.clubId
async function requireClubManager(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const reqClubId = parseInt(req.params.clubId as string, 10);

  const userMembership = await prisma.membership.findUnique({
    where: { userId_clubId: { userId: req.user!.id, clubId: reqClubId } },
    select: { isManager: true },
  });

  if (!userMembership?.isManager) {
    throw new AppError("user is not a manager of this club", 403);
  }

  next();
}

export default requireClubManager;
