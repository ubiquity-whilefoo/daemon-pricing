import { pushEmptyCommit } from "../shared/commits";
import { isUserAdminOrBillingManager, listOrgRepos, listRepoIssues } from "../shared/issue";
import { COMMIT_MESSAGE } from "../types/constants";
import { Context } from "../types/context";
import { isPushEvent } from "../types/typeguards";
import { isConfigModified } from "./check-modified-base-rate";
import { getBaseRateChanges } from "./get-base-rate-changes";
import { getPriceLabels, syncPriceLabelsToConfig } from "./sync-labels-to-config";

async function isAuthed(context: Context): Promise<boolean> {
  if (!isPushEvent(context)) {
    context.logger.debug("Not a push event");
    return false;
  }
  const { payload, logger } = context;

  // who triggered the event
  const sender = payload.sender?.login;
  // who pushed the code
  const pusher = payload.pusher?.name;

  const isPusherAuthed = await isUserAdminOrBillingManager(context, pusher);
  const isSenderAuthed = await isUserAdminOrBillingManager(context, sender);

  if (!isPusherAuthed) {
    logger.error("Pusher is not an admin or billing manager", {
      login: pusher,
    });
  }

  if (!isSenderAuthed) {
    logger.error("Sender is not an admin or billing manager", {
      login: sender,
    });
  }

  return !!(isPusherAuthed && isSenderAuthed);
}

export async function globalLabelUpdate(context: Context) {
  if (!isPushEvent(context)) {
    context.logger.debug("Not a push event");
    return;
  }

  const { logger, config } = context;

  if (!(await isAuthed(context))) {
    logger.error("Changes should be pushed and triggered by an admin or billing manager.");
    return;
  }

  const didConfigurationChange = await isConfigModified(context);

  if (didConfigurationChange) {
    // send push
    const repos = await listOrgRepos(context);
    for (const repository of repos) {
      const ctx = {
        ...context,
        payload: {
          repository: repository,
        },
      } as Context;
      // Pushing an empty commit will trigger a label update on the repository using its local configuration.
      await pushEmptyCommit(ctx);
    }
    return;
  } else if (!didConfigurationChange && context.payload.head_commit?.message !== COMMIT_MESSAGE) {
    logger.info("The configuration was not modified and the commit name does not match the label update commit message, won't update labels.");
    return;
  }

  const rates = await getBaseRateChanges(context);
  const { incorrectPriceLabels } = await getPriceLabels(context);

  if (rates.newBaseRate === null && incorrectPriceLabels.length <= 0) {
    logger.info("No base rate change detected and no incorrect price label to delete, skipping.", {
      url: context.payload.repository.html_url,
    });
    return;
  }

  if (rates.newBaseRate !== null) {
    logger.info(`Updating base rate from ${rates.previousBaseRate} to ${rates.newBaseRate}`);
    config.basePriceMultiplier = rates.newBaseRate;
  }

  const repository = context.payload.repository;

  logger.info(`Updating pricing labels in ${repository.html_url}`);

  const owner = repository.owner?.login;
  const repo = repository.name;

  if (!owner) {
    throw logger.error("No owner was found in the payload.");
  }

  const issues = await listRepoIssues(context, owner, repo);
  // For each issue inside the repository, we want to save the currently set labels except the price,
  // then remove all these labels, trigger a synchronization so up-to-date Price labels are generated,
  // and finally we want to add back all the previously set labels (except the price).
  // This way, the plugin gets triggered by the "issues.labeled" event, and recreates the price, using the proper
  // configuration.
  for (const issue of issues) {
    const currentLabels = (
      await context.octokit.paginate(context.octokit.rest.issues.listLabelsOnIssue, {
        owner,
        repo,
        issue_number: issue.number,
      })
    )
      .filter((o) => !o.name.startsWith("Price:"))
      .map((o) => o.name);
    logger.info(`Removing all labels in issue ${issue.html_url}`, { currentLabels });
    if (currentLabels.length) {
      await context.octokit.rest.issues.removeAllLabels({
        owner,
        repo,
        issue_number: issue.number,
      });
      // this should create labels on the repos that are missing
      await syncPriceLabelsToConfig(context);
      await context.octokit.rest.issues.addLabels({
        repo,
        owner,
        issue_number: issue.number,
        labels: currentLabels,
      });
    }
  }
}
