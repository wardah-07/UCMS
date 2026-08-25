import type { Request, Response } from "express";
import type { ClubCreationInput, Club, ClubUpdateInput } from "@ucms/shared";
import prisma from "../../db/prisma.js";
import { AppError } from "../../utils/AppError.js";
import type { ParamsDictionary } from "express-serve-static-core";

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

export async function getAllClubs(req: Request, res: Response<Club[]>) {
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

interface ClubIdParams extends ParamsDictionary {
  id: string;
}

export async function updateClub(
  req: Request<ClubIdParams, unknown, ClubUpdateInput>,
  res: Response<Club>,
) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    throw new AppError("invalid club id", 400);
  }

  const updates = req.body;

  const club = await prisma.club
    .update({
      where: { id },
      data: updates,
      select: { id: true, name: true, description: true },
    })
    .catch((err) => {
      if (err.code === "P2025") {
        throw new AppError("club not found", 404);
      }
      throw err;
    });

  return res.status(200).json(club);
}

export async function deleteClub(req: Request<ClubIdParams>, res: Response) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    throw new AppError("invalid club id", 400);
  }

  // the schema has no cascade on Club (memberships/events RESTRICT it), and
  // a club always has at least its creator's own manager membership, so a
  // plain `club.delete` would always fail with a foreign key violation -
  // cascade manually in one transaction instead: deleting a club takes its
  // memberships and events with it.
  await prisma
    .$transaction(async (tx) => {
      await tx.event.deleteMany({ where: { clubId: id } });
      await tx.membership.deleteMany({ where: { clubId: id } });
      await tx.club.delete({ where: { id } });
    })
    .catch((err) => {
      if (err.code === "P2025") {
        throw new AppError("club not found", 404);
      }
      throw err;
    });

  return res.status(204).send();
}
