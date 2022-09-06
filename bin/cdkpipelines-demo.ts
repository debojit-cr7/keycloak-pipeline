#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkpipelinesDemoPipelineStack } from '../lib/cdkpipelines-demo-pipeline-stack';
 const app = new cdk.App();
new CdkpipelinesDemoPipelineStack(app, 'CdkpipelinesDemoPipelineStack', {
     env: { account: '361509912577', region: 'eu-west-1' },
});
