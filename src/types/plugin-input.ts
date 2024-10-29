import { StaticDecode, Type as T } from "@sinclair/typebox";
import { Context } from "@ubiquity-os/ubiquity-os-kernel";
import { createAdapters } from "../adapters";
import { SupportedEvents } from "./context";
import { Env } from "./env";

export const pluginSettingsSchema = T.Object(
  {
    globalConfigUpdate: T.Optional(
      T.Object({
        excludeRepos: T.Array(T.String()),
      })
    ),
    labels: T.Object(
      {
        time: T.Array(
          T.Object({
            name: T.String(),
            collaboratorOnly: T.Boolean({ default: false }),
          }),
          { default: [] }
        ),
        priority: T.Array(
          T.Object({
            name: T.String(),
            collaboratorOnly: T.Boolean({ default: false }),
          }),
          { default: [] }
        ),
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

export type AssistivePricingSettings = StaticDecode<typeof pluginSettingsSchema>;
export type Rates = {
  previousBaseRate: number | null;
  newBaseRate: number | null;
};

export type ContextPlugin = Context<AssistivePricingSettings, Env, SupportedEvents> & { adapters: ReturnType<typeof createAdapters> };

export const COLLABORATOR_ONLY_DESCRIPTION = "⚠️ Collaborator only";
