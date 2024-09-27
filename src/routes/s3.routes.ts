import { Router } from "express";
import multer from "multer";
import {
  getDataFromS3,
  listS3Objects,
  putDataToS3,
} from "../controllers/s3.controllers";

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.route("/").get((req, res) => {
  res.send("S3 BUCKET ROUTE");
});

router.route("/list").get(listS3Objects);
router.route("/put").post(upload.single("file"), putDataToS3);
router.route("/get").get(getDataFromS3);

export default router;
