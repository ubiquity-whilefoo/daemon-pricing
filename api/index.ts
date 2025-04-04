import { createPlugin } from "@ubiquity-os/plugin-sdk";
import { Manifest } from "@ubiquity-os/plugin-sdk/manifest";
import { LOG_LEVEL, LogLevel } from "@ubiquity-os/ubiquity-os-logger";
import { handle } from "hono/vercel";
import manifest from "../manifest.json";
import { run } from "../src/run";
import { SupportedEvents } from "../src/types/context";
import { Env, envSchema } from "../src/types/env";
import { AssistivePricingSettings, pluginSettingsSchema } from "../src/types/plugin-input";

export const runtime = "edge";

const app = createPlugin<AssistivePricingSettings, Env, null, SupportedEvents>(
  async (context) => {
    return run(context);
  },
  manifest as Manifest,
  {
    envSchema: envSchema,
    postCommentOnError: true,
    settingsSchema: pluginSettingsSchema,
    logLevel: (process.env.LOG_LEVEL as LogLevel) || LOG_LEVEL.INFO,
    kernelPublicKey: process.env.KERNEL_PUBLIC_KEY,
    bypassSignatureVerification: true,
    // bypassSignatureVerification: process.env.NODE_ENV === "local",
  }
).basePath("/api");

// export const GET = handle(app);
// export const POST = handle(app);
//
// import { Hono } from "hono";
// import { handle } from "hono/vercel";
//
// export const runtime = "edge";
//
// const app = new Hono().basePath("/api");
//
// app.get("/", (c) => {
//   return c.json({
//     message: "Hello Next.js!",
//   });
// });

export const GET = handle(app);
export const POST = handle(app);
