import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Network } from './constructs/network';
import { EcrRepository } from './constructs/ecr-repository';
import { RdsPostgres } from './constructs/rds-postgres';
import { Ec2Instance } from './constructs/ec2-instance';
import { GitHubActionsOidc } from './constructs/github-actions-oidc';
import { Monitoring } from './constructs/monitoring';

interface AiPlayStackProps extends cdk.StackProps {
  /** GitHub owner (org or username) — used to scope the OIDC deploy role trust policy. */
  githubOwner: string;
  /** GitHub repository name — used to scope the OIDC deploy role trust policy. */
  githubRepo: string;
  /**
   * Email address to receive CloudWatch alarm notifications via SNS.
   * Optional — alarms are created regardless, but no emails are sent if omitted.
   * AWS will send a subscription confirmation email that must be accepted first.
   */
  alarmEmail?: string;
}

/**
 * AiPlayStack
 *
 * The root CloudFormation stack for the AI Play backend. It composes five
 * constructs, passing outputs from one into the inputs of the next to wire
 * up the full deployment:
 *
 *   1. GitHubActionsOidc — OIDC provider + deploy role for keyless CI auth
 *   2. Network   — VPC and security groups (must come first; everything else lives inside it)
 *   3. Ecr       — Container image registry (independent of Network, but consumed by Ec2)
 *   4. Rds       — PostgreSQL database (placed in the isolated subnet, guarded by its SG)
 *   5. Ec2       — Application server (placed in the public subnet; pulls images from ECR,
 *                  reads DB credentials from Secrets Manager)
 *
 * Dependency graph:
 *
 *   Network ──▶ Rds
 *   Network ──▶ Ec2
 *   Ecr     ──▶ Ec2
 *   Rds     ──▶ Ec2  (credentials secret passed so EC2 role is granted read access)
 */
export class AiPlayStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: AiPlayStackProps) {
    super(scope, id, props);

    const { githubOwner, githubRepo, alarmEmail } = props;

    // Set up OIDC provider and deploy role so GitHub Actions can authenticate
    // with AWS without storing long-lived credentials as secrets.
    new GitHubActionsOidc(this, 'GitHubActionsOidc', { githubOwner, githubRepo });

    // Provision the VPC and all security groups first — every other construct
    // needs a VPC reference and/or a security group to attach to.
    const network = new Network(this, 'Network');

    // Create the ECR repository independently. No VPC dependency — ECR is a
    // regional AWS service accessed over the internet or via a VPC endpoint.
    const ecr = new EcrRepository(this, 'Ecr');

    // Provision RDS inside the isolated subnet using the RDS security group.
    // Exposes `credentials` (a Secrets Manager secret) for downstream use.
    const rds = new RdsPostgres(this, 'Rds', {
      vpc: network.vpc,
      securityGroup: network.rdsSecurityGroup,
    });

    // Launch the EC2 instance in the public subnet. The construct grants the
    // instance role pull access to ECR and read access to the RDS secret.
    const ec2 = new Ec2Instance(this, 'Ec2', {
      vpc: network.vpc,
      securityGroup: network.ec2SecurityGroup,
      ecrRepository: ecr.repository,
      dbSecret: rds.credentials,
    });

    // Provision CloudWatch alarms for EC2 and RDS, with an SNS topic for
    // notifications. Alarms fire regardless of whether alarmEmail is set.
    new Monitoring(this, 'Monitoring', {
      ec2Instance: ec2.instance,
      rdsInstance: rds.instance,
      alarmEmail,
    });
  }
}
