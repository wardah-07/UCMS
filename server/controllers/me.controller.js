import prisma from "../db/prisma.js";

export async function getMe(req, res) {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, email: true, name: true },
  });
  res.json(user);
}
