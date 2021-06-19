#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { IncomingWebhookAppStack } from '../lib/imcoming-webhook-app-stack';
import { SampleEc2Stack } from "../lib/sample-ec2"

const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function deploy(){
  //Goのソースをビルドする
  await exec('go get -v -t -d ./lambdaSource/... && ' +
    'GOOS=linux GOARCH=amd64 go build -o ' +
    './lambdaSource/main ./lambdaSource/**.go'
  );

  const app = new cdk.App();
  new SampleEc2Stack(app, "SampleEc2Stack")

  //IncomingWebhookAppStack追加
  new IncomingWebhookAppStack(app, 'IncomingWebhookAppStack');
  app.synth()

  //ビルド結果のバイナリを消去
  await exec('rm ./lambdaSource/main');
}

deploy()