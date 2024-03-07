import { Context } from "../types/context";
import { Label, UserType } from "../types/github";
import { addCommentToIssue, isUserAdminOrBillingManager } from "./issue";

// cspell:disable
const COLORS = { default: "ededed", price: "1f883d" };
// cspell:enable

export async function listLabelsForRepo(context: Context): Promise<Label[]> {
  const payload = context.payload;

  const res = await context.octokit.rest.issues.listLabelsForRepo({
    owner: payload.repository.owner.login,
    repo: payload.repository.name,
    per_page: 100,
    page: 1,
  });

  if (res.status === 200) {
    return res.data;
  }

  throw context.logger.fatal("Failed to fetch lists of labels", { status: res.status });
}

export async function createLabel(context: Context, name: string, labelType = "default" as keyof typeof COLORS): Promise<void> {
  const payload = context.payload;

  await context.octokit.rest.issues.createLabel({
    owner: payload.repository.owner.login,
    repo: payload.repository.name,
    name,
    color: COLORS[labelType],
  });
}

export async function removeLabel(context: Context, name: string) {
  const payload = context.payload;
  if (!("issue" in payload) || !payload.issue) {
    context.logger.debug("Not an issue event");
    return;
  }

  try {
    await context.octokit.issues.removeLabel({
      owner: payload.repository.owner.login,
      repo: payload.repository.name,
      issue_number: payload.issue.number,
      name: name,
    });
  } catch (e: unknown) {
    context.logger.fatal("Removing label failed!", e);
  }
}

export async function clearAllPriceLabelsOnIssue(context: Context) {
  const payload = context.payload;
  if (!("issue" in payload) || !payload.issue) {
    context.logger.debug("Not an issue event");
    return;
  }

  const labels = payload.issue.labels;
  if (!labels) return;
  const issuePrices = labels.filter((label) => label.name.toString().startsWith("Price: "));

  if (!issuePrices.length) return;

  try {
    await context.octokit.issues.removeLabel({
      owner: payload.repository.owner.login,
      repo: payload.repository.name,
      issue_number: payload.issue.number,
      name: issuePrices[0].name,
    });
  } catch (e: unknown) {
    context.logger.fatal("Clearing all price labels failed!", e);
  }
}

export async function addLabelToIssue(context: Context, labelName: string) {
  const payload = context.payload;
  if (!("issue" in payload) || !payload.issue) {
    context.logger.debug("Not an issue event");
    return;
  }

  try {
    await context.octokit.issues.addLabels({
      owner: payload.repository.owner.login,
      repo: payload.repository.name,
      issue_number: payload.issue.number,
      labels: [labelName],
    });
  } catch (e: unknown) {
    context.logger.fatal("Adding a label to issue failed!", e);
  }
}

export async function labelAccessPermissionsCheck(context: Context) {
  const { logger, payload } = context;
  const { publicAccessControl } = context.config;
  if (!publicAccessControl.setLabel) return true;

  if (!("issue" in payload) || !payload.issue) {
    context.logger.debug("Not an issue event");
    return;
  }
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
    const { access, user } = runtime.adapters.supabase;
    const userId = await user.getUserId(context.event, sender);
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
