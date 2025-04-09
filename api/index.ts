import { createPlugin } from "@ubiquity-os/plugin-sdk";
import { Manifest } from "@ubiquity-os/plugin-sdk/dist/manifest";
import { handle } from "hono/vercel";
import manifest from "../manifest.json" with { type: "json" };

const app = createPlugin(() => {}, manifest as Manifest).basePath("/api");

app.get("/", (c) => {
  return c.json({ message: "Congrats! You've deployed Hono to Vercel" });
});

const handler = handle(app);

export const GET = handler;
export const POST = handler;
