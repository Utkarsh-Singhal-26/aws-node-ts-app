import {
  CloudWatchLogsClient,
  CreateLogStreamCommand,
  DescribeLogStreamsCommand,
  PutLogEventsCommand,
} from "@aws-sdk/client-cloudwatch-logs";
import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { APIResponse } from "../utils/api-response";

const cloudWatchLogsClient = new CloudWatchLogsClient({
  region: process.env.AWS_REGION,
});

// Helper function to ensure a log group and log stream exist
async function ensureLogGroupExists(
  logGroupName: string,
  logStreamName: string
) {
  try {
    const describeCommand = new DescribeLogStreamsCommand({
      logGroupName,
      logStreamNamePrefix: logStreamName,
    });
    const describeResponse = await cloudWatchLogsClient.send(describeCommand);

    if (describeResponse.logStreams?.length === 0) {
      const createCommand = new CreateLogStreamCommand({
        logGroupName,
        logStreamName,
      });
      await cloudWatchLogsClient.send(createCommand);
    }
  } catch (error) {
    throw error;
  }
}

// Middleware to log API requests and responses to CloudWatch Logs
async function logAPI(req: Request, res: Response, next: NextFunction) {
  const { "app-identifier-id": appIdentifierID } = req.headers;

  try {
    if (!appIdentifierID) {
      throw new Error("Missing app-identifier-id header");
    }

    const requestId = uuidv4();
    const startTime = new Date();
    const originalStatus = res.status;

    const logGroupName = process.env.CLOUDWATCH_LOG_GROUP_NAME as string;
    const logStreamName = appIdentifierID as string;

    await ensureLogGroupExists(logGroupName, logStreamName);

    const logToCloudWatch = (responseBody?: any) => {
      const logEvent = {
        timestamp: new Date().getTime(),
        message: JSON.stringify({
          requestId,
          method: req.method,
          url: req.originalUrl,
          headers: req.headers,
          body: req.body,
          query: req.query,
          params: req.params,
          responseBody,
          responseTime: new Date().getTime() - startTime.getTime(),
          statusCode: res.statusCode,
        }),
      };

      const command = new PutLogEventsCommand({
        logGroupName,
        logStreamName,
        logEvents: [logEvent],
      });

      cloudWatchLogsClient.send(command).catch(console.error);
    };

    res.status = function (code: number) {
      const result = originalStatus.call(this, code);
      const originalJson = result.json;
      result.json = function (body: any) {
        logToCloudWatch(body);
        return originalJson.call(this, body);
      };
      return result;
    };

    next();
  } catch (error) {
    res
      .status(500)
      .json(new APIResponse(500, { error }, (error as Error).message));
  }
}

export { logAPI };
