import { Router } from "express";
import {
  associateRouteTable,
  createElasticIP,
  createInternetGateway,
  createNAT,
  createRoute,
  createRouteTable,
  createSubnet,
  createVPC,
} from "../controllers/vpc.create.controllers";
import {
  describeElasticIPS,
  describeIGW,
  describeNAT,
  describeRouteTables,
  describeSubnets,
  describeVPCs,
} from "../controllers/vpc.describe.controllers";

const router = Router();

router.route("/").get((req, res) => {
  res.send("VPC ROUTE");
});

router.route("/describe").get(describeVPCs);
router.route("/create").post(createVPC);

router.route("/describe-subnet").get(describeSubnets);
router.route("/create-subnet").post(createSubnet);

router.route("/describe-igw").get(describeIGW);
router.route("/create-igw").post(createInternetGateway);

router.route("/describe-eip").get(describeElasticIPS);
router.route("/create-eip").get(createElasticIP);

router.route("/describe-nat").get(describeNAT);
router.route("/create-nat").post(createNAT);

router.route("/describe-route-table").get(describeRouteTables);
router.route("/create-route-table").post(createRouteTable);
router.route("/create-route").post(createRoute);
router.route("/associate-route-table").post(associateRouteTable);

export default router;
