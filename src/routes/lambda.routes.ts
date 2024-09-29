import { Router } from "express";
import {
  describeLambdaFunctions,
  invokeLambda,
} from "../controllers/lambda.controllers";

const router = Router();

router.get("/", (req, res) => {
  res.send("LAMBDA FUNCTION ROUTE");
});

router.route("/list").get(describeLambdaFunctions);
router.route("/invoke").post(invokeLambda);

export default router;
