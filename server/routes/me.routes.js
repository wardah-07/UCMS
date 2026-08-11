import { Router } from "express";
import { getMe } from "../controllers/me.controller.js";
import requireAuth from "../middleware/auth/requireAuth.mw.js";

export const meRouter = Router();

meRouter.get("/", requireAuth, getMe);
