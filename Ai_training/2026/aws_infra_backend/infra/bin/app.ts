#!/usr/bin/env node
/**
 * CDK App Entry Point
 *
 * This is the top-level entry point for the AWS CDK application. It creates a CDK
 * App instance and instantiates the main AiPlayStack.
 *
 * Stack overview:
 * ┌─────────────────────────────────────────────────────────────────┐
 * │  AiPlayStack                                                    │
 * │                                                                 │
 * │  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐  │
 * │  │ Network  │    │   ECR    │    │   RDS    │    │   EC2    │  │
 * │  │          │───▶│          │    │          │    │          │  │
 * │  │ VPC      │    │ Docker   │    │ Postgres │    │ t3.small │  │
 * │  │ Subnets  │───────────────────▶│ Database │───▶│ Instance │  │
 * │  │ Sec Grps │    │ Image    │    │          │    │          │  │
 * │  └──────────┘    │ Registry │    └──────────┘    └──────────┘  │
 * │                  └──────────┘                                   │
 * └─────────────────────────────────────────────────────────────────┘
 *
 * Deployment:
 *   npx cdk bootstrap   (first time only — sets up CDK toolkit in your AWS account)
 *   npx cdk deploy      (provision all resources)
 *   npx cdk diff        (preview changes before deploying)
 *   npx cdk destroy     (tear down all resources)
 *
 * Environment:
 *   The stack resolves the target AWS account and region from environment variables
 *   CDK_DEFAULT_ACCOUNT and CDK_DEFAULT_REGION, which are set automatically when
 *   running through the CDK CLI after `aws configure` or assuming a role.
 */
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AiPlayStack } from '../lib/ai-play-stack';

const app = new cdk.App();

new AiPlayStack(app, 'AiPlayStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION ?? 'us-east-1',
  },
  description: 'AI Play backend infrastructure: ECR, EC2, and RDS PostgreSQL',
  // Update these to match your GitHub org/username and repository name.
  githubOwner: process.env.GITHUB_OWNER ?? 'YOUR_GITHUB_OWNER',
  githubRepo: process.env.GITHUB_REPO ?? 'YOUR_GITHUB_REPO',
});
