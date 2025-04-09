import { createPlugin } from "@ubiquity-os/plugin-sdk";
import { Manifest } from "@ubiquity-os/plugin-sdk/manifest";
import { LOG_LEVEL, LogLevel } from "@ubiquity-os/ubiquity-os-logger";
import { Hono } from "hono";
import { handle } from "hono/vercel";
import manifest from "../manifest.json" with { type: "json" };
import { envSchema } from "../src/types/env.js";
import { pluginSettingsSchema } from "../src/types/plugin-input.js";

const pluginApp = createPlugin(() => {}, manifest as Manifest, {
  envSchema: envSchema,
  postCommentOnError: true,
  settingsSchema: pluginSettingsSchema,
  logLevel: (process.env.LOG_LEVEL as LogLevel) || LOG_LEVEL.INFO,
  kernelPublicKey: process.env.KERNEL_PUBLIC_KEY,
  bypassSignatureVerification: true,
  // bypassSignatureVerification: process.env.NODE_ENV === "local",
});

const rootApp = new Hono();

rootApp.route("/api", pluginApp);

const handler = handle(rootApp);

export const GET = handler;
export const POST = handler;
