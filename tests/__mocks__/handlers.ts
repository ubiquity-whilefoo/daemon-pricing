import { http, HttpResponse } from "msw";

/**
 * Intercepts the routes and returns a custom payload
 */
export const handlers = [
  http.get("https://api.github.com/repos/:repo/bot/collaborators/:user/permission", () => HttpResponse.json()),
  http.get("https://api.github.com/orgs/:org/members/:user", () => HttpResponse.json()),
  http.post("https://api.github.com/repos/:org/:repo/issues/:id/comments", () => HttpResponse.json()),
  http.get("https://api.github.com/users/:user", () => HttpResponse.json()),
  http.get("https://api.github.com/orgs/:org/memberships/:user", () => HttpResponse.json()),
  http.post("http://localhost:65432/rest/v1/access", () => HttpResponse.json()),
];
