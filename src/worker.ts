import manifest from "../manifest.json";
import { validateAndDecodeSchemas } from "./handlers/validator";
import { run } from "./run";
import { Env } from "./types/env";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      const url = new URL(request.url);
      if (url.pathname === "/manifest") {
        if (request.method === "GET") {
          return new Response(JSON.stringify(manifest), {
            headers: { "content-type": "application/json" },
          });
        } else if (request.method === "POST") {
          const webhookPayload = await request.json();

          validateAndDecodeSchemas(env, webhookPayload.settings);
          return new Response(JSON.stringify({ message: "Schema is valid" }), { status: 200, headers: { "content-type": "application/json" } });
        }
      }
      if (request.method !== "POST") {
        return new Response(JSON.stringify({ error: `Only POST requests are supported.` }), {
          status: 405,
          headers: { "content-type": "application/json", Allow: "POST" },
        });
      }
      const contentType = request.headers.get("content-type");
      if (contentType !== "application/json") {
        return new Response(JSON.stringify({ error: `Bad request: ${contentType} is not a valid content type` }), {
          status: 400,
          headers: { "content-type": "application/json" },
        });
      }
      const webhookPayload = await request.json();
      // TODO: temporarily disabled, should be added back with the proper key in the configuration.
      // const signature = webhookPayload.signature;
      // delete webhookPayload.signature;
      // if (!(await verifySignature(env.UBIQUIBOT_PUBLIC_KEY, webhookPayload, signature))) {
      //   return new Response(JSON.stringify({ error: `Forbidden: Signature verification failed` }), {
      //     status: 403,
      //     headers: { "content-type": "application/json" },
      //   });
      // }
      const result = validateAndDecodeSchemas(env, webhookPayload.settings);

      webhookPayload.settings = result.decodedSettings;
      await run(webhookPayload, result.decodedEnv);
      return new Response(JSON.stringify("OK"), { status: 200, headers: { "content-type": "application/json" } });
    } catch (error) {
      return handleUncaughtError(error);
    }
  },
};

function handleUncaughtError(errors: unknown) {
  console.error(errors);
  const status = 500;
  return new Response(JSON.stringify(errors), { status: status, headers: { "content-type": "application/json" } });
}

// async function verifySignature(publicKeyPem: string, payload: unknown, signature: string) {
//   const pemContents = publicKeyPem.replace("-----BEGIN PUBLIC KEY-----", "").replace("-----END PUBLIC KEY-----", "").trim();
//   const binaryDer = Uint8Array.from(atob(pemContents), (c) => c.charCodeAt(0));
//
//   const publicKey = await crypto.subtle.importKey(
//     "spki",
//     binaryDer.buffer,
//     {
//       name: "RSASSA-PKCS1-v1_5",
//       hash: "SHA-256",
//     },
//     true,
//     ["verify"]
//   );
//
//   const signatureArray = Uint8Array.from(atob(signature), (c) => c.charCodeAt(0));
//   const dataArray = new TextEncoder().encode(JSON.stringify(payload));
//
//   return await crypto.subtle.verify("RSASSA-PKCS1-v1_5", publicKey, signatureArray, dataArray);
// }
