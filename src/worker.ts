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
      console.log("Request:", await request.json());
      return new Response(JSON.stringify("ok"), { status: 200, headers: { "content-type": "application/json" } });
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
