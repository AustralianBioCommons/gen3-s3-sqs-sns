Gen3 S3-SQS-SNS Infrastructure (AWS CDK)
========================================

This AWS CDK project deploys an infrastructure stack that includes:

-   **S3 Bucket**: For Gen3 data uploads.

-   **SQS Queue**: Used by `ssjDispatcher` for processing notifications.

-   **SNS Topic**: For broadcasting S3 object creation events.

-   **S3 Event Notifications**: Configured to send object creation events to SNS.

-   **SQS Subscription to SNS**: Ensures that SQS receives S3 notifications via SNS.

Prerequisites
----------------

Before deploying, ensure you have the following installed:

-   **AWS CLI** ([Installation Guide](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html))

-   **AWS CDK v2** ([Installation Guide](https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html))

-   **Docker** (optional, for containerized deployment)

Deployment Steps
-------------------

### 1. Clone the Repository

```
git clone git@github.com:AustralianBioCommons/gen3-s3-sqs-sns.git && cd gen3-s3-sqs-sns
```

### 2. Install Dependencies

```
npm install 
```

### 3. Deploy the CDK Stack

```
cdk deploy
```

### 4. Outputs

After deployment, AWS CDK will output the ARNs of the created resources:

```
Gen3BucketARN: arn:aws:s3:::gen3-data-upload-<account>-<region>
Gen3SnsTopicARN: arn:aws:sns:<region>:<account>:gen3-s3-notifications
SSJDispatcherQueueARN: arn:aws:sqs:<region>:<account>:ssj-dispatcher-queue
```

Running in Docker
--------------------

To avoid local installations, you can build and run the CDK stack in a container.

### Build the Docker Image

```
docker build -t gen3-s3-cdk .
```

### Deployment Options
#### Using AWS Profile
```
aws sso login --profile profile-name  # (If using AWS SSO)
docker run --rm -v ~/.aws:/root/.aws -e AWS_PROFILE=profile-name gen3-s3-cdk deploy
```

### Using AWS Access Keys
```
docker run --rm \
  -e AWS_ACCESS_KEY_ID=your-access-key \
  -e AWS_SECRET_ACCESS_KEY=your-secret-key \
  -e AWS_REGION=your-region \
  gen3-s3-cdk deploy
```

Cleanup
-----------

To remove all deployed resources, run:

```
cdk destroy
```

or if using Docker
```
docker run --rm -v ~/.aws:/root/.aws -e AWS_PROFILE=profile-name gen3-s3-cdk destroy -f
```