import { createClient } from "@supabase/supabase-js";
import { createActionsPlugin } from "@ubiquity-os/ubiquity-os-kernel";
import { LogLevel } from "@ubiquity-os/ubiquity-os-logger";
import { createAdapters } from "./adapters";
import { run } from "./run";
import { SupportedEvents } from "./types/context";
import { Env, envSchema } from "./types/env";
import { AssistivePricingSettings, pluginSettingsSchema } from "./types/plugin-input";

createActionsPlugin<AssistivePricingSettings, Env, SupportedEvents>(
  (context) => {
    return run({ ...context, adapters: createAdapters(createClient(context.env.SUPABASE_URL, context.env.SUPABASE_KEY), context) });
  },
  {
    // @ts-expect-error types match
    envSchema: envSchema,
    postCommentOnError: true,
    // @ts-expect-error types match
    settingsSchema: pluginSettingsSchema,
    logLevel: process.env.LOG_LEVEL as LogLevel,
    kernelPublicKey: process.env.KERNEL_PUBLIC_KEY,
  }
).catch(console.error);
