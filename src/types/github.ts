import { RestEndpointMethodTypes } from "@octokit/rest";
import { EmitterWebhookEvent, EmitterWebhookEventName } from "@octokit/webhooks";

export type Label = RestEndpointMethodTypes["issues"]["listLabelsForRepo"]["response"]["data"][0];

export enum UserType {
  User = "User",
  Bot = "Bot",
  Organization = "Organization",
}

export type Comment = RestEndpointMethodTypes["issues"]["listComments"]["response"]["data"][0];
export type Repository = RestEndpointMethodTypes["repos"]["get"]["response"]["data"];

export type WebhookEvent<T extends EmitterWebhookEventName = EmitterWebhookEventName> = EmitterWebhookEvent<T>;
