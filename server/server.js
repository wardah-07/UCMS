import express from "express";
import { authRouter } from "./routes/auth.routes.js";
import { errorMiddleware } from "./middleware/error.mw.js";

const app = express();
const PORT = 3003;

//mw that automatically parses incoming JSON request bodies for us to use
app.use(express.json());

app.use("/api/auth", authRouter);

//error handling middleware
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
