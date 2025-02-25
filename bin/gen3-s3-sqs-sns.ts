#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { Gen3S3SqsSnsStack } from '../lib/gen3-s3-sqs-sns-stack';

const app = new cdk.App();

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT || process.env.AWS_ACCOUNT_ID,
  region: process.env.CDK_DEFAULT_REGION || process.env.AWS_REGION || 'ap-southeast-2',
};

new Gen3S3SqsSnsStack(app, 'Gen3S3SqsSnsStack', { env });