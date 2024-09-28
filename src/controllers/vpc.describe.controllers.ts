import {
  DescribeInternetGatewaysCommand,
  DescribeSubnetsCommand,
  DescribeVpcsCommand,
  EC2Client,
} from "@aws-sdk/client-ec2";
import { Request, Response } from "express";
import { APIResponse } from "../utils/api-response";

const ec2Client = new EC2Client({ region: process.env.AWS_REGION });

// Function to describe VPCs
async function descibeVPCs(req: Request, res: Response) {
  const { vpcId } = req.query;

  try {
    let command = null;
    if (vpcId) {
      command = new DescribeVpcsCommand({
        VpcIds: [vpcId as string],
      });
    } else {
      command = new DescribeVpcsCommand({});
    }
    const response = await ec2Client.send(command);
    res.status(200).json(new APIResponse(200, response));
  } catch (error) {
    res
      .status(400)
      .json(new APIResponse(400, { error }, (error as Error).message));
  }
}

// Function to describe subnets
async function describeSubnets(req: Request, res: Response) {
  const { subnetId } = req.query;

  try {
    let command = null;
    if (subnetId) {
      command = new DescribeSubnetsCommand({
        SubnetIds: [subnetId as string],
      });
    } else {
      command = new DescribeSubnetsCommand({});
    }
    const response = await ec2Client.send(command);
    res.status(200).json(new APIResponse(200, response));
  } catch (error) {
    res
      .status(400)
      .json(new APIResponse(400, { error }, (error as Error).message));
  }
}

// Function to describe internet gateways
async function describeIGW(req: Request, res: Response) {
  const { igwId } = req.query;

  try {
    let command = null;
    if (igwId) {
      command = new DescribeInternetGatewaysCommand({
        InternetGatewayIds: [igwId as string],
      });
    } else {
      command = new DescribeInternetGatewaysCommand({});
    }
    const response = await ec2Client.send(command);
    res.status(200).json(new APIResponse(200, response));
  } catch (error) {
    res
      .status(400)
      .json(new APIResponse(400, { error }, (error as Error).message));
  }
}

export { descibeVPCs, describeIGW, describeSubnets };
