import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";

export async function requireAuth(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    throw new AppError("not authenticated", 401);
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.userId };
    next();
  } catch (err) {
    throw new AppError("invalid or expired token", 401);
  }
}
