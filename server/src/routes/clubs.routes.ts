import { Router } from "express";
import { createClub } from "../controllers/clubs.controller.js";
import requireAuth from "../middleware/auth/requireAuth.mw.js";
import requireRoles from "../middleware/auth/requireRoles.mw.js";
import validateSchema from "../middleware/validateSchema.mw.js";
import { clubCreationSchema } from "@ucms/shared";

export const clubsRouter = Router();

clubsRouter.post(
  "/",
  requireAuth,
  requireRoles(["ADMIN", "ORGANIZER"]),
  validateSchema(clubCreationSchema),
  createClub,
);
