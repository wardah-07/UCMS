import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { authRouter } from "./routes/auth.routes.js";
import { meRouter } from "./routes/me.routes.js";
import errorMiddleware from "./middleware/error.mw.js";
import { usersRouter } from "./routes/users.routes.js";
import type { Express } from "express";

process.loadEnvFile();
const { PORT, ORIGIN } = process.env;
if (!PORT) throw new Error("PORT is not set");
if (!ORIGIN) throw new Error("ORIGIN is not set");

const app: Express = express();

app.use(
  cors({
    origin: ORIGIN,
    credentials: true,
  }),
);
app.use(cookieParser());
//mw that automatically parses incoming JSON request bodies for us to use
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/me", meRouter);
app.use("/api/users", usersRouter);

//error handling middleware
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
