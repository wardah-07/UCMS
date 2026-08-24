import type { Request, Response } from "express";
import type { ClubCreationInput, Club } from "@ucms/shared";
import prisma from "../../db/prisma.js";

export async function createClub(
  req: Request<{}, {}, ClubCreationInput>,
  res: Response,
) {
  const { name, description } = req.body;

  // the creator becomes the club's first manager in the same transaction,
  // so requireClubManager already works for any follow-up route on this
  // club (e.g. creating events, adding members) without a separate step
  const club = await prisma.$transaction(async (tx) => {
    const created = await tx.club.create({
      data: { name, description },
    });

    await tx.membership.create({
      data: { userId: req.user!.id, clubId: created.id, isManager: true },
    });

    return created;
  });

  return res.status(201).json(club);
}

export async function getClubs(req: Request, res: Response<Club[]>) {
  const clubs = await prisma.club.findMany({
    select: {
      id: true,
      name: true,
      description: true,
    },
  });

  return res.json(clubs);
}

// clubs the logged-in user manages, not just belongs to as a member
export async function getMyClubs(req: Request, res: Response<Club[]>) {
  const clubs = await prisma.club.findMany({
    where: {
      memberships: { some: { userId: req.user!.id, isManager: true } },
    },
    select: {
      id: true,
      name: true,
      description: true,
    },
  });

  return res.json(clubs);
}
