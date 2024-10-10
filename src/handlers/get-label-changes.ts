import { Context } from "../types/context";
import { PluginInputs } from "../types/plugin-input";
import { isPushEvent } from "../types/typeguards";

export async function getLabelsChanges(
  context: Context
): Promise<{ previousLabels: PluginInputs["settings"]["labels"]["time"] | null; newLabels: PluginInputs["settings"]["labels"]["time"] | null }> {
  if (!isPushEvent(context)) {
    context.logger.debug("Not a push event");
    return {
      previousLabels: null,
      newLabels: null,
    };
  }
  const {
    logger,
    payload: { repository, head_commit: headCommit },
  } = context;
  const commitSha = headCommit?.id;
  let commitData;

  if (!commitSha) {
    throw new Error("No commit sha found");
  }
  const owner = repository.owner?.login;

  if (!owner) {
    throw logger.error("No owner found in the repository");
  }

  try {
    commitData = await context.octokit.repos.getCommit({
      owner,
      repo: repository.name,
      ref: commitSha,
      mediaType: {
        format: "diff",
      },
    });
  } catch (err: unknown) {
    logger.debug("Commit sha error.", { err });
  }

  if (!commitData) {
    throw new Error("No commit data found");
  }

  const data = commitData.data as unknown as string;
  const changes = data.split("\n");

  const newLabelsRegex = /\+\s*"labels":\s*({[^}]*})/;
  const oldLabelsRegex = /-\s*"labels":\s*({[^}]*})/;

  const newLabels = extractLabels(changes, newLabelsRegex);
  const previousLabels = extractLabels(changes, oldLabelsRegex);

  if (!previousLabels && !newLabels) {
    logger.error("No label changes found in the diff");
  }

  return {
    previousLabels: previousLabels ? JSON.parse(previousLabels) : null,
    newLabels: newLabels ? JSON.parse(newLabels) : null,
  };
}

function extractLabels(changes: string[], regex: RegExp): string | undefined {
  const matchedLines = changes.filter((line) => regex.test(line));
  const matchedData = matchedLines.join("\n");
  const match = matchedData.match(regex);
  return match ? match[1] : undefined;
}
