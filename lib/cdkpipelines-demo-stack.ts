import * as ecs from '@aws-cdk/aws-ecs';
import * as ec2 from '@aws-cdk/aws-ec2';
import ecs_patterns = require('@aws-cdk/aws-ecs-patterns');

import { CfnOutput, Construct, Stack, StackProps } from '@aws-cdk/core';
import * as path from 'path';

/**
 * A stack for our simple Application Load Balanced Fargate Service
 */
export class CdkpipelinesDemoStack extends Stack {
  /**
   * The DNS endpoint of the LoadBalancer
   */
  public readonly urlOutput: CfnOutput;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, "MyVPC", {
      maxAzs: 3
    });
    
    const cluster = new ecs.Cluster(this, "MyCluster", {
      vpc: vpc
    });
    
    const service = new ecs_patterns.ApplicationLoadBalancedFargateService(this, "MyFargateService", {
      cluster: cluster,
      cpu: 512,
      desiredCount: 2,
      taskImageOptions:{
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample')
      },
      memoryLimitMiB: 2048,
      publicLoadBalancer: true
    });

    this.urlOutput = new CfnOutput(this, 'Url', {
      value: service.loadBalancer.loadBalancerDnsName,
    });
  }
}

