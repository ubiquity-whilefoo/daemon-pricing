import { Env } from "./types/env";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      console.log(request, env);
      return new Response("ok\n", { status: 200, headers: { "content-type": "text/plain" } });
    } catch (error) {
      return handleUncaughtError(error);
    }
  },
};

function handleUncaughtError(error: unknown) {
  console.error(error);
  const status = 500;
  const errorMessage = "An uncaught error occurred";
  return new Response(JSON.stringify({ error: errorMessage }), { status: status, headers: { "content-type": "application/json" } });
}
