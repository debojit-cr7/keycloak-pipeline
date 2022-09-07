import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
import { Construct, SecretValue, Stack, StackProps } from '@aws-cdk/core';
import { CdkPipeline, SimpleSynthAction } from "@aws-cdk/pipelines";
import { CdkpipelinesDemoStage} from './cdkpipelines-demo-stage';
import { ShellScriptAction } from '@aws-cdk/pipelines';


 export class CdkpipelinesDemoPipelineStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
      super(scope, id, props);

      const sourceArtifact = new codepipeline.Artifact();
      const cloudAssemblyArtifact = new codepipeline.Artifact();

      const pipeline = new CdkPipeline(this, 'Pipeline', {
        
        pipelineName: 'MyServicePipeline',
        cloudAssemblyArtifact,

        
        sourceAction: new codepipeline_actions.GitHubSourceAction({
        actionName: 'GitHub',
        output: sourceArtifact,
        oauthToken: SecretValue.secretsManager('github-token'),
        owner: 'debojit-cr7',
        repo: 'keycloak-pipeline',
        branch: 'main'
      }),

   
      synthAction: SimpleSynthAction.standardNpmSynth({
        sourceArtifact,
        cloudAssemblyArtifact,
        
       
        buildCommand: 'npm run build'
      }),
   });
   const preprod = new CdkpipelinesDemoStage(this, 'PreProd', {
    env: { account: '361509912577', region: 'eu-west-1' }
  });
  
  const preprodStage = pipeline.addApplicationStage(preprod);
  
 /* preprodStage.addActions(new ShellScriptAction({
    actionName: 'TestService',
    useOutputs: {
      
      ENDPOINT_URL: pipeline.stackOutput(preprod.urlOutput),
    },
    commands: [
      
      'curl -Ssf $ENDPOINT_URL',
    ], 
  })); */
   
  }
}
