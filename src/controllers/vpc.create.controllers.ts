import {
  AttachInternetGatewayCommand,
  CreateInternetGatewayCommand,
  CreateSubnetCommand,
  CreateVpcCommand,
  EC2Client,
} from "@aws-sdk/client-ec2";
import { Request, Response } from "express";
import { APIResponse } from "../utils/api-response";

const ec2Client = new EC2Client({ region: process.env.AWS_REGION });

// Function to create a VPC
async function createVPC(req: Request, res: Response) {
  const { cidrBlock } = req.query;

  if (!cidrBlock) {
    res
      .status(400)
      .json(
        new APIResponse(400, null, "Please provide a CIDR block for the VPC")
      );
  }

  try {
    const command = new CreateVpcCommand({
      CidrBlock: cidrBlock as string,
      TagSpecifications: [
        {
          ResourceType: "vpc",
          Tags: [
            {
              Key: "Name",
              Value: "vpc-utkarsh",
            },
          ],
        },
      ],
    });
    console.log(command);
    const response = await ec2Client.send(command);
    res.status(200).json(new APIResponse(200, response));
  } catch (error) {
    res
      .status(400)
      .json(new APIResponse(400, { error }, (error as Error).message));
  }
}

// Function to create a subnet in a VPC
async function createSubnet(req: Request, res: Response) {
  const { vpcId, cidrBlock } = req.query;

  if (!vpcId || !cidrBlock) {
    res.status(400).json(new APIResponse(400, null, "Please provide a VPC ID"));
  }

  try {
    const command = new CreateSubnetCommand({
      VpcId: vpcId as string,
      CidrBlock: cidrBlock as string,
      AvailabilityZone: process.env.AWS_REGION + "a",
      TagSpecifications: [
        {
          ResourceType: "subnet",
          Tags: [
            {
              Key: "Name",
              Value: "subnet-utkarsh",
            },
          ],
        },
      ],
    });
    const response = await ec2Client.send(command);
    res.status(200).json(new APIResponse(200, response));
  } catch (error) {
    res
      .status(400)
      .json(new APIResponse(400, { error }, (error as Error).message));
  }
}

// Function to create an internet gateway and attach it to a VPC
async function createInternetGateway(req: Request, res: Response) {
  const { vpcId } = req.query;

  if (!vpcId) {
    res.status(400).json(new APIResponse(400, null, "Please provide a VPC ID"));
  }

  try {
    const command = new CreateInternetGatewayCommand({
      TagSpecifications: [
        {
          ResourceType: "internet-gateway",
          Tags: [
            {
              Key: "Name",
              Value: "ig-utkarsh",
            },
          ],
        },
      ],
    });
    const igwResponse = await ec2Client.send(command);

    const attachCommand = new AttachInternetGatewayCommand({
      InternetGatewayId: igwResponse.InternetGateway?.InternetGatewayId,
      VpcId: vpcId as string,
    });
    const response = await ec2Client.send(attachCommand);

    res.status(200).json(new APIResponse(200, response));
  } catch (error) {
    res
      .status(400)
      .json(new APIResponse(400, { error }, (error as Error).message));
  }
}

export { createInternetGateway, createSubnet, createVPC };
