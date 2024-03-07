import { EmitterWebhookEvent as WebhookEvent, EmitterWebhookEventName as WebhookEventName } from "@octokit/webhooks";
import { SupportedEvents } from "./context";

export interface PluginInputs<T extends WebhookEventName = SupportedEvents> {
  stateId: string;
  eventName: T;
  eventPayload: WebhookEvent<T>["payload"];
  settings: AssistivePricingSettings;
  authToken: string;
  ref: string;
}

export interface AssistivePricingSettings {
  defaultLabels: string[];
  labels: {
    time: string[];
    priority: string[];
  };
  basePriceMultiplier: number;
  publicAccessControl: {
    setLabel: boolean;
    fundExternalClosedIssue: boolean;
  };
}
