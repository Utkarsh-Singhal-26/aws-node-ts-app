import dotenv from "dotenv";
import express from "express";

import ec2Router from "./routes/ec2.routes";
import s3Router from "./routes/s3.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/ec2", ec2Router);
app.use("/s3", s3Router);

app.listen(process.env.PORT, () =>
  console.log(`Server listening on http://localhost:${PORT}`)
);
