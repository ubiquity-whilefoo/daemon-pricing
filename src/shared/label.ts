import { Label } from "../types/github";
import { ContextPlugin } from "../types/plugin-input";

// cspell:disable
const COLORS = { default: "ededed", price: "1f883d" };
// cspell:enable

export async function listLabelsForRepo(context: ContextPlugin): Promise<Label[]> {
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

  throw context.logger.error("Failed to fetch lists of labels", { status: res.status });
}
export async function createLabel(context: ContextPlugin, name: string, labelType = "default" as keyof typeof COLORS): Promise<void> {
  const payload = context.payload;

  const color = name.startsWith("Price: ") ? COLORS.price : COLORS[labelType];

  await context.octokit.rest.issues.createLabel({
    owner: payload.repository.owner.login,
    repo: payload.repository.name,
    name,
    color,
  });
}

export async function clearAllPriceLabelsOnIssue(context: ContextPlugin) {
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
      await context.octokit.rest.issues.removeLabel({
        owner: payload.repository.owner.login,
        repo: payload.repository.name,
        issue_number: payload.issue.number,
        name: label.name,
      });
    } catch (e: unknown) {
      context.logger.error("Clearing all price labels failed!", { e });
    }
  }
}
export async function addLabelToIssue(context: ContextPlugin, labelName: string) {
  const payload = context.payload;
  if (!("issue" in payload) || !payload.issue) {
    return;
  }

  try {
    await context.octokit.rest.issues.addLabels({
      owner: payload.repository.owner.login,
      repo: payload.repository.name,
      issue_number: payload.issue.number,
      labels: [labelName],
    });

    // Update color if it's a price label
    if (labelName.startsWith("Price: ")) {
      await updateLabelColor(context, labelName, COLORS.price);
    }
  } catch (e: unknown) {
    context.logger.error("Adding a label to issue failed!", { e });
  }
}

export async function removeLabelFromIssue(context: ContextPlugin, labelName: string) {
  const payload = context.payload;
  if (!("issue" in payload) || !payload.issue) {
    return;
  }

  try {
    await context.octokit.rest.issues.removeLabel({
      owner: payload.repository.owner.login,
      repo: payload.repository.name,
      issue_number: payload.issue.number,
      name: labelName,
    });
  } catch (e: unknown) {
    context.logger.error("Adding a label to issue failed!", { e });
  }
}

async function updateLabelColor(context: ContextPlugin, labelName: string, color: string) {
  const payload = context.payload;
  try {
    await context.octokit.rest.issues.updateLabel({
      owner: payload.repository.owner.login,
      repo: payload.repository.name,
      name: labelName,
      color,
    });
  } catch (e: unknown) {
    context.logger.error("Updating label color failed!", { e });
  }
}
