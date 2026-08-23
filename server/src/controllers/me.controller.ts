import type { Request, Response } from "express";
import prisma from "../db/prisma.js";
import { AppError } from "../utils/AppError.js";

export async function getMe(req: Request, res: Response) {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: { id: true, email: true, name: true, role: true },
  });

  if (!user) {
    throw new AppError("User not found", 401); // handles deleted-but-still-has-valid-token edge case
  }

  res.json(user);
}
