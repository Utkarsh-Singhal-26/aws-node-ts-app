import {
  DescribeAddressesCommand,
  DescribeInternetGatewaysCommand,
  DescribeNatGatewaysCommand,
  DescribeRouteTablesCommand,
  DescribeSubnetsCommand,
  DescribeVpcsCommand,
  EC2Client,
} from "@aws-sdk/client-ec2";
import { Request, Response } from "express";
import { APIResponse } from "../utils/api-response";

const ec2Client = new EC2Client({ region: process.env.AWS_REGION });

// Function to describe VPCs
async function describeVPCs(req: Request, res: Response) {
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

// Function to describe elastic IPs
async function describeElasticIPS(req: Request, res: Response) {
  const { publicIp } = req.query;

  try {
    let command = null;
    if (publicIp) {
      command = new DescribeAddressesCommand({
        PublicIps: [publicIp as string],
      });
    } else {
      command = new DescribeAddressesCommand({});
    }
    const response = await ec2Client.send(command);
    res.status(200).json(new APIResponse(200, response));
  } catch (error) {
    res
      .status(400)
      .json(new APIResponse(400, { error }, (error as Error).message));
  }
}

// Function to describe NAT gateways
async function describeNAT(req: Request, res: Response) {
  const { natId } = req.query;

  try {
    let command = null;
    if (natId) {
      command = new DescribeNatGatewaysCommand({
        NatGatewayIds: [natId as string],
      });
    } else {
      command = new DescribeNatGatewaysCommand({});
    }
    const response = await ec2Client.send(command);
    res.status(200).json(new APIResponse(200, response));
  } catch (error) {
    res
      .status(400)
      .json(new APIResponse(400, { error }, (error as Error).message));
  }
}

// Function to describe route tables
async function describeRouteTables(req: Request, res: Response) {
  const { routeTableId } = req.query;

  try {
    let command = null;
    if (routeTableId) {
      command = new DescribeRouteTablesCommand({
        RouteTableIds: [routeTableId as string],
      });
    } else {
      command = new DescribeRouteTablesCommand({});
    }
    const response = await ec2Client.send(command);
    res.status(200).json(new APIResponse(200, response));
  } catch (error) {
    res
      .status(400)
      .json(new APIResponse(400, { error }, (error as Error).message));
  }
}

export {
  describeElasticIPS,
  describeIGW,
  describeNAT,
  describeRouteTables,
  describeSubnets,
  describeVPCs,
};
