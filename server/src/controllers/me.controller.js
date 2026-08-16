import prisma from "../db/prisma.js";

export async function getMe(req, res) {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, email: true, name: true, role: true },
  });

  if (!user) {
    throw new AppError("User not found", 401); // handles deleted-but-still-has-valid-token edge case
  }

  res.json(user);
}
