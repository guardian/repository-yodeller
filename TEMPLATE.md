Deprecating `kinesis-logback-appender`
## Deprecating `kinesis-logback-appender`

Hey ${team} members,

We're notifying you that from the 24th of November we'll be deprecating 'com.gu:kinesis-logback-appender' library, the library will continue to function but will no longer receive security updates. This library is predominantly used by Scala apps to transmit logs to ELK via a logback extension.

We've identified that your team currently owns the following repositories that uses this dependency:

${repositories}

## Migrating to `devx-logs`
We highly recommend switching to using our new log collection solution (devx-logs)[https://github.com/guardian/devx-logs] which greatly simplifies the process of transmitting logs. Unlike `kinesis-logback-agent` which has to be added as a dependency to your project, devx-logs comes pre-installed on any AMI which uses the `cdk-base` image and reads logs from your application standard output.

### Prerequisites

 - You're using one of our CDK application patterns such as `GuPlayApp`, `GuPlayWorkerApp`, or `GuNodeApp`
 - You're using systemd to run your application.

### Guide

1. Remove the `kinesis-logback-agent` dependency from your project, usually done by deleting the entry in your `build.sbt` file assuming you're using SBT / Scala.
2. Add the `cdk-base` role to your applications AMI image, this can be done via https://amigo.gutools.co.uk/recipes 
3. Ensure your logs are being sent to `stdout`and are encoded in a structured format. Take a look at the changes to `logback.xml` in [this PR](https://github.com/guardian/prism/pull/789).