import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

/**
 * Props for the GitHubActionsOidc construct.
 */
interface GitHubActionsOidcProps {
  /**
   * GitHub owner (org or user) — e.g. "my-org" or "my-username".
   * Used to scope the OIDC trust policy so only your repo can assume the role.
   */
  githubOwner: string;

  /**
   * GitHub repository name — e.g. "my-repo".
   * Combined with githubOwner to form "owner/repo" in the trust condition.
   */
  githubRepo: string;

  /**
   * The branch that is allowed to deploy. Defaults to "main".
   * Only pushes to this branch will be able to assume the deploy role.
   */
  deployBranch?: string;
}

/**
 * GitHubActionsOidc
 *
 * Sets up keyless authentication between GitHub Actions and AWS using OpenID
 * Connect (OIDC), so the workflow never needs long-lived AWS credentials stored
 * as GitHub secrets.
 *
 * Resources created:
 *   1. OidcProvider  — registers GitHub's OIDC endpoint with AWS IAM once per
 *                      account/region. If one already exists you can import it
 *                      instead (see note below).
 *   2. DeployRole    — an IAM role that GitHub Actions assumes via
 *                      sts:AssumeRoleWithWebIdentity. The trust policy is scoped
 *                      to a specific repo + branch so other repos cannot assume
 *                      the role even within the same GitHub org.
 *
 * Permissions granted to DeployRole:
 *   - CloudFormation full access   — CDK deploys via CloudFormation.
 *   - IAM limited access           — CDK manages IAM roles/policies for constructs.
 *   - S3 access to CDK toolkit     — CDK stores assets in the CDKToolkit bucket.
 *   - ECR full access              — stack creates/manages an ECR repository.
 *   - EC2 full access              — stack creates VPC, subnets, security groups,
 *                                    and an EC2 instance.
 *   - RDS full access              — stack creates a PostgreSQL RDS instance.
 *   - Secrets Manager full access  — stack creates/reads a DB credentials secret.
 *   - SSM read access              — CDK bootstrap reads SSM parameters.
 *
 * Stack outputs:
 *   DeployRoleArn — paste this value into the workflow's role-to-assume field.
 *
 * NOTE: AWS only allows one OIDC provider per URL per account. If you already
 * have a GitHub OIDC provider, replace `new iam.OpenIdConnectProvider(...)` with:
 *
 *   iam.OpenIdConnectProvider.fromOpenIdConnectProviderArn(
 *     this,
 *     'OidcProvider',
 *     `arn:aws:iam::${cdk.Stack.of(this).account}:oidc-provider/token.actions.githubusercontent.com`,
 *   );
 */
export class GitHubActionsOidc extends Construct {
  readonly deployRole: iam.Role;

  constructor(scope: Construct, id: string, props: GitHubActionsOidcProps) {
    super(scope, id);

    const { githubOwner, githubRepo, deployBranch = 'main' } = props;

    // ── OIDC Provider ────────────────────────────────────────────────────────
    // Registers GitHub's token endpoint with AWS so IAM can validate tokens that
    // GitHub Actions injects into each job when `id-token: write` is set.
    const provider = new iam.OpenIdConnectProvider(this, 'OidcProvider', {
      url: 'https://token.actions.githubusercontent.com',
      // GitHub's OIDC thumbprint — stable, but check
      // https://github.blog/changelog/ if you ever see thumbprint errors.
      thumbprints: ['6938fd4d98bab03faadb97b34396831e3780aea1'],
      clientIds: ['sts.amazonaws.com'],
    });

    // ── Deploy Role ──────────────────────────────────────────────────────────
    // GitHub Actions assumes this role via sts:AssumeRoleWithWebIdentity.
    // The sub condition locks the trust to a single repo + branch.
    this.deployRole = new iam.Role(this, 'DeployRole', {
      roleName: 'GitHubActionsDeployRole',
      assumedBy: new iam.WebIdentityPrincipal(provider.openIdConnectProviderArn, {
        StringEquals: {
          'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com',
        },
        StringLike: {
          // Allow both direct branch pushes and workflow_dispatch from the same branch.
          'token.actions.githubusercontent.com:sub': `repo:${githubOwner}/${githubRepo}:ref:refs/heads/${deployBranch}`,
        },
      }),
      description: `Assumed by GitHub Actions for ${githubOwner}/${githubRepo} on branch ${deployBranch}`,
    });

    // ── Permissions ──────────────────────────────────────────────────────────
    // CDK deploys through CloudFormation, so the role needs permission to create
    // and update stacks, plus the services those stacks provision.

    this.deployRole.addToPolicy(new iam.PolicyStatement({
      sid: 'CloudFormation',
      actions: ['cloudformation:*'],
      resources: ['*'],
    }));

    // CDK bootstrap stores assets and the toolkit stack in S3.
    this.deployRole.addToPolicy(new iam.PolicyStatement({
      sid: 'S3CdkAssets',
      actions: ['s3:*'],
      resources: [
        `arn:aws:s3:::cdk-*`,
        `arn:aws:s3:::cdk-*/*`,
      ],
    }));

    // CDK bootstrap reads/writes SSM parameters to track toolkit versions.
    this.deployRole.addToPolicy(new iam.PolicyStatement({
      sid: 'SsmCdkBootstrap',
      actions: ['ssm:GetParameter', 'ssm:PutParameter'],
      resources: [`arn:aws:ssm:*:${cdk.Stack.of(this).account}:parameter/cdk-bootstrap/*`],
    }));

    // IAM — CDK creates roles/policies for EC2 instance profiles, etc.
    this.deployRole.addToPolicy(new iam.PolicyStatement({
      sid: 'Iam',
      actions: [
        'iam:CreateRole',
        'iam:DeleteRole',
        'iam:AttachRolePolicy',
        'iam:DetachRolePolicy',
        'iam:PutRolePolicy',
        'iam:DeleteRolePolicy',
        'iam:GetRole',
        'iam:GetRolePolicy',
        'iam:PassRole',
        'iam:CreateInstanceProfile',
        'iam:DeleteInstanceProfile',
        'iam:AddRoleToInstanceProfile',
        'iam:RemoveRoleFromInstanceProfile',
        'iam:TagRole',
        'iam:UntagRole',
        'iam:ListRoleTags',
        'iam:CreateOpenIDConnectProvider',
        'iam:DeleteOpenIDConnectProvider',
        'iam:GetOpenIDConnectProvider',
        'iam:TagOpenIDConnectProvider',
      ],
      resources: ['*'],
    }));

    // Services provisioned by the stack.
    this.deployRole.addToPolicy(new iam.PolicyStatement({
      sid: 'StackServices',
      actions: [
        'ecr:*',
        'ec2:*',
        'rds:*',
        'secretsmanager:*',
      ],
      resources: ['*'],
    }));

    new cdk.CfnOutput(this, 'DeployRoleArn', {
      value: this.deployRole.roleArn,
      description: 'Paste into the workflow role-to-assume field',
    });
  }
}
