import * as cdk from 'aws-cdk-lib';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import { Construct } from 'constructs';

/**
 * EcrRepository
 *
 * Provisions an Amazon Elastic Container Registry (ECR) repository to store
 * Docker images for the backend application.
 *
 * ECR is a fully managed, private container registry. Images are pushed here
 * from CI/CD and pulled by the EC2 instance at runtime. The EC2 IAM role is
 * granted pull access in the Ec2Instance construct.
 *
 * Configuration:
 *   - repositoryName: 'ai-play-backend' — fixed name for easy reference in
 *     CI/CD pipelines and `docker push` commands.
 *   - removalPolicy: DESTROY — the repo (and its images) are deleted when the
 *     stack is destroyed. Change to RETAIN for production to avoid accidental
 *     image loss.
 *   - autoDeleteImages: true — required alongside DESTROY; ECR rejects deletion
 *     of non-empty repositories otherwise.
 *   - lifecycleRule: keeps only the 10 most recent images to control storage costs.
 *
 * Exposed properties:
 *   repository — the ECR repository; passed to Ec2Instance so it can be granted
 *                pull access and its URI embedded in the EC2 user-data script.
 *
 * Stack output:
 *   RepositoryUri — e.g. 123456789.dkr.ecr.us-east-1.amazonaws.com/ai-play-backend
 *                   Use this URI in your docker build/push commands.
 */
export class EcrRepository extends Construct {
  readonly repository: ecr.Repository;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.repository = new ecr.Repository(this, 'Repo', {
      repositoryName: 'ai-play-backend',
      // Delete the repo and all images when the stack is destroyed.
      // Switch to RETAIN in production to protect images from accidental teardown.
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteImages: true,
      lifecycleRules: [
        {
          // Prune old images automatically to keep storage costs in check.
          description: 'Keep only the last 10 images',
          maxImageCount: 10,
        },
      ],
    });

    new cdk.CfnOutput(this, 'RepositoryUri', {
      value: this.repository.repositoryUri,
      description: 'ECR repository URI',
    });
  }
}
