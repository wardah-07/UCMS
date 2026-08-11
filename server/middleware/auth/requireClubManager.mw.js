import prisma from "../../db/prisma";
import { AppError } from "../../utils/AppError";

//requires requireAuth.mw beforehand & req.params.clubId
async function requireClubManager(req, res, next) {
  const reqClubId = parseInt(req.params.clubId, 10);

  const userMembership = await prisma.membership.findUnique({
    where: { userId_clubId: { userId: req.user.id, clubId: reqClubId } },
    select: { isManager: true },
  });

  if (!userMembership?.isManager) {
    throw new AppError("user is not a manager of this club", 403);
  }

  next();
}

export default requireClubManager;
