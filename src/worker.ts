import { run } from "./index";
import * as core from "@actions/core";

export default {
  async fetch(request: Request): Promise<Response> {
    try {
      const contentType = request.headers.get("content-type");
      if (contentType !== "application/json") {
        return new Response(JSON.stringify({ error: `Error: ${contentType} is not a valid content type` }), {
          status: 400,
          headers: { "content-type": "application/json" },
        });
      }
      const body = await request.json();
      body.eventPayload = JSON.parse(body.eventPayload);
      body.settings = JSON.parse(body.settings);
      console.log("Request:", body);
      const result = await run(body);
      core.setOutput("result", result);
      return new Response(JSON.stringify(result), { status: 200, headers: { "content-type": "application/json" } });
    } catch (error) {
      return handleUncaughtError(error);
    }
  },
};

function handleUncaughtError(error: unknown) {
  console.error(error);
  const status = 500;
  return new Response(JSON.stringify({ error }), { status: status, headers: { "content-type": "application/json" } });
}
