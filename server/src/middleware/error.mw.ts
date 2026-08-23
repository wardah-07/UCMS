import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError.js";

function errorMiddleware(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.error(err); // always log server-side, even if you hide details from the client

  // Your own custom errors (see below)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  // Fallback — never leak stack traces or internals to the client
  return res.status(500).json({ message: "internal server error" });
}

export default errorMiddleware;
