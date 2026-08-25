import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import type { RegisterInput, LoginInput } from "@ucms/shared";
import { AppError } from "../../utils/AppError.js";
import prisma from "../../db/prisma.js";

export async function registerUser(
  req: Request<{}, {}, RegisterInput>,
  res: Response,
) {
  const { email, name, password } = req.body; // already validated by middleware
  const normalizedEmail = email.toLowerCase();

  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });
  if (existingUser) {
    throw new AppError("email already registered", 409);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email: normalizedEmail,
      name,
      password: passwordHash,
    },
    select: { id: true, email: true, name: true },
  });

  return res.status(201).json(user);
}

export async function loginUser(req: Request<{}, {}, LoginInput>, res: Response) {
  const { email, password } = req.body; // validated by Zod middleware already
  const normalizedEmail = email.toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    throw new AppError("invalid email or password", 401);
  }

  const passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    throw new AppError("invalid email or password", 401);
  }

  if (!user.isActive) {
    throw new AppError("this account has been deactivated", 403);
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new AppError("server misconfigured: missing JWT_SECRET", 500);
  }

  const token = jwt.sign({ userId: user.id, role: user.role }, jwtSecret, {
    expiresIn: "15m",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 15 * 60 * 1000,
  });

  return res.status(200).json({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });
}

export async function logoutUser(req: Request, res: Response) {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return res.status(200).json({ message: "logged out" });
}
