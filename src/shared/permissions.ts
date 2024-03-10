import { Context } from "../types/context";
import { UserType } from "../types/github";
import { isIssueLabelEvent } from "../types/typeguards";
import { addCommentToIssue, isUserAdminOrBillingManager } from "./issue";
import { addLabelToIssue, removeLabel } from "./label";

export async function labelAccessPermissionsCheck(context: Context) {
  if (!isIssueLabelEvent(context)) {
    context.logger.debug("Not an issue event");
    return;
  }
  const { logger, payload } = context;
  const { publicAccessControl } = context.config;
  if (!publicAccessControl.setLabel) return true;

  if (!payload.label?.name) return;
  if (payload.sender.type === UserType.Bot) return true;

  const sender = payload.sender.login;
  const repo = payload.repository;
  const sufficientPrivileges = await isUserAdminOrBillingManager(context, sender);
  // event in plain english
  const eventName = payload.action === "labeled" ? "add" : "remove";
  const labelName = payload.label.name;

  // get text before :
  const match = payload.label?.name?.split(":");
  if (match.length == 0) return;
  const labelType = match[0].toLowerCase();

  if (sufficientPrivileges) {
    logger.info("Admin and billing managers have full control over all labels", {
      repo: repo.full_name,
      user: sender,
      labelType,
    });
    return true;
  } else {
    logger.info("Checking access for labels", { repo: repo.full_name, user: sender, labelType });
    // check permission
    const { access, user } = context.adapters.supabase;
    const userId = await user.getUserId(context, sender);
    const accessible = await access.getAccess(userId);
    if (accessible) {
      return true;
    }

    if (payload.action === "labeled") {
      await removeLabel(context, labelName);
    } else if (payload.action === "unlabeled") {
      await addLabelToIssue(context, labelName);
    }

    await addCommentToIssue(context, `@${sender}, You are not allowed to ${eventName} ${labelName}`, payload.issue.number);
    logger.info("No access to edit label", { sender, label: labelName });
    return false;
  }
}
