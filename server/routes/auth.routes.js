import { Router } from "express";
import { validateSchema } from "../middleware/validateSchema.mw.js";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/auth.controller.js";

export const authRouter = Router();

authRouter.post("/register", validateSchema(registerSchema), registerUser);
authRouter.post("/login", validateSchema(loginSchema), loginUser);
authRouter.get("/logout", logoutUser);
