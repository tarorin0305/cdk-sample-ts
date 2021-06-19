import cdk = require("@aws-cdk/core")
import ec2 = require("@aws-cdk/aws-ec2")
import {Vpc} from "@aws-cdk/aws-ec2"
export class SampleEc2Stack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    //VPC を作成
    const vpc = new Vpc(this, 'ExapmleVpc', {
      cidr: '10.0.0.0/16'
    })

    // EC2インスタンスを作成
    for(let i = 0; i < 3 ; i++){
      new ec2.CfnInstance(this, "CdkTest-"+i, {
        imageId: 'ami-0f9ae750e8274075b',
        instanceType: 't2.micro',
        subnetId: vpc.publicSubnets[0].subnetId,
        securityGroupIds: [vpc.vpcDefaultSecurityGroup],
        tags:[
          {
            key: "Name",
            value: "cdktest-"+i,
          }
        ]
      })
    }
  }
}