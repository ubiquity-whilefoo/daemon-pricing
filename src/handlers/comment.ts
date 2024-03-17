import { addCommentToIssue, isUserAdminOrBillingManager } from "../shared/issue";
import { Context } from "../types/context";
import { isCommentEvent } from "../types/typeguards";

export async function handleComment(context: Context) {
  const logger = context.logger;
  if (!isCommentEvent(context)) {
    return logger.debug("Not an comment event");
  }

  const payload = context.payload;
  const sender = payload.sender.login;
  const body = payload.comment.body;

  const sufficientPrivileges = await isUserAdminOrBillingManager(context, sender);
  if (!sufficientPrivileges) {
    await addCommentToIssue(context, `@${sender}, You are not allowed to set access`, payload.issue.number);
  }

  if (body.match(/\/.*/)) {
    const { username, labels } = parseComment(body);
    const { access, user } = context.adapters.supabase;
    const url = payload.comment?.html_url as string;
    if (!url) throw new Error("Comment url is undefined");

    const userId = await user.getUserId(context, username);
    await access.setAccess(userId, payload.repository.id, labels);
    if (!labels.length) {
      return context.logger.info("Successfully cleared access", { username });
    }
    return context.logger.info("Successfully set access", { username, labels });
  } else {
    await addCommentToIssue(
      context,
      `Invalid syntax for allow \n usage: '/[command] @[user] [label-type]...' \n  ex-1 /labels @example-user time priority`,
      payload.issue.number
    );
  }
}

function parseComment(comment: string): { username: string; labels: string[] } {
  // Extract the @username using a regular expression
  const usernameMatch = comment.match(/@(\w+)/);
  if (!usernameMatch) throw new Error("Username not found in comment");
  const username = usernameMatch[1];

  // Split the comment into words and filter out the command and the username
  const labels = comment.split(/\s+/).filter((word) => !word.startsWith("/") && !word.startsWith("@"));

  return {
    username: username,
    labels: labels,
  };
}
