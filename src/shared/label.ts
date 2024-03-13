import { Context } from "../types/context";
import { Label } from "../types/github";

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

export async function deleteLabel(context: Context, name: string) {
  const payload = context.payload;

  try {
    await context.octokit.issues.deleteLabel({
      owner: payload.repository.owner.login,
      repo: payload.repository.name,
      name,
    });
  } catch (e: unknown) {
    context.logger.fatal("Removing label failed!", e);
  }
}

export async function clearAllPriceLabelsOnIssue(context: Context) {
  const payload = context.payload;
  if (!("issue" in payload) || !payload.issue) {
    return;
  }

  const labels = payload.issue.labels;
  if (!labels) return;
  const issuePriceLabels = labels.filter((label) => label.name.toString().startsWith("Price: "));
  if (!issuePriceLabels.length) return;

  for (const label of issuePriceLabels) {
    try {
      await context.octokit.issues.removeLabel({
        owner: payload.repository.owner.login,
        repo: payload.repository.name,
        issue_number: payload.issue.number,
        name: label.name,
      });
    } catch (e: unknown) {
      context.logger.fatal("Clearing all price labels failed!", e);
    }
  }
}

export async function addLabelToIssue(context: Context, labelName: string) {
  const payload = context.payload;
  if (!("issue" in payload) || !payload.issue) {
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

export async function removeLabelFromIssue(context: Context, labelName: string) {
  const payload = context.payload;
  if (!("issue" in payload) || !payload.issue) {
    return;
  }

  try {
    await context.octokit.issues.removeLabel({
      owner: payload.repository.owner.login,
      repo: payload.repository.name,
      issue_number: payload.issue.number,
      name: labelName,
    });
  } catch (e: unknown) {
    context.logger.fatal("Adding a label to issue failed!", e);
  }
}
