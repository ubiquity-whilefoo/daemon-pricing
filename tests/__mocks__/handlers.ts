import { http, HttpResponse } from "msw";

/**
 * Intercepts the routes and returns a custom payload
 */
export const handlers = [
  http.get("https://api.github.com/repos/Meniole/bot/collaborators/:user/permission", () => {
    return HttpResponse.json();
  }),
  http.get("https://api.github.com/orgs/:org/members/:user", () => {
    return HttpResponse.json();
  }),
  http.post("https://api.github.com/repos/:org/:repo/issues/:id/comments", () => {
    return HttpResponse.json();
  }),
  http.get("https://api.github.com/users/:user", () => {
    return HttpResponse.json();
  }),
  http.get("https://api.github.com/orgs/:org/memberships/:user", () => {
    return HttpResponse.json();
  }),
];
