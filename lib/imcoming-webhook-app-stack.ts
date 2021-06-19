import cdk = require("@aws-cdk/core");
import events = require("@aws-cdk/aws-events");
import targets = require("@aws-cdk/aws-events-targets")
import * as iam from "@aws-cdk/aws-iam";
import { Function, Runtime, Code } from "@aws-cdk/aws-lambda"
import fs = require("fs")

export class ImcomingWebhookAppStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Lambda Function 作成
    const lambdaFunction: Function = new Function(this,
      "SampleIncomingWebhookApp", {
        functionName: "sample-incoming-webhook-app",
        runtime: Runtime.GO_1_X,
        //ここで Lambda Source の Path を指定
        code: Code.asset("./lambdaSource"),
        handler: "main",
        memorySize: 256,
        timeout: cdk.Duration.seconds(10),

        environment: {
          // SlackのIncomingWebhookAppのURL
          "webHookUrl": "https://hooks.slack.com/services/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",
          "slackChannel": "C025FCRTP8V"
        }
      }
    )

    //Policy を関数に付加
    lambdaFunction.addToRolePolicy(new iam.PolicyStatement({
      resources: ["*"],
      actions: ["ec2:DescribeInstances"],
    }))

    // STOP EC2 instances rule
    const ec2State = JSON.parse(fs.readFileSync('event_pattern/ec2.json',{encoding: 'utf-8'}));
    const ec2WatchRule = new events.Rule(this, 'ec2WatchRole', {
      eventPattern: {
        source: ec2State.source,
        detailType: ec2State.detailType,
        detail:ec2State.detail
      },
    });
    ec2WatchRule.addTarget(new targets.LambdaFunction(lambdaFunction));
  }
}
