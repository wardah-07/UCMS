import express from "express";
import cookieParser from "cookie-parser";
import { authRouter } from "./routes/auth.routes.js";
import { meRouter } from "./routes/me.routes.js";
import { errorMiddleware } from "./middleware/error.mw.js";

const app = express();
const PORT = 3003;

app.use(cookieParser());
//mw that automatically parses incoming JSON request bodies for us to use
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/me", meRouter);

//error handling middleware
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
