import { clearAllPriceLabelsOnIssue } from "../shared/label";
import { calculateLabelValue } from "../shared/pricing";
import { Label } from "../types/github";
import { Context } from "../types/context";

export async function handleParentIssue(context: Context, labels: Label[]) {
  const issuePrices = labels.filter((label) => label.name.toString().startsWith("Price:"));
  if (issuePrices.length) {
    await clearAllPriceLabelsOnIssue(context);
  }
  throw context.logger.error("Pricing is disabled on parent issues.");
}

export function sortLabelsByValue(labels: Label[]) {
  return labels.sort((a, b) => {
    return (calculateLabelValue(a.name) || 0) - (calculateLabelValue(b.name) || 0);
  });
}

export function isParentIssue(body: string) {
  const parentPattern = /-\s+\[( |x)\]\s+#\d+/;
  return body.match(parentPattern);
}
