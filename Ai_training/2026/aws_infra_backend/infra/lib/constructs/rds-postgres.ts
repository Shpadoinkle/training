import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';

/**
 * Props required to configure the RdsPostgres construct.
 */
interface RdsPostgresProps {
  /** VPC to place the RDS instance in (from Network construct). */
  vpc: ec2.Vpc;
  /** Security group that restricts inbound access to port 5432 from EC2 only. */
  securityGroup: ec2.SecurityGroup;
}

/**
 * RdsPostgres
 *
 * Provisions a PostgreSQL 16 RDS instance in the isolated subnet — the most
 * locked-down tier of the VPC with no internet route in or out.
 *
 * Credentials:
 *   A Secrets Manager secret is created and auto-generates a 32-character
 *   alphanumeric password for the 'postgres' superuser. The secret is stored
 *   at the path 'ai-play/db-credentials' and is passed to the Ec2Instance
 *   construct so the EC2 IAM role is granted read access. The app retrieves
 *   credentials at runtime via the AWS SDK — no hardcoded passwords anywhere.
 *
 *   Secret JSON structure:
 *     { "username": "postgres", "password": "<generated>" }
 *
 * Storage:
 *   - 20 GB initial, auto-scales up to 100 GB as data grows (no manual resize needed).
 *   - GP3 storage type: better baseline IOPS than GP2 at the same cost.
 *   - Encrypted at rest using AWS-managed KMS key.
 *
 * Backup & availability:
 *   - 7-day automated backup window (point-in-time recovery within that window).
 *   - multiAz: false — suitable for development. Enable for production to get
 *     automatic failover to a standby instance in another AZ.
 *   - autoMinorVersionUpgrade: true — applies minor PostgreSQL patches automatically
 *     during the maintenance window.
 *
 * Removal policy:
 *   DESTROY — the instance is deleted when the stack is torn down. For production,
 *   change to RETAIN (and enable deletionProtection) to prevent accidental data loss.
 *
 * Exposed properties:
 *   instance    — the RDS database instance resource.
 *   credentials — the Secrets Manager secret; passed to Ec2Instance so the EC2
 *                 role can be granted read access.
 *
 * Stack outputs:
 *   Endpoint  — the RDS hostname (e.g. xxxx.rds.amazonaws.com). Use this as the
 *               DB_HOST in your application configuration.
 *   SecretArn — the ARN of the credentials secret, for use with the AWS SDK or CLI.
 */
export class RdsPostgres extends Construct {
  readonly instance: rds.DatabaseInstance;
  readonly credentials: secretsmanager.Secret;

  constructor(scope: Construct, id: string, props: RdsPostgresProps) {
    super(scope, id);

    const { vpc, securityGroup } = props;

    // ── Credentials ─────────────────────────────────────────────────────────
    // Secrets Manager auto-generates and stores the DB password. The secret
    // is also automatically rotated if a rotation Lambda is configured later.
    this.credentials = new secretsmanager.Secret(this, 'Credentials', {
      secretName: 'ai-play/db-credentials',
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username: 'postgres' }),
        generateStringKey: 'password',
        excludePunctuation: true, // Avoids characters that break connection string parsing.
        includeSpace: false,
        passwordLength: 32,
      },
    });

    // ── RDS Instance ─────────────────────────────────────────────────────────
    this.instance = new rds.DatabaseInstance(this, 'Instance', {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_16_3,
      }),
      // t3.micro: 2 vCPU, 1 GB RAM — fine for development and light workloads.
      // Upgrade to t3.small or larger for production query volumes.
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      vpc,
      // Isolated subnet: no internet route, reachable only from within the VPC.
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
      securityGroups: [securityGroup],
      credentials: rds.Credentials.fromSecret(this.credentials),
      databaseName: 'aiplay',
      multiAz: false,           // Set to true for production HA.
      allocatedStorage: 20,     // Initial storage in GB.
      maxAllocatedStorage: 100, // Storage auto-scales up to this limit.
      storageType: rds.StorageType.GP3,
      storageEncrypted: true,
      backupRetention: cdk.Duration.days(7),
      deletionProtection: false,          // Set to true in production.
      removalPolicy: cdk.RemovalPolicy.DESTROY, // Set to RETAIN in production.
      publiclyAccessible: false,
      autoMinorVersionUpgrade: true,
    });

    new cdk.CfnOutput(this, 'Endpoint', {
      value: this.instance.instanceEndpoint.hostname,
      description: 'RDS PostgreSQL endpoint hostname',
    });

    new cdk.CfnOutput(this, 'SecretArn', {
      value: this.credentials.secretArn,
      description: 'ARN of the Secrets Manager secret containing DB credentials',
    });
  }
}
