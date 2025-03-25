import { Context } from "../types/context";
import { UserType } from "../types/github";
import { isIssueLabelEvent } from "../types/typeguards";
import { isUserAdminOrBillingManager } from "./issue";

export async function labelAccessPermissionsCheck(context: Context) {
  if (!isIssueLabelEvent(context)) {
    context.logger.debug("Not an issue event");
    return false;
  }
  const { logger, payload } = context;
  const { shouldFundContributorClosedIssue } = context.config;
  if (!payload.label?.name) return false;

  if (shouldFundContributorClosedIssue) {
    logger.info("Fund contributor closed issue is enabled for setting labels");
    return true;
  }
  if (payload.sender?.type === UserType.Bot) {
    logger.info("Bot has full control over all labels");
    return true;
  }

  const sender = payload.sender?.login;
  if (!sender) {
    throw logger.error("No sender found in the payload");
  }

  const repo = payload.repository;
  const sufficientPrivileges = await isUserAdminOrBillingManager(context, sender);

  // get text before :
  const match = payload.label?.name?.split(":");
  // We can ignore custom labels which are not like Label: <value>
  if (match.length <= 1) return false;
  const labelType = match[0].toLowerCase();

  if (sufficientPrivileges) {
    logger.info("Admin and billing managers have full control over all labels", {
      repo: repo.full_name,
      user: sender,
      labelType,
    });
    return true;
  }
  return false;
}
