import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as snsSubs from 'aws-cdk-lib/aws-sns-subscriptions';
import * as s3Notifications from 'aws-cdk-lib/aws-s3-notifications';
import { Construct } from 'constructs';

export class Gen3S3SqsSnsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

      // Create S3 Bucket for Gen3 Data Upload
      const dataUploadBucket = new s3.Bucket(this, 'Gen3DataUploadBucket', {
          bucketName: `gen3-data-upload-${this.account}-${this.region}`,
          removalPolicy: cdk.RemovalPolicy.RETAIN, 
          autoDeleteObjects: false, 
          eventBridgeEnabled: true, 
      });

      // Create an SQS Queue for ssjDispatcher
      const ssjDispatcherQueue = new sqs.Queue(this, 'SSJDispatcherQueue', {
          queueName: `ssj-dispatcher-queue`,
          visibilityTimeout: cdk.Duration.seconds(300), 
      });

      // Create an SNS Topic
      const snsTopic = new sns.Topic(this, 'Gen3S3NotificationsTopic', {
          topicName: `gen3-s3-notifications`,
      });

      // Subscribe SQS to SNS
      snsTopic.addSubscription(new snsSubs.SqsSubscription(ssjDispatcherQueue));

      // Configure S3 to send notifications to SNS
      dataUploadBucket.addEventNotification(
          s3.EventType.OBJECT_CREATED,
          new s3Notifications.SnsDestination(snsTopic)
      );

      // Output ARNs for reference
      new cdk.CfnOutput(this, 'Gen3BucketARN', { value: dataUploadBucket.bucketArn });
      new cdk.CfnOutput(this, 'Gen3SnsTopicARN', { value: snsTopic.topicArn });
      new cdk.CfnOutput(this, 'SSJDispatcherQueueARN', { value: ssjDispatcherQueue.queueArn });
  }
}
