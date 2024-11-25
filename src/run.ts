import { commandHandlers, handleComment } from "./handlers/comment";
import { globalLabelUpdate } from "./handlers/global-config-update";
import { watchLabelChange } from "./handlers/label-change";
import { onLabelChangeSetPricing } from "./handlers/pricing-label";
import { syncPriceLabelsToConfig } from "./handlers/sync-labels-to-config";
import { Context } from "./types/context";
import { isIssueLabelEvent } from "./types/typeguards";

export async function run(context: Context) {
  const { eventName, logger } = context;

  if (context.command) {
    await commandHandlers[context.command.name](context, {
      username: context.command.parameters.username,
      labels: context.command.parameters.labelTypes,
      command: context.command.name,
    });
    return;
  }

  switch (eventName) {
    case "issues.opened":
    case "repository.created":
      await syncPriceLabelsToConfig(context);
      break;
    case "issues.labeled":
    case "issues.unlabeled":
      if (isIssueLabelEvent(context)) {
        await syncPriceLabelsToConfig(context);
        await onLabelChangeSetPricing(context);
      }
      break;
    case "label.edited":
      await watchLabelChange(context);
      break;
    case "issue_comment.created":
      await handleComment(context);
      break;
    case "push":
      await globalLabelUpdate(context);
      break;
    default:
      logger.error(`Event ${eventName} is not supported`);
  }
  return { message: "OK" };
}
