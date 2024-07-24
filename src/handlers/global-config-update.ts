import { checkModifiedBaseRate } from "./check-modified-base-rate";
import { getBaseRateChanges } from "./get-base-rate-changes";
import { Context } from "../types/context";
import { syncPriceLabelsToConfig } from "./sync-labels-to-config";
import { setPriceLabel } from "./pricing-label";
import { isPushEvent } from "../types/typeguards";
import { listOrgRepos, listRepoIssues } from "../shared/issue";
import { Label } from "../types/github";

export async function globalLabelUpdate(context: Context) {
    if (!isPushEvent(context)) {
        context.logger.debug("Not a push event");
        return;
    }
    const shouldUpdate = checkModifiedBaseRate(context);
    if (!shouldUpdate) {
        return;
    }

    const rates = await getBaseRateChanges(context);

    if (rates.newBaseRate === null) {
        context.logger.error("No new base rate found in the diff");
        return;
    }

    context.logger.info(`Updating base rate from ${rates.previousBaseRate} to ${rates.newBaseRate}`);
    context.config.basePriceMultiplier = rates.newBaseRate;

    await syncPriceLabelsToConfig(context);

    // update all issues with the new pricing
    if (context.config.globallyUpdateLabelsWithConfig) {
        await updateAllIssuePriceLabels(context);
    }

}

async function updateAllIssuePriceLabels(context: Context) {
    const repos = await listOrgRepos(context);
    for (const repo of repos) {
        if (repo.archived) {
            context.logger.info(`Skipping archived repository ${repo.name}`);
            continue;
        }
        if (repo.disabled) {
            context.logger.info(`Skipping disabled repository ${repo.name}`);
            continue;
        }

        const issues = await listRepoIssues(context, repo.owner.login, repo.name);
        for (const issue of issues) {
            context.logger.info(`Updating issue ${issue.number} in ${repo.name}`);
            const ctx = {
                ...context,
                payload: {
                    repository: repo,
                    issue,
                }
            }
            await setPriceLabel(ctx as Context, issue.labels as Label[], context.config);
        }
    }
}