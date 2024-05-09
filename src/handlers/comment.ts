import { addCommentToIssue, isUserAdminOrBillingManager } from "../shared/issue";
import { Context } from "../types/context";
import { isCommentEvent } from "../types/typeguards";
import commandParser, { CommandArguments } from "./command-parser";

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

  try {
    if (/\/\S+/.test(body)) {
      const { username, labels, command } = parseComment(body);
      if (command === "/allow") {
        const { access, user } = context.adapters.supabase;
        const url = payload.comment?.html_url as string;
        if (!url) throw new Error("Comment url is undefined");

        const userId = await user.getUserId(context, username);
        await access.setAccess(userId, payload.repository.id, labels);
        if (!labels.length) {
          return await addCommentToIssue(context, `@${sender}, successfully cleared access for @${user}`, payload.issue.number);
        }
        return await addCommentToIssue(context, `@${sender}, successfully set access for @${user}`, payload.issue.number);
      }
    } else {
      throw new Error("Failed to invoke command");
    }
  } catch (e) {
    await addCommentToIssue(
      context,
      `\`\`\`
Error: ${e}\n\n
${commandParser.helpInformation()}
\`\`\``,
      payload.issue.number
    );
  }
}

function parseComment(comment: string) {
  const result: CommandArguments = {
    command: "",
    username: "",
    labels: [],
  };
  commandParser
    .action((command, user, labels) => {
      result.command = command;
      result.username = user;
      result.labels = labels;
    })
    .parse(comment.split(/\s+/), { from: "user" });

  return result;
}
