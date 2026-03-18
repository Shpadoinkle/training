import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

/**
 * Network
 *
 * Provisions the foundational networking layer for the stack. All other
 * constructs are deployed inside this VPC.
 *
 * VPC layout (spread across 2 Availability Zones):
 *
 *   ┌─────────────────────────────────────────────────────┐
 *   │  VPC                                                │
 *   │                                                     │
 *   │  ┌───────────────┐  ┌───────────────────────────┐  │
 *   │  │ Public subnet │  │ Private subnet (egress)   │  │
 *   │  │               │  │                           │  │
 *   │  │  EC2 instance │  │  (future ECS / Lambda)    │  │
 *   │  │  NAT Gateway  │  │  routes outbound via NAT  │  │
 *   │  └───────────────┘  └───────────────────────────┘  │
 *   │  ┌─────────────────────────────────────────────┐   │
 *   │  │ Isolated subnet (no internet route at all)  │   │
 *   │  │                                             │   │
 *   │  │  RDS PostgreSQL                             │   │
 *   │  └─────────────────────────────────────────────┘   │
 *   └─────────────────────────────────────────────────────┘
 *
 * Security groups:
 *   - ec2SecurityGroup  — attached to the EC2 instance; allows inbound SSH (22),
 *                         HTTP (80), and HTTPS (443) from anywhere.
 *   - rdsSecurityGroup  — attached to the RDS instance; allows inbound PostgreSQL
 *                         (5432) only from ec2SecurityGroup, nothing else.
 *
 * Exposed properties (consumed by other constructs):
 *   vpc              — passed into every construct that needs a network home
 *   ec2SecurityGroup — attached to the EC2 instance
 *   rdsSecurityGroup — attached to the RDS instance
 */
export class Network extends Construct {
  readonly vpc: ec2.Vpc;
  readonly ec2SecurityGroup: ec2.SecurityGroup;
  readonly rdsSecurityGroup: ec2.SecurityGroup;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    // ── VPC ────────────────────────────────────────────────────────────────
    // A single NAT Gateway keeps costs low. For production HA, increase to
    // match the number of AZs so each AZ has its own NAT.
    this.vpc = new ec2.Vpc(this, 'Vpc', {
      maxAzs: 2,
      natGateways: 1,
      subnetConfiguration: [
        {
          // Internet-facing subnet — EC2 instance and NAT Gateway live here.
          name: 'Public',
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: 24,
        },
        {
          // Outbound-only subnet — reserved for workloads that need internet
          // egress (e.g. pulling packages) but should not be directly reachable.
          name: 'Private',
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
          cidrMask: 24,
        },
        {
          // Completely isolated subnet — no inbound or outbound internet route.
          // RDS is placed here so the database is never directly reachable from
          // outside the VPC.
          name: 'Isolated',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
          cidrMask: 24,
        },
      ],
    });

    // ── EC2 Security Group ──────────────────────────────────────────────────
    // Allows all outbound traffic so the instance can pull packages, Docker
    // images, and reach AWS APIs. Inbound is restricted to web + SSH ports.
    // NOTE: In production, restrict SSH (port 22) to a specific IP range or
    // remove it entirely and rely on AWS Systems Manager Session Manager.
    this.ec2SecurityGroup = new ec2.SecurityGroup(this, 'Ec2SecurityGroup', {
      vpc: this.vpc,
      description: 'Security group for EC2 instance',
      allowAllOutbound: true,
    });

    this.ec2SecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'Allow SSH');
    this.ec2SecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80), 'Allow HTTP');
    this.ec2SecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(443), 'Allow HTTPS');

    // ── RDS Security Group ──────────────────────────────────────────────────
    // Locked down to accept PostgreSQL connections only from the EC2 security
    // group. `allowAllOutbound: false` ensures no unintended outbound traffic
    // can originate from the database instance.
    this.rdsSecurityGroup = new ec2.SecurityGroup(this, 'RdsSecurityGroup', {
      vpc: this.vpc,
      description: 'Security group for RDS instance',
      allowAllOutbound: false,
    });

    this.rdsSecurityGroup.addIngressRule(
      this.ec2SecurityGroup,
      ec2.Port.tcp(5432),
      'Allow PostgreSQL from EC2'
    );

    // Output the VPC ID so it can be referenced when importing resources
    // into other stacks or when debugging in the AWS console.
    new cdk.CfnOutput(this, 'VpcId', {
      value: this.vpc.vpcId,
      description: 'VPC ID',
    });
  }
}
