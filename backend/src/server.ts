import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import errorHandler from "@/middlewares/error.middleware";
import mainRouter from "@/routes/index";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use("/api/v1", mainRouter);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
