import { createClient } from "@supabase/supabase-js";
import { createActionsPlugin } from "@ubiquity-os/plugin-sdk";
import { LogLevel } from "@ubiquity-os/ubiquity-os-logger";
import { createAdapters } from "./adapters";
import { run } from "./run";
import { Context, SupportedEvents } from "./types/context";
import { Env, envSchema } from "./types/env";
import { AssistivePricingSettings, pluginSettingsSchema } from "./types/plugin-input";
import { Command } from "./types/command";

createActionsPlugin<AssistivePricingSettings, Env, Command, SupportedEvents>(
  (context) => {
    return run({ ...context, adapters: createAdapters(createClient(context.env.SUPABASE_URL, context.env.SUPABASE_KEY), context as Context) });
  },
  {
    envSchema: envSchema,
    postCommentOnError: true,
    settingsSchema: pluginSettingsSchema,
    logLevel: process.env.LOG_LEVEL as LogLevel,
    kernelPublicKey: process.env.KERNEL_PUBLIC_KEY,
  }
).catch(console.error);
