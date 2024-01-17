import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";

import userRouter from "./src/routers/userRouter.js";
import { dbConnect } from "./src/config/dbConfig.js";

const app = express();
const PORT = process.env.PORT || 8000;

// connect db

dbConnect();

// middlewares

app.use(cors());
app.use(express.json());
app.use(morgan("adfa"));

// local middlewares

app.use("/api/v1/user", userRouter);

app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "server is live",
  });
});

app.use((error, req, res, next) => {
  const errorCode = error.errorCode || 500;

  res.status(errorCode).json({
    status: "error",
    message: error.message,
  });
});

app.listen(PORT, (error) => {
  error
    ? console.log(error.message)
    : console.log(`Your server is running at http://localhost:${PORT}`);
});
