import { Router } from "express";
import {
  createInternetGateway,
  createSubnet,
  createVPC,
} from "../controllers/vpc.create.controllers";
import {
  descibeVPCs,
  describeIGW,
  describeSubnets,
} from "../controllers/vpc.describe.controllers";

const router = Router();

router.route("/").get((req, res) => {
  res.send("VPC ROUTE");
});

router.route("/describe").get(descibeVPCs);
router.route("/create").post(createVPC);

router.route("/describe-subnet").get(describeSubnets);
router.route("/create-subnet").post(createSubnet);

router.route("/describe-igw").get(describeIGW);
router.route("/create-igw").post(createInternetGateway);

export default router;
