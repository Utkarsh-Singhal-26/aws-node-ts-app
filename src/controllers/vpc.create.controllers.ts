import {
  AllocateAddressCommand,
  AssociateRouteTableCommand,
  AttachInternetGatewayCommand,
  CreateInternetGatewayCommand,
  CreateNatGatewayCommand,
  CreateRouteCommand,
  CreateRouteTableCommand,
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
  const { vpcId, cidrBlock, tagName, zone } = req.query;

  if (!vpcId || !cidrBlock) {
    res.status(400).json(new APIResponse(400, null, "Please provide a VPC ID"));
  }

  try {
    const command = new CreateSubnetCommand({
      VpcId: vpcId as string,
      CidrBlock: cidrBlock as string,
      AvailabilityZone: process.env.AWS_REGION + (zone as string),
      TagSpecifications: [
        {
          ResourceType: "subnet",
          Tags: [
            {
              Key: "Name",
              Value: tagName as string,
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

// Function to create an Elastic IP
async function createElasticIP(req: Request, res: Response) {
  const command = new AllocateAddressCommand({
    Domain: "vpc",
    TagSpecifications: [
      {
        ResourceType: "elastic-ip",
        Tags: [
          {
            Key: "Name",
            Value: "eip-utkarsh",
          },
        ],
      },
    ],
  });
  const response = await ec2Client.send(command);
  res.status(200).json(new APIResponse(200, response));
}

// Function to create a NAT gateway
async function createNAT(req: Request, res: Response) {
  const { subnetId, elasticIPId } = req.query;

  if (!subnetId || !elasticIPId) {
    res
      .status(400)
      .json(
        new APIResponse(400, null, "Please provide a subnet ID and EIP ID")
      );
  }

  try {
    const command = new CreateNatGatewayCommand({
      SubnetId: subnetId as string,
      AllocationId: elasticIPId as string,
      TagSpecifications: [
        {
          ResourceType: "natgateway",
          Tags: [
            {
              Key: "Name",
              Value: "nat-utkarsh",
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

// Function to create a route table
async function createRouteTable(req: Request, res: Response) {
  const { vpcId, tagName } = req.query;

  if (!vpcId || !tagName) {
    res
      .status(400)
      .json(
        new APIResponse(400, null, "Please provide a VPC ID and a tag name")
      );
  }

  try {
    const command = new CreateRouteTableCommand({
      VpcId: vpcId as string,
      TagSpecifications: [
        {
          ResourceType: "route-table",
          Tags: [
            {
              Key: "Name",
              Value: tagName as string,
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

// Function to create a route
async function createRoute(req: Request, res: Response) {
  const {
    routeTableId,
    destinationCidrBlock,
    gatewayId = null,
    natGatewayId = null,
  } = req.query;

  if (!routeTableId || !destinationCidrBlock) {
    res
      .status(400)
      .json(
        new APIResponse(
          400,
          null,
          "Please provide a route table ID, destination CIDR block, and gateway ID"
        )
      );
  }

  try {
    const command = new CreateRouteCommand({
      RouteTableId: routeTableId as string,
      DestinationCidrBlock: destinationCidrBlock as string,
      GatewayId: (gatewayId as string) || undefined,
      NatGatewayId: (natGatewayId as string) || undefined,
    });
    const response = await ec2Client.send(command);
    res.status(200).json(new APIResponse(200, response));
  } catch (error) {
    res
      .status(400)
      .json(new APIResponse(400, { error }, (error as Error).message));
  }
}

// Function to associate a route table with a subnet
async function associateRouteTable(req: Request, res: Response) {
  const { subnetId, routeTableId } = req.query;

  try {
    const command = new AssociateRouteTableCommand({
      SubnetId: subnetId as string,
      RouteTableId: routeTableId as string,
    });
    const response = await ec2Client.send(command);
    res.status(200).json(new APIResponse(200, response));
  } catch (error) {
    res
      .status(400)
      .json(new APIResponse(400, { error }, (error as Error).message));
  }
}

export {
  associateRouteTable,
  createElasticIP,
  createInternetGateway,
  createNAT,
  createRoute,
  createRouteTable,
  createSubnet,
  createVPC,
};
