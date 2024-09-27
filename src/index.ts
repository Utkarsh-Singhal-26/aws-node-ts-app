import dotenv from "dotenv";
import express from "express";
import { describeEC2Instances } from "./functions";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/ec2", async (req, res) => {
  describeEC2Instances(req, res);
});

app.listen(process.env.PORT, () =>
  console.log(`Server listening on http://localhost:${PORT}`)
);
