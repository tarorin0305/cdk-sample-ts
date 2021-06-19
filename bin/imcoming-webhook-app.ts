#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { SampleEc2Stack } from "../lib/sample-ec2"

async function deploy(){
  const app = new cdk.App();
  new SampleEc2Stack(app, "SampleEc2Stack")
  app.synth()
}

deploy()