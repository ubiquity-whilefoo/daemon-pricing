import * as core from "@actions/core";
import * as github from "@actions/github";
import { Octokit } from "@octokit/rest";
import { PluginInputs } from "./types/plugin-input";
import { Context } from "./types/context";
import { syncPriceLabelsToConfig } from "./handlers/sync-labels-to-config";
import { onLabelChangeSetPricing } from "./handlers/pricing-label";
import { watchLabelChange } from "./handlers/label-change";

async function run() {
  const webhookPayload = github.context.payload.inputs;
  const inputs: PluginInputs = {
    stateId: webhookPayload.stateId,
    eventName: webhookPayload.eventName,
    eventPayload: JSON.parse(webhookPayload.eventPayload),
    settings: JSON.parse(webhookPayload.settings),
    authToken: webhookPayload.authToken,
    ref: webhookPayload.ref,
  };
  const octokit = new Octokit({ auth: inputs.authToken });

  const context: Context = {
    eventName: inputs.eventName,
    payload: inputs.eventPayload,
    config: inputs.settings,
    octokit,
    logger: {
      debug(message: unknown, ...optionalParams: unknown[]) {
        console.debug(message, ...optionalParams);
      },
      info(message: unknown, ...optionalParams: unknown[]) {
        console.log(message, ...optionalParams);
      },
      warn(message: unknown, ...optionalParams: unknown[]) {
        console.warn(message, ...optionalParams);
      },
      error(message: unknown, ...optionalParams: unknown[]) {
        console.error(message, ...optionalParams);
      },
      fatal(message: unknown, ...optionalParams: unknown[]) {
        console.error(message, ...optionalParams);
      },
    },
  };

  const eventName = inputs.eventName;
  switch (eventName) {
    case "issues.labeled" || "issues.unlabeled":
      await syncPriceLabelsToConfig(context);
      await onLabelChangeSetPricing(context);
      break;
    case "label.edited":
      await watchLabelChange(context);
      break;
    default:
      throw new Error(`Event ${eventName} is not supported`);
  }
}

run()
  .then((result) => core.setOutput("result", result))
  .catch((error) => {
    console.error(error);
    core.setFailed(error);
  });
