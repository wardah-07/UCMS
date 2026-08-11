import { Router } from "express";
import { createUser } from "../controllers/users.controller.js";
import requireAuth from "../middleware/auth/requireAuth.mw.js";
import requireRoles from "../middleware/auth/requireRoles.mw.js";
import validateSchema from "../middleware/validateSchema.mw.js";
import { userCreationSchema } from "@ucms/shared";

export const usersRouter = Router();

usersRouter.post(
  "/create",
  requireAuth,
  requireRoles(["ADMIN"]),
  validateSchema(userCreationSchema),
  createUser,
);
