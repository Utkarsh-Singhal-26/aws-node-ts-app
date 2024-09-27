import { Router } from "express";
import { describeEC2Instances } from "../controllers/ec2.controllers";

const router = Router();

router.route("/").get((req, res) => {
  res.send("EC2 INSTANCE ROUTE");
});

router.route("/describe").get(describeEC2Instances);

export default router;
