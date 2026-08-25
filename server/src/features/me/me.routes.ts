import { Router } from "express";
import { getMe } from "./me.controller.js";
import requireAuth from "../../middleware/auth/requireAuth.mw.js";

export const meRouter = Router();

meRouter.get("/", requireAuth, getMe);
