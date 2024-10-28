import { handleComment } from "./handlers/comment";
import { watchLabelChange } from "./handlers/label-change";
import { onLabelChangeSetPricing } from "./handlers/pricing-label";
import { syncPriceLabelsToConfig } from "./handlers/sync-labels-to-config";
import { ContextPlugin } from "./types/plugin-input";

export async function run(context: ContextPlugin) {
  const { eventName, logger } = context;

  switch (eventName) {
    case "issues.opened":
    case "repository.created":
      await syncPriceLabelsToConfig(context);
      break;
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
      logger.error(`Event ${eventName} is not supported`);
  }
  return { message: "OK" };
}
