import * as cdk from 'aws-cdk-lib';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as actions from 'aws-cdk-lib/aws-cloudwatch-actions';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';
import { Construct } from 'constructs';

interface MonitoringProps {
  /** EC2 instance to monitor (from Ec2Instance construct). */
  ec2Instance: ec2.Instance;
  /** RDS instance to monitor (from RdsPostgres construct). */
  rdsInstance: rds.DatabaseInstance;
  /**
   * Email address to receive alarm notifications.
   * If omitted, alarms are still created but no notifications are sent.
   * AWS will send a confirmation email — you must click the link to activate it.
   */
  alarmEmail?: string;
}

/**
 * Monitoring
 *
 * Provisions CloudWatch alarms for EC2 and RDS resources, and an SNS topic
 * that delivers alarm notifications to an email address.
 *
 * Alarms created:
 *
 *   EC2
 *   ├── CpuHigh          — CPU > 80% for two consecutive 5-minute periods
 *   └── StatusCheckFailed — Instance or system health check failure (fires immediately)
 *
 *   RDS
 *   ├── CpuHigh          — CPU > 80% for two consecutive 5-minute periods
 *   ├── LowStorage       — Free storage < 4 GB (20% of the 20 GB initial allocation)
 *   ├── LowMemory        — Freeable memory < 128 MB
 *   └── HighConnections  — Database connections > 50
 *
 * SNS topic:
 *   All alarms publish to a single SNS topic. If an alarmEmail is provided,
 *   an email subscription is added automatically.
 *
 *   Stack output:
 *     AlarmTopicArn — subscribe additional endpoints (Slack, PagerDuty, etc.)
 *                     via the AWS console or CLI after deployment.
 */
export class Monitoring extends Construct {
  readonly alarmTopic: sns.Topic;

