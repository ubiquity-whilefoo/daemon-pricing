import { Context } from "../types/context";

export function returnOptional<T>(value: T | undefined): T {
  if (value === undefined) throw new Error("Value is undefined");
  return value;
}

async function checkIfIsAdmin(context: Context, username: string) {
  const response = await context.octokit.rest.repos.getCollaboratorPermissionLevel({
    owner: returnOptional(context.payload.repository.owner?.login),
    repo: context.payload.repository.name,
    username,
  });
  return response.data.permission === "admin";
}

async function checkIfIsBillingManager(context: Context, username: string) {
  if (!context.payload.organization) throw context.logger.error(`No organization found in payload!`);

  try {
    await context.octokit.rest.orgs.checkMembershipForUser({
      org: context.payload.organization.login,
      username,
    });
  } catch (e: unknown) {
    return false;
  }

  const { data: membership } = await context.octokit.rest.orgs.getMembershipForUser({
    org: context.payload.organization.login,
    username,
  });
  return membership.role === "billing_manager";
}

export async function isUserAdminOrBillingManager(context: Context, username?: string): Promise<"admin" | "billing_manager" | false> {
  if (!username) return false;
  const isAdmin = await checkIfIsAdmin(context, username);
  if (isAdmin) return "admin";

  const isBillingManager = await checkIfIsBillingManager(context, username);
  if (isBillingManager) return "billing_manager";

  return false;
}

export async function addCommentToIssue(context: Context, message: string, issueNumber: number, owner?: string, repo?: string) {
  const payload = context.payload;
  try {
    await context.octokit.issues.createComment({
      owner: owner ?? returnOptional(payload.repository.owner?.login),
      repo: repo ?? payload.repository.name,
      issue_number: issueNumber,
      body: message,
    });
  } catch (err: unknown) {
    context.logger.error("Adding a comment failed!", { err });
  }
}

export async function listOrgRepos(context: Context) {
  try {
    const response = await context.octokit.rest.repos.listForOrg({
      org: returnOptional(context.payload.organization?.login),
    });
    return response.data;
  } catch (err) {
    context.logger.error("Listing org repos failed!", { err });
    return [];
  }
}

export async function listRepoIssues(context: Context, owner: string, repo: string) {
  try {
    const response = await context.octokit.rest.issues.listForRepo({
      owner,
      repo,
    });
    return response.data;
  } catch (err) {
    context.logger.error("Listing repo issues failed!", { err });
    return [];
  }
}
