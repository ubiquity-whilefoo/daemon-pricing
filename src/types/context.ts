import { Context as PluginContext } from "@ubiquity-os/plugin-sdk";
import { AssistivePricingSettings } from "./plugin-input";
import { createAdapters } from "../adapters";
import { Env } from "./env";
import { Command } from "./command";

export type SupportedEvents =
  | "repository.created"
  | "issues.labeled"
  | "issues.unlabeled"
  | "issues.opened"
  | "label.edited"
  | "issue_comment.created"
  | "push";

export type Context<T extends SupportedEvents = SupportedEvents> = PluginContext<AssistivePricingSettings, Env, Command, T> & {
  adapters: ReturnType<typeof createAdapters>;
};
