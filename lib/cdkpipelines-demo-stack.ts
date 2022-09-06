import * as ecs from '@aws-cdk/aws-ecs';
import * as ec2 from '@aws-cdk/aws-ec2';
import ecs_patterns = require('@aws-cdk/aws-ecs-patterns');
import { DockerImageAsset } from "@aws-cdk/aws-ecr-assets";
import { join } from "path";
import { CfnOutput, Construct, Stack, StackProps } from '@aws-cdk/core';
import * as path from 'path';


export class CdkpipelinesDemoStack extends Stack {
  
  public readonly urlOutput: CfnOutput;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, "MyVPC", {
      maxAzs: 3
    });
    
    const cluster = new ecs.Cluster(this, "MyCluster", {
      vpc: vpc
    });
    
   const image = new DockerImageAsset(this, "BackendImage", {
      directory: join(__dirname, "..", "keycloak"),
    });
    
    const service= new ecs_patterns.ApplicationLoadBalancedFargateService(
      this,
      "ApplicationFargateService",
      {
        cluster: cluster,
        cpu: 256,
        desiredCount: 1,
        taskImageOptions: {
          image: ecs.ContainerImage.fromDockerImageAsset(image),
          containerPort: 8080,
        },
        memoryLimitMiB: 512,
        publicLoadBalancer: true,
      }
    );

    this.urlOutput = new CfnOutput(this, 'Url', {
      value: service.loadBalancer.loadBalancerDnsName,
    }); 
  }
}

