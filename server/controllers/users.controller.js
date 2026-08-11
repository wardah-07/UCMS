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
    select: { id: true, email: true, name: true, role: true },
  });

  return res.status(201).json(user);
}
