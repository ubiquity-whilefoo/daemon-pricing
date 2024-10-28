import { EmitterWebhookEvent as WebhookEvent, EmitterWebhookEventName as WebhookEventName } from "@octokit/webhooks";
import { StaticDecode, Type as T } from "@sinclair/typebox";
import { Context } from "@ubiquity-os/ubiquity-os-kernel";
import { StandardValidator } from "typebox-validators";
import { createAdapters } from "../adapters";
import { SupportedEvents } from "./context";
import { Env } from "./env";

export interface PluginInputs<T extends WebhookEventName = SupportedEvents> {
  stateId: string;
  eventName: T;
  eventPayload: WebhookEvent<T>["payload"];
  settings: AssistivePricingSettings;
  authToken: string;
  ref: string;
}

export const pluginSettingsSchema = T.Object(
  {
    labels: T.Object(
      {
        time: T.Array(T.String(), { default: [] }),
        priority: T.Array(T.String(), { default: [] }),
      },
      { default: {} }
    ),
    basePriceMultiplier: T.Number({ default: 1 }),
    publicAccessControl: T.Object(
      {
        setLabel: T.Boolean({ default: false }),
        fundExternalClosedIssue: T.Boolean({ default: false }),
      },
      { default: {} }
    ),
  },
  { default: {} }
);

export const assistivePricingSchemaValidator = new StandardValidator(pluginSettingsSchema);

export type AssistivePricingSettings = StaticDecode<typeof pluginSettingsSchema>;

export type ContextPlugin = Context<AssistivePricingSettings, Env, SupportedEvents> & { adapters: ReturnType<typeof createAdapters> };
