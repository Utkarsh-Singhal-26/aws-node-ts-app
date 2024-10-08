import dotenv from "dotenv";
import express from "express";

import { logAPI } from "./middleware/cloudwatch-logs";

import cloudWatchRouter from "./routes/cloudwatch.routes";
import ec2Router from "./routes/ec2.routes";
import lambdaRouter from "./routes/lambda.routes";
import s3Router from "./routes/s3.routes";
import vpcRouter from "./routes/vpc.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(logAPI);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/cloudwatch", cloudWatchRouter);
app.use("/ec2", ec2Router);
app.use("/s3", s3Router);
app.use("/vpc", vpcRouter);
app.use("/lambda", lambdaRouter);

app.listen(process.env.PORT, () =>
  console.log(`Server listening on http://localhost:${PORT}`)
);
