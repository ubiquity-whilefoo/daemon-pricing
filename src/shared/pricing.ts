import { Decimal } from "decimal.js";
import { Label } from "../types/github";
import { Context } from "../types/context";

export function calculateTaskPrice(context: Context, timeValue: number, priorityValue: number, baseValue?: number): string {
  const base = baseValue ?? context.config.basePriceMultiplier;
  const priority = new Decimal(priorityValue).div(10); // floats cause bad math
  return new Decimal(base).mul(1000).mul(timeValue).mul(priority).toDecimalPlaces(2).toString();
}

export function getPrice(context: Context, timeLabel: Label, priorityLabel: Label) {
  const logger = context.logger;
  const { labels } = context.config;

  if (!timeLabel || !priorityLabel) throw logger.error("Time or priority label is not defined");

  const recognizedTimeLabels = labels.time.find((configLabel) => configLabel.name === timeLabel.name);
  if (!recognizedTimeLabels) throw logger.error("Time label is not recognized");

  const recognizedPriorityLabels = labels.priority.find((configLabel) => configLabel.name === priorityLabel.name);
  if (!recognizedPriorityLabels) throw logger.error("Priority label is not recognized");

  const timeValue = calculateLabelValue(recognizedTimeLabels.name);
  if (timeValue === null) throw logger.error("Time value is not defined");

  const priorityValue = calculateLabelValue(recognizedPriorityLabels.name);
  if (priorityValue === null) throw logger.error("Priority value is not defined");

  const taskPrice = calculateTaskPrice(context, timeValue, priorityValue);
  return `Price: ${taskPrice} USD`;
}

/*
 * Gets the value associated to the label. Returns null if the value of the label couldn't be extracted.
 */
export function calculateLabelValue(label: string): number | null {
  const matches = label.match(/\d+/);
  if (!matches?.length) return null;
  const number = parseInt(matches[0]);
  if (label.toLowerCase().includes("priority")) return number;
  if (label.toLowerCase().includes("minute")) return number * 0.002;
  if (label.toLowerCase().includes("hour")) return number * 0.125;
  if (label.toLowerCase().includes("day")) return 1 + (number - 1) * 0.25;
  if (label.toLowerCase().includes("week")) return number + 1;
  if (label.toLowerCase().includes("month")) return 5 + (number - 1) * 8;
  return null;
}
