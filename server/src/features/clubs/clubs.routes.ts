import { Router } from "express";
import {
  createClub,
  deleteClub,
  getAllClubs,
  getMyClubs,
  updateClub,
} from "./clubs.controller.js";
import requireAuth from "../../middleware/auth/requireAuth.mw.js";
import requireRoles from "../../middleware/auth/requireRoles.mw.js";
import validateSchema from "../../middleware/validateSchema.mw.js";
import { clubCreationSchema, clubUpdateSchema } from "@ucms/shared";
import requireClubManager from "../../middleware/auth/requireClubManager.mw.js";

export const clubsRouter = Router();

clubsRouter.post(
  "/",
  requireAuth,
  requireRoles(["ADMIN", "ORGANIZER"]),
  validateSchema(clubCreationSchema),
  createClub,
);

clubsRouter.get("/mine", requireAuth, getMyClubs);
clubsRouter.get("/", getAllClubs);

clubsRouter.patch(
  "/:id",
  requireAuth,
  requireClubManager,
  validateSchema(clubUpdateSchema),
  updateClub,
);

clubsRouter.delete("/:id", requireAuth, requireClubManager, deleteClub);
