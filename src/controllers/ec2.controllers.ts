import { DescribeInstancesCommand, EC2Client } from "@aws-sdk/client-ec2";
import { Request, Response } from "express";
import { APIResponse } from "../utils/api-response";

// Function to describe EC2 instances
async function describeEC2Instances(req: Request, res: Response) {
  const ec2Client = new EC2Client({ region: process.env.AWS_REGION });
  const { instanceId } = req.query;

  try {
    let command = null;
    if (instanceId) {
      command = new DescribeInstancesCommand({
        InstanceIds: [instanceId as string],
      });
    } else {
      command = new DescribeInstancesCommand({});
    }
    const response = await ec2Client.send(command);
    res.status(200).json(new APIResponse(200, response));
  } catch (error) {
    res
      .status(400)
      .json(new APIResponse(400, { error }, (error as Error).message));
  }
}

export { describeEC2Instances };
