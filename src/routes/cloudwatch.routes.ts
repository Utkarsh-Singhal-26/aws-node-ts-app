import { Router } from "express";
import { describeLogEvents } from "../controllers/cloudwatch.controllers";

const router = Router();

router.route("/").get((req, res) => {
  res.send("CLOUDWATCH LOGS ROUTE");
});

router.route("/describe-log-events").get(describeLogEvents);

export default router;
