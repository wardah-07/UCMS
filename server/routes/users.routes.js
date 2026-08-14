import { Router } from "express";
import {
  createUser,
  getUsers,
  updateUser,
} from "../controllers/users.controller.js";
import requireAuth from "../middleware/auth/requireAuth.mw.js";
import requireRoles from "../middleware/auth/requireRoles.mw.js";
import validateSchema from "../middleware/validateSchema.mw.js";
import { userCreationSchema, userUpdateSchema } from "@ucms/shared";

export const usersRouter = Router();

usersRouter.post(
  "/",
  requireAuth,
  requireRoles(["ADMIN"]),
  validateSchema(userCreationSchema),
  createUser,
);

usersRouter.get("/", requireAuth, requireRoles(["ADMIN"]), getUsers);

usersRouter.patch(
  "/:id",
  requireAuth,
  requireRoles(["ADMIN"]),
  validateSchema(userUpdateSchema),
  updateUser,
);
