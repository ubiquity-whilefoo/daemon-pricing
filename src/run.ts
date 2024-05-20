import { Octokit } from "@octokit/rest";
import { createClient } from "@supabase/supabase-js";
import { createAdapters } from "./adapters";
import { handleComment } from "./handlers/comment";
import { watchLabelChange } from "./handlers/label-change";
import { onLabelChangeSetPricing } from "./handlers/pricing-label";
import { syncPriceLabelsToConfig } from "./handlers/sync-labels-to-config";
import { Context } from "./types/context";
import { Env } from "./types/env";
import { PluginInputs } from "./types/plugin-input";

export async function run(inputs: PluginInputs, env: Env) {
  const octokit = new Octokit({ auth: inputs.authToken });
  const supabaseClient = createClient(env.SUPABASE_URL, env.SUPABASE_KEY);

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
    adapters: {} as ReturnType<typeof createAdapters>,
  };
  context.adapters = createAdapters(supabaseClient, context);

  const eventName = inputs.eventName;
  switch (eventName) {
    case "issues.labeled":
    case "issues.unlabeled":
      await syncPriceLabelsToConfig(context);
      await onLabelChangeSetPricing(context);
      break;
    case "label.edited":
      await watchLabelChange(context);
      break;
    case "issue_comment.created":
      await handleComment(context);
      break;
    default:
      context.logger.warn(`Event ${eventName} is not supported`);
  }
}

// run()
//   .then((result) => core.setOutput("result", result))
//   .catch((error) => {
//     console.error(error);
//     core.setFailed(error);
//   });
