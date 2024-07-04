import { Context } from "./context";

export function isCommentEvent(
  context: Context
): context is Context & { payload: { issue: Context<"issue_comment">["payload"]["issue"]; comment: Context<"issue_comment">["payload"]["comment"] } } {
  return context.eventName.startsWith("issue_comment.");
}

export function isIssueLabelEvent(context: Context): context is Context & {
  payload: {
    issue: Context<"issues.labeled" | "issues.unlabeled">["payload"]["issue"];
    label: Context<"issues.labeled" | "issues.unlabeled">["payload"]["label"];
  };
} {
  return context.eventName === "issues.labeled" || context.eventName === "issues.unlabeled";
}

export function isLabelEditedEvent(context: Context): context is Context & {
  payload: {
    label: Context<"label.edited">["payload"]["label"];
    changes: Context<"label.edited">["payload"]["changes"];
  };
} {
  return context.eventName === "label.edited";
}
