import { EmitterWebhookEvent as WebhookEvent, EmitterWebhookEventName as WebhookEventName } from "@octokit/webhooks";
import { Octokit } from "@octokit/rest";
import { AssistivePricingSettings } from "./plugin-input";
import { createAdapters } from "../adapters";

export type SupportedEvents = "issues.labeled" | "issues.unlabeled" | "label.edited" | "issue_comment.created";

export interface Context<T extends WebhookEventName = SupportedEvents> {
  eventName: T;
  payload: WebhookEvent<T>["payload"];
  octokit: InstanceType<typeof Octokit>;
  adapters: ReturnType<typeof createAdapters>;
  config: AssistivePricingSettings;
  logger: {
    fatal: (message: unknown, ...optionalParams: unknown[]) => void;
    error: (message: unknown, ...optionalParams: unknown[]) => void;
    warn: (message: unknown, ...optionalParams: unknown[]) => void;
    info: (message: unknown, ...optionalParams: unknown[]) => void;
    debug: (message: unknown, ...optionalParams: unknown[]) => void;
  };
}
