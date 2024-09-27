import {
  GetObjectCommand,
  ListBucketsCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { Request, Response } from "express";
import { APIResponse } from "../utils/api-response";

const s3Client = new S3Client({ region: process.env.AWS_REGION });

// Function to list S3 objects
async function listS3Objects(req: Request, res: Response) {
  const { bucketName } = req.query;

  try {
    let response = null;
    if (bucketName) {
      const command = new ListObjectsV2Command({
        Bucket: bucketName as string,
      });
      response = await s3Client.send(command);
      res.status(200).json(new APIResponse(200, response));
    } else {
      const command = new ListBucketsCommand();
      response = await s3Client.send(command);
      res.status(200).json(new APIResponse(200, response));
    }
  } catch (error) {
    res
      .status(400)
      .json(new APIResponse(400, { error }, (error as Error).message));
  }
}

// Function to put data to S3 bucket
async function putDataToS3(req: Request, res: Response) {
  const { bucketName } = req.query;
  const file = req.file;

  if (!bucketName || !file) {
    res
      .status(400)
      .json(
        new APIResponse(
          400,
          {},
          "Please provide both bucketName and data in the query params and request body"
        )
      );
  }

  try {
    const command = new PutObjectCommand({
      Bucket: bucketName as string,
      Key: file!.originalname as string,
      Body: file!.buffer,
    });
    const response = await s3Client.send(command);
    res.status(200).json(new APIResponse(200, response));
  } catch (error) {
    res
      .status(400)
      .json(new APIResponse(400, { error }, (error as Error).message));
  }
}

// Function to get data from S3 bucket using key and bucket name
async function getDataFromS3(req: Request, res: Response) {
  const { bucketName, key } = req.query;

  if (!bucketName || !key) {
    res
      .status(400)
      .json(
        new APIResponse(
          400,
          {},
          "Please provide both bucketName and key in the query params"
        )
      );
  }

  try {
    const command = new GetObjectCommand({
      Bucket: bucketName as string,
      Key: key as string,
    });
    const response = await s3Client.send(command);
    const bodyStream = response.Body as NodeJS.ReadableStream;
    bodyStream.pipe(res);
  } catch (error) {
    res
      .status(400)
      .json(new APIResponse(400, { error }, (error as Error).message));
  }
}

export { getDataFromS3, listS3Objects, putDataToS3 };
