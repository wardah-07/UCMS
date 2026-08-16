import { AppError } from "../utils/AppError.js";
import bcrypt from "bcrypt";
import prisma from "../db/prisma.js";

export async function createUser(req, res) {
  const { email, name, password, role } = req.body;
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
      role,
    },
    select: { id: true, email: true, name: true, role: true, isActive: true },
  });

  return res.status(201).json(user);
}

export async function getUsers(req, res) {
  const users = await prisma.user.findMany({
    orderBy: { id: "asc" },
    select: { id: true, email: true, name: true, role: true, isActive: true },
  });

  return res.status(200).json(users);
}

export async function updateUser(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    throw new AppError("invalid user id", 400);
  }

  const updates = req.body; // already validated + partial (@ucms/shared userUpdateSchema)

  if (updates.isActive === false && req.user.id === id) {
    throw new AppError("you cannot deactivate your own account", 400);
  }

  if (updates.email) {
    updates.email = updates.email.toLowerCase();
    const existingUser = await prisma.user.findUnique({
      where: { email: updates.email },
    });
    if (existingUser && existingUser.id !== id) {
      throw new AppError("email already registered", 409);
    }
  }

  const user = await prisma.user
    .update({
      where: { id },
      data: updates,
      select: { id: true, email: true, name: true, role: true, isActive: true },
    })
    .catch((err) => {
      if (err.code === "P2025") {
        throw new AppError("user not found", 404);
      }
      throw err;
    });

  return res.status(200).json(user);
}
