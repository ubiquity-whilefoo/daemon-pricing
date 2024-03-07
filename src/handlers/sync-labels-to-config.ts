import { createLabel, listLabelsForRepo } from "../shared/label";
import { calculateLabelValue, calculateTaskPrice } from "../shared/pricing";
import { Context } from "../types/context";

// This just checks all the labels in the config have been set in gh issue
// If there's something missing, they will be added

export async function syncPriceLabelsToConfig(context: Context) {
  const config = context.config;
  const logger = context.logger;

  const priceLabels: string[] = [];
  for (const timeLabel of config.labels.time) {
    for (const priorityLabel of config.labels.priority) {
      const targetPrice = calculateTaskPrice(context, calculateLabelValue(timeLabel), calculateLabelValue(priorityLabel), config.basePriceMultiplier);
      const targetPriceLabel = `Price: ${targetPrice} USD`;
      priceLabels.push(targetPriceLabel);
    }
  }

  const pricingLabels: string[] = [...priceLabels, ...config.labels.time, ...config.labels.priority];

  // List all the labels for a repository
  const allLabels = await listLabelsForRepo(context);

  // Get the missing labels
  const missingLabels = pricingLabels.filter((label) => !allLabels.map((i) => i.name).includes(label));

  // Create missing labels
  if (missingLabels.length > 0) {
    logger.info("Missing labels found, creating them", { missingLabels });
    await Promise.all(missingLabels.map((label) => createLabel(context, label)));
    logger.info(`Creating missing labels done`);
  }
}
