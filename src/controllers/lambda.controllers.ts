import {
  GetFunctionCommand,
  InvokeCommand,
  LambdaClient,
  ListFunctionsCommand,
} from "@aws-sdk/client-lambda";
import { Request, Response } from "express";
import { APIResponse } from "../utils/api-response";

const lambdaClient = new LambdaClient({ region: process.env.AWS_REGION });

// Function to describe Lambda functions or a specific Lambda function
async function describeLambdaFunctions(req: Request, res: Response) {
  const { functionName } = req.query;

  try {
    if (functionName) {
      const command = new GetFunctionCommand({
        FunctionName: functionName as string,
      });
      const response = await lambdaClient.send(command);
      res.status(200).json(new APIResponse(200, response));
    } else {
      const command = new ListFunctionsCommand({});
      const response = await lambdaClient.send(command);
      res.status(200).json(new APIResponse(200, response));
    }
  } catch (error) {
    res
      .status(400)
      .json(new APIResponse(400, { error }, (error as Error).message));
  }
}

// Funtion to invoke a Lambda function
async function invokeLambda(req: Request, res: Response) {
  const { functionName, payload } = req.body;

  try {
    const command = new InvokeCommand({
      FunctionName: functionName,
      Payload: Buffer.from(JSON.stringify(payload)),
    });
    const response = await lambdaClient.send(command);
    const data = JSON.parse(
      Buffer.from(response.Payload as Uint8Array).toString()
    );

    if (typeof data.body === "string") {
      data.body = JSON.parse(data.body);
    }

    res.status(200).json(new APIResponse(200, data));
  } catch (error) {
    res
      .status(400)
      .json(new APIResponse(400, { error }, (error as Error).message));
  }
}

export { describeLambdaFunctions, invokeLambda };
