import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';

/**
 * Props required to configure the Ec2Instance construct.
 *
 * All values come from sibling constructs and are wired together in AiPlayStack.
 */
interface Ec2InstanceProps {
  /** VPC to launch the instance in (from Network construct). */
  vpc: ec2.Vpc;
  /** Security group pre-configured with SSH/HTTP/HTTPS ingress rules. */
  securityGroup: ec2.SecurityGroup;
  /** ECR repository the instance will pull Docker images from. */
  ecrRepository: ecr.Repository;
  /** Secrets Manager secret holding the RDS username/password. */
  dbSecret: secretsmanager.Secret;
}

/**
 * Ec2Instance
 *
 * Provisions a single EC2 instance that acts as the application server. It
 * runs in the public subnet so it is directly addressable, and communicates
 * with RDS through the private isolated subnet via the security group rules
 * defined in the Network construct.
 *
 * Instance profile / IAM role:
 *   The instance is assigned an IAM role that grants:
 *     - AmazonSSMManagedInstanceCore  — allows SSH-free access via AWS Systems
 *       Manager Session Manager (no open port 22 required in practice).
 *     - ECR pull permissions          — granted via ecrRepository.grantPull().
 *     - Secrets Manager read          — granted via dbSecret.grantRead() so the
 *       app can retrieve DB credentials at runtime without hardcoding them.
 *
 * User data (bootstrap script, runs once on first launch):
 *   1. Updates the OS and installs Docker + unzip.
 *   2. Starts Docker and enables it on boot.
 *   3. Adds ec2-user to the docker group (no sudo needed for docker commands).
 *   4. Installs the AWS CLI v2.
 *   5. Authenticates Docker with ECR so the app can `docker pull` immediately.
 *
 * Storage:
 *   20 GB encrypted GP3 root volume. GP3 provides better baseline IOPS than GP2
 *   at the same price; encryption is on by default for compliance.
 *
 * Exposed properties:
 *   instance — the EC2 instance resource.
 *   role     — the IAM role; exposed in case additional grants are needed later.
 *
 * Stack outputs:
 *   PublicIp   — the instance's public IP address (changes on stop/start unless
 *                an Elastic IP is attached).
 *   InstanceId — the EC2 instance ID, useful for SSM Session Manager connections.
 */
export class Ec2Instance extends Construct {
  readonly instance: ec2.Instance;
  readonly role: iam.Role;

  constructor(scope: Construct, id: string, props: Ec2InstanceProps) {
    super(scope, id);

    const { vpc, securityGroup, ecrRepository, dbSecret } = props;

    // ── IAM Role ────────────────────────────────────────────────────────────
    // The instance profile grants the minimum permissions the app needs.
    // Avoid using access keys — IAM roles are automatically rotated by AWS.
    this.role = new iam.Role(this, 'InstanceRole', {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
      managedPolicies: [
        // Enables SSM Session Manager, Run Command, and Patch Manager without
        // needing an open SSH port or a bastion host.
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore'),
      ],
    });

    // Grant ECR pull access so the instance can `docker pull` images.
    ecrRepository.grantPull(this.role);

    // Grant read access to the DB credentials secret so the app can retrieve
    // the username/password at runtime via the AWS SDK or AWS CLI.
    dbSecret.grantRead(this.role);

    // ── User Data ───────────────────────────────────────────────────────────
    // This script runs as root on the first boot. It sets up Docker and the
    // AWS CLI, then authenticates with ECR so images can be pulled immediately.
    const userData = ec2.UserData.forLinux();
    userData.addCommands(
      'yum update -y',
      'yum install -y docker unzip',
      'systemctl start docker',
      'systemctl enable docker',
      // Allow ec2-user to run docker commands without sudo.
      'usermod -a -G docker ec2-user',
      // Install AWS CLI v2 (not available in Amazon Linux 2023 yum repos).
      'curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"',
      'unzip awscliv2.zip',
      './aws/install',
      // Authenticate Docker with ECR using the instance's IAM role credentials.
      // This token is valid for 12 hours; for long-running instances, add a
      // cron job to refresh it periodically.
      `aws ecr get-login-password --region ${cdk.Stack.of(this).region} | docker login --username AWS --password-stdin ${ecrRepository.repositoryUri}`
    );

    // ── EC2 Instance ────────────────────────────────────────────────────────
    this.instance = new ec2.Instance(this, 'Instance', {
      vpc,
      // Place in the public subnet so the instance is directly reachable.
      // Traffic to/from the internet is controlled by the security group.
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
      // t3.small: 2 vCPU, 2 GB RAM — sufficient for a lightweight API server.
      // Upgrade to t3.medium or larger for production workloads.
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.SMALL),
      machineImage: ec2.MachineImage.latestAmazonLinux2023(),
      securityGroup,
      role: this.role,
      userData,
      blockDevices: [
        {
          deviceName: '/dev/xvda',
          volume: ec2.BlockDeviceVolume.ebs(20, {
            volumeType: ec2.EbsDeviceVolumeType.GP3,
            encrypted: true,
            deleteOnTermination: true,
          }),
        },
      ],
    });

    new cdk.CfnOutput(this, 'PublicIp', {
      value: this.instance.instancePublicIp,
      description: 'EC2 public IP address',
    });

    new cdk.CfnOutput(this, 'InstanceId', {
      value: this.instance.instanceId,
      description: 'EC2 instance ID',
    });
  }
}
