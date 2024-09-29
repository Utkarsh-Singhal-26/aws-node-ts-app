import {
  CloudWatchLogsClient,
  GetLogEventsCommand,
} from "@aws-sdk/client-cloudwatch-logs";
import { Request, Response } from "express";
import { APIResponse } from "../utils/api-response";

const cloudWatchLogsClient = new CloudWatchLogsClient({
  region: process.env.AWS_REGION,
});

// Funtion to describe log events
async function describeLogEvents(req: Request, res: Response) {
  const { "app-identifier-id": appIdentifierID } = req.headers;

  try {
    if (!appIdentifierID) {
      throw new Error("Missing app-identifier-id header");
    }

    const command = new GetLogEventsCommand({
      logGroupName: process.env.CLOUDWATCH_LOG_GROUP_NAME,
      logStreamName: appIdentifierID as string,
      startFromHead: true,
    });
    const response = await cloudWatchLogsClient.send(command);
    res.status(200).json(new APIResponse(200, response));
  } catch (error) {
    res
      .status(500)
      .json(new APIResponse(500, { error }, (error as Error).message));
  }
}

export { describeLogEvents };