  constructor(scope: Construct, id: string, props: MonitoringProps) {
    super(scope, id);

    const { ec2Instance, rdsInstance, alarmEmail } = props;

    // ── SNS Topic ────────────────────────────────────────────────────────────
    // All alarms publish to this single topic. Subscribers can be added at any
    // time — email, Lambda, HTTP endpoint, Slack via Chatbot, etc.
    this.alarmTopic = new sns.Topic(this, 'AlarmTopic', {
      displayName: 'AiPlay Infrastructure Alarms',
    });

    if (alarmEmail) {
      // AWS sends a confirmation email to this address. The subscription is
      // inactive until the recipient clicks the confirmation link.
      this.alarmTopic.addSubscription(new subscriptions.EmailSubscription(alarmEmail));
    }

    const alarmAction = new actions.SnsAction(this.alarmTopic);

    // ── EC2 Alarms ───────────────────────────────────────────────────────────

    // Fires when average CPU stays above 80% for 10 consecutive minutes (2 × 5 min).
    // Sustained high CPU usually means a runaway process or the instance is undersized.
    const ec2CpuAlarm = new cloudwatch.Alarm(this, 'Ec2CpuHigh', {
      alarmName: 'AiPlay-EC2-CpuHigh',
      alarmDescription: 'EC2 CPU utilisation above 80% for 10 minutes',
      metric: new cloudwatch.Metric({
        namespace: 'AWS/EC2',
        metricName: 'CPUUtilization',
        dimensionsMap: { InstanceId: ec2Instance.instanceId },
        statistic: 'Average',
        period: cdk.Duration.minutes(5),
      }),
      threshold: 80,
      evaluationPeriods: 2,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });
    ec2CpuAlarm.addAlarmAction(alarmAction);

    // Fires immediately on any instance or system health check failure.
    // A non-zero value means AWS cannot reach the instance or the OS is unresponsive.
    const ec2StatusAlarm = new cloudwatch.Alarm(this, 'Ec2StatusCheckFailed', {
      alarmName: 'AiPlay-EC2-StatusCheckFailed',
      alarmDescription: 'EC2 instance or system status check is failing',
      metric: new cloudwatch.Metric({
        namespace: 'AWS/EC2',
        metricName: 'StatusCheckFailed',
        dimensionsMap: { InstanceId: ec2Instance.instanceId },
        statistic: 'Maximum',
        period: cdk.Duration.minutes(1),
      }),
      threshold: 0,
      evaluationPeriods: 1,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });
    ec2StatusAlarm.addAlarmAction(alarmAction);

    // ── RDS Alarms ───────────────────────────────────────────────────────────

    // Fires when average RDS CPU stays above 80% for 10 consecutive minutes.
    // The t3.micro has 1 GB RAM so it will often be CPU-bound before memory.
    const rdsCpuAlarm = new cloudwatch.Alarm(this, 'RdsCpuHigh', {
      alarmName: 'AiPlay-RDS-CpuHigh',
      alarmDescription: 'RDS CPU utilisation above 80% for 10 minutes',
      metric: new cloudwatch.Metric({
        namespace: 'AWS/RDS',
        metricName: 'CPUUtilization',
        dimensionsMap: { DBInstanceIdentifier: rdsInstance.instanceIdentifier },
        statistic: 'Average',
        period: cdk.Duration.minutes(5),
      }),
      threshold: 80,
      evaluationPeriods: 2,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });
    rdsCpuAlarm.addAlarmAction(alarmAction);

    // Fires when free storage drops below 4 GB (20% of the 20 GB baseline).
    // Storage auto-scales to 100 GB, but alerting early avoids unexpected costs
    // and gives time to investigate growth before it becomes critical.
    const rdsStorageAlarm = new cloudwatch.Alarm(this, 'RdsLowStorage', {
      alarmName: 'AiPlay-RDS-LowStorage',
      alarmDescription: 'RDS free storage below 4 GB',
      metric: new cloudwatch.Metric({
        namespace: 'AWS/RDS',
        metricName: 'FreeStorageSpace',
        dimensionsMap: { DBInstanceIdentifier: rdsInstance.instanceIdentifier },
        statistic: 'Minimum',
        period: cdk.Duration.minutes(5),
      }),
      // 4 GB expressed in bytes (CloudWatch reports storage in bytes).
      threshold: 4 * 1024 * 1024 * 1024,
      evaluationPeriods: 1,
      comparisonOperator: cloudwatch.ComparisonOperator.LESS_THAN_THRESHOLD,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });
    rdsStorageAlarm.addAlarmAction(alarmAction);

    // Fires when freeable memory drops below 128 MB.
    // On the t3.micro (1 GB RAM), low memory leads to swap usage and query slowdowns.
    const rdsMemoryAlarm = new cloudwatch.Alarm(this, 'RdsLowMemory', {
      alarmName: 'AiPlay-RDS-LowMemory',
      alarmDescription: 'RDS freeable memory below 128 MB',
      metric: new cloudwatch.Metric({
        namespace: 'AWS/RDS',
        metricName: 'FreeableMemory',
        dimensionsMap: { DBInstanceIdentifier: rdsInstance.instanceIdentifier },
        statistic: 'Minimum',
        period: cdk.Duration.minutes(5),
      }),
      // 128 MB expressed in bytes.
      threshold: 128 * 1024 * 1024,
      evaluationPeriods: 1,
      comparisonOperator: cloudwatch.ComparisonOperator.LESS_THAN_THRESHOLD,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });
    rdsMemoryAlarm.addAlarmAction(alarmAction);

    // Fires when the active connection count exceeds 50.
    // The t3.micro supports ~85 max_connections by default. Sustained high
    // connection counts suggest connection pooling (e.g. pgBouncer) is needed.
    const rdsConnectionsAlarm = new cloudwatch.Alarm(this, 'RdsHighConnections', {
      alarmName: 'AiPlay-RDS-HighConnections',
      alarmDescription: 'RDS connection count above 50',
      metric: new cloudwatch.Metric({
        namespace: 'AWS/RDS',
        metricName: 'DatabaseConnections',
        dimensionsMap: { DBInstanceIdentifier: rdsInstance.instanceIdentifier },
        statistic: 'Maximum',
        period: cdk.Duration.minutes(5),
      }),
      threshold: 50,
      evaluationPeriods: 1,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });
    rdsConnectionsAlarm.addAlarmAction(alarmAction);

    // ── Output ───────────────────────────────────────────────────────────────
    new cdk.CfnOutput(this, 'AlarmTopicArn', {
      value: this.alarmTopic.topicArn,
      description: 'SNS topic ARN for infrastructure alarms — subscribe additional endpoints here',
    });
  }
}
