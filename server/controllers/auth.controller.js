import { AppError } from "../utils/AppError.js";

export async function registerUser(req, res) {
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
    data: { email: normalizedEmail, name: name, password: passwordHash },
    select: { id: true, email: true, name: true },
  });

  return res.status(201).json(user);
}

export async function loginUser(req, res) {
  //ss
}

export async function logoutUser(req, res) {
  //ss
}
