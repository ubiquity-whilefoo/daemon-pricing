import { drop } from "@mswjs/data";
import { Context } from "../src/types/context";
import { db } from "./__mocks__/db";
import { server } from "./__mocks__/node";
import { it, describe, beforeAll, beforeEach, afterAll, expect, afterEach, jest } from "@jest/globals";
import { ZERO_SHA } from "../src/handlers/check-modified-base-rate";
import dotenv from "dotenv";
import { Octokit } from "@octokit/rest";
import {
  CONFIG_CHANGED_IN_COMMIT,
  CONFIG_PATH,
  CREATING_MISSING_LABELS,
  NEEDS_TRIGGERED_BY_ADMIN_OR_BILLING_MANAGER,
  NO_RECOGNIZED_LABELS,
  priceMap,
  PRIORITY_LABELS,
  PUSHER_NOT_AUTHED,
  SENDER_NOT_AUTHED,
  SHA_1,
  TEST_REPO,
  TIME_LABELS,
  UBIQUITY,
  UBQ_EMAIL,
  UPDATING_FROM_1_TO_5,
  UPDATING_ISSUE_1_IN_TEST_REPO,
  UPDATING_ISSUE_2_IN_TEST_REPO,
  UPDATING_ISSUE_3_IN_TEST_REPO,
  USER_2,
} from "./__mocks__/constants";
import { Label } from "../src/types/github";
import { globalLabelUpdate } from "../src/handlers/global-config-update";
import { setupTests, inMemoryCommits, createCommit } from "./__mocks__/helpers";
dotenv.config();

jest.requireActual("@octokit/rest");

const octokit = new Octokit();

type CreateCommitParams = {
  owner: string;
  repo: string;
  sha: string;
  modified: string[];
  added: string[];
  withBaseRateChanges: boolean;
  withPlugin: boolean;
  amount: number;
};

beforeAll(() => {
  server.listen();
});
afterEach(() => {
  server.resetHandlers();
  jest.clearAllMocks();
});
afterAll(() => server.close());

describe("Label Base Rate Changes", () => {
  beforeEach(async () => {
    drop(db);
    await setupTests();
  });

  it("Should change the base rate of all price labels", async () => {
    const commits = inMemoryCommits(SHA_1);
    const { context, warnSpy, errorSpy, infoSpy } = innerSetup(1, commits, SHA_1, SHA_1, {
      owner: UBIQUITY,
      repo: TEST_REPO,
      sha: SHA_1,
      modified: [CONFIG_PATH],
      added: [],
      withBaseRateChanges: true,
      withPlugin: false,
      amount: 5,
    });

    await globalLabelUpdate(context);

    const updatedRepo = db.repo.findFirst({ where: { id: { equals: 1 } } });
    const updatedIssue = db.issue.findFirst({ where: { id: { equals: 1 } } });
    const updatedIssue2 = db.issue.findFirst({ where: { id: { equals: 3 } } });

    expect(updatedRepo?.labels).toHaveLength(40);
    expect(updatedIssue?.labels).toHaveLength(3);
    expect(updatedIssue2?.labels).toHaveLength(3);

    const priceLabels = updatedIssue?.labels.filter((label) => (label as Label).name.includes("Price:"));
    const priceLabels2 = updatedIssue2?.labels.filter((label) => (label as Label).name.includes("Price:"));

    expect(priceLabels).toHaveLength(1);
    expect(priceLabels2).toHaveLength(1);

    expect(priceLabels?.map((label) => (label as Label).name)).toContain(`Price: ${priceMap[1] * 5} USD`);
    expect(priceLabels2?.map((label) => (label as Label).name)).toContain(`Price: ${priceMap[1] * 5} USD`);

    const noTandP = db.issue.findFirst({ where: { id: { equals: 2 } } });
    expect(noTandP?.labels).toHaveLength(0);

    expect(infoSpy).toHaveBeenNthCalledWith(1, CONFIG_CHANGED_IN_COMMIT);
    expect(infoSpy).toHaveBeenNthCalledWith(2, UPDATING_FROM_1_TO_5);
    expect(infoSpy).toHaveBeenNthCalledWith(4, CREATING_MISSING_LABELS);
    expect(infoSpy).toHaveBeenNthCalledWith(5, UPDATING_ISSUE_1_IN_TEST_REPO);
    expect(infoSpy).toHaveBeenNthCalledWith(7, UPDATING_ISSUE_3_IN_TEST_REPO);
    expect(infoSpy).toHaveBeenNthCalledWith(6, UPDATING_ISSUE_2_IN_TEST_REPO);
    expect(errorSpy).toHaveBeenNthCalledWith(1, NO_RECOGNIZED_LABELS);
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it("Should update base rate if there are changes in the plugin config", async () => {
    const pusher = db.users.findFirst({ where: { id: { equals: 4 } } }) as unknown as Context["payload"]["sender"];
    const commits = inMemoryCommits(SHA_1, true, true);
    const { context, errorSpy, warnSpy, infoSpy } = innerSetup(
      1,
      commits,
      SHA_1,
      SHA_1,
      {
        owner: UBIQUITY,
        repo: TEST_REPO,
        sha: SHA_1,
        modified: [CONFIG_PATH],
        added: [],
        withBaseRateChanges: true,
        withPlugin: true,
        amount: 5,
      },
      pusher
    );

    await globalLabelUpdate(context);
    expect(warnSpy).not.toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalledWith(NO_RECOGNIZED_LABELS);
    expect(infoSpy).toHaveBeenCalledWith(CONFIG_CHANGED_IN_COMMIT);
    expect(infoSpy).toHaveBeenCalledWith(UPDATING_FROM_1_TO_5);
    expect(infoSpy).toHaveBeenCalledWith(CREATING_MISSING_LABELS);
    expect(infoSpy).toHaveBeenCalledWith(UPDATING_ISSUE_1_IN_TEST_REPO);
    expect(infoSpy).toHaveBeenCalledWith(UPDATING_ISSUE_3_IN_TEST_REPO);
    expect(infoSpy).toHaveBeenCalledWith(UPDATING_ISSUE_2_IN_TEST_REPO);
  });

  it("Should update base rate if the user is authenticated", async () => {
    const pusher = db.users.findFirst({ where: { id: { equals: 1 } } }) as unknown as Context["payload"]["sender"];
    const commits = inMemoryCommits(SHA_1, true, true);
    const { context, errorSpy, warnSpy, infoSpy } = innerSetup(
      1,
      commits,
      SHA_1,
      SHA_1,
      {
        owner: UBIQUITY,
        repo: TEST_REPO,
        sha: SHA_1,
        modified: [CONFIG_PATH],
        added: [],
        withBaseRateChanges: true,
        withPlugin: false,
        amount: 5,
      },
      pusher
    );

    await globalLabelUpdate(context);
    expect(warnSpy).not.toHaveBeenCalled();
    expect(infoSpy).toHaveBeenCalledWith(CONFIG_CHANGED_IN_COMMIT);
    expect(infoSpy).toHaveBeenCalledWith(UPDATING_FROM_1_TO_5);

    expect(infoSpy).toHaveBeenCalledWith(CREATING_MISSING_LABELS);
    expect(infoSpy).toHaveBeenCalledWith(UPDATING_ISSUE_1_IN_TEST_REPO);
    expect(infoSpy).toHaveBeenCalledWith(UPDATING_ISSUE_3_IN_TEST_REPO);
    expect(infoSpy).toHaveBeenCalledWith(UPDATING_ISSUE_2_IN_TEST_REPO);
    expect(errorSpy).toHaveBeenCalledWith(NO_RECOGNIZED_LABELS);
  });

  it("Should allow a billing manager to update the base rate", async () => {
    const pusher = db.users.findFirst({ where: { id: { equals: 3 } } }) as unknown as Context["payload"]["sender"];
    const commits = inMemoryCommits(SHA_1, false, true, true);
    const { context, errorSpy, infoSpy, warnSpy } = innerSetup(
      3,
      commits,
      SHA_1,
      SHA_1,
      {
        owner: UBIQUITY,
        repo: TEST_REPO,
        sha: SHA_1,
        modified: [CONFIG_PATH],
        added: [],
        withBaseRateChanges: true,
        withPlugin: true,
        amount: 27, // billing manager's last day
      },
      pusher
    );

    await globalLabelUpdate(context);

    const updatedRepo = db.repo.findFirst({ where: { id: { equals: 1 } } });
    const updatedIssue = db.issue.findFirst({ where: { id: { equals: 1 } } });
    const updatedIssue2 = db.issue.findFirst({ where: { id: { equals: 3 } } });

    expect(warnSpy).not.toHaveBeenCalled();
    expect(infoSpy).toHaveBeenNthCalledWith(1, CONFIG_CHANGED_IN_COMMIT);

    expect(updatedRepo?.labels).toHaveLength(46);
    expect(updatedIssue?.labels).toHaveLength(3);
    expect(updatedIssue2?.labels).toHaveLength(3);

    const priceLabels = updatedIssue?.labels.filter((label) => (label as Label).name.includes("Price:"));
    const priceLabels2 = updatedIssue2?.labels.filter((label) => (label as Label).name.includes("Price:"));

    expect(priceLabels).toHaveLength(1);
    expect(priceLabels2).toHaveLength(1);

    expect(priceLabels?.map((label) => (label as Label).name)).toContain(`Price: ${priceMap[1] * 27} USD`);
    expect(priceLabels2?.map((label) => (label as Label).name)).toContain(`Price: ${priceMap[1] * 27} USD`);

    const sender_ = context.payload.sender;

    expect(pusher?.name).toBe("billing");
    expect(sender_?.login).toBe("billing");

    expect(infoSpy).toHaveBeenNthCalledWith(1, CONFIG_CHANGED_IN_COMMIT);
    expect(infoSpy).toHaveBeenNthCalledWith(2, "Updating base rate from 1 to 27");

    expect(infoSpy).toHaveBeenNthCalledWith(4, CREATING_MISSING_LABELS);
    expect(infoSpy).toHaveBeenNthCalledWith(5, UPDATING_ISSUE_1_IN_TEST_REPO);
    expect(infoSpy).toHaveBeenNthCalledWith(7, UPDATING_ISSUE_3_IN_TEST_REPO);
    expect(infoSpy).toHaveBeenNthCalledWith(6, UPDATING_ISSUE_2_IN_TEST_REPO);

    expect(errorSpy).toHaveBeenCalledWith(NO_RECOGNIZED_LABELS); // these two are connected ^
  });

  it("Should update if auth pushes the code and billing manager merges the PR", async () => {
    const pusher = db.users.findFirst({ where: { id: { equals: 3 } } }) as unknown as Context["payload"]["sender"];
    const commits = inMemoryCommits(SHA_1, true, true, true);
    const { context, errorSpy, infoSpy } = innerSetup(
      1,
      commits,
      SHA_1,
      SHA_1,
      {
        owner: UBIQUITY,
        repo: TEST_REPO,
        sha: SHA_1,
        modified: [CONFIG_PATH],
        added: [],
        withBaseRateChanges: true,
        withPlugin: true,
        amount: 8.5,
      },
      pusher
    );

    await globalLabelUpdate(context);

    const updatedRepo = db.repo.findFirst({ where: { id: { equals: 1 } } });
    const updatedIssue = db.issue.findFirst({ where: { id: { equals: 1 } } });
    const updatedIssue2 = db.issue.findFirst({ where: { id: { equals: 3 } } });

    expect(updatedRepo?.labels).toHaveLength(46);
    expect(updatedIssue?.labels).toHaveLength(3);
    expect(updatedIssue2?.labels).toHaveLength(3);

    const priceLabels = updatedIssue?.labels.filter((label) => (label as Label).name.includes("Price:"));
    const priceLabels2 = updatedIssue2?.labels.filter((label) => (label as Label).name.includes("Price:"));

    expect(priceLabels).toHaveLength(1);
    expect(priceLabels2).toHaveLength(1);

    expect(priceLabels?.map((label) => (label as Label).name)).toContain(`Price: ${priceMap[1] * 8.5} USD`);
    expect(priceLabels2?.map((label) => (label as Label).name)).toContain(`Price: ${priceMap[1] * 8.5} USD`);

    expect(infoSpy).toHaveBeenNthCalledWith(1, CONFIG_CHANGED_IN_COMMIT);
    expect(infoSpy).toHaveBeenNthCalledWith(2, "Updating base rate from 1 to 8.5");
    expect(infoSpy).toHaveBeenNthCalledWith(4, CREATING_MISSING_LABELS);
    expect(infoSpy).toHaveBeenNthCalledWith(5, UPDATING_ISSUE_1_IN_TEST_REPO);
    expect(infoSpy).toHaveBeenNthCalledWith(7, UPDATING_ISSUE_3_IN_TEST_REPO);

    expect(infoSpy).toHaveBeenNthCalledWith(6, UPDATING_ISSUE_2_IN_TEST_REPO);
    expect(errorSpy).toHaveBeenCalledWith(NO_RECOGNIZED_LABELS); // these two are connected ^
  });

  it("Should not globally update excluded repos", async () => {
    const pusher = db.users.findFirst({ where: { id: { equals: 1 } } }) as unknown as Context["payload"]["sender"];
    const commits = inMemoryCommits(SHA_1);
    const { context, infoSpy, warnSpy, errorSpy } = innerSetup(
      1,
      commits,
      SHA_1,
      SHA_1,
      {
        owner: UBIQUITY,
        repo: TEST_REPO,
        sha: SHA_1,
        modified: [CONFIG_PATH],
        added: [],
        withBaseRateChanges: true,
        withPlugin: false,
        amount: 5,
      },
      pusher
    );

    if (!context.config.globalConfigUpdate) {
      context.config.globalConfigUpdate = {
        excludeRepos: [],
      };
    }
    context.config.globalConfigUpdate.excludeRepos = [TEST_REPO];
    await globalLabelUpdate(context);

    expect(infoSpy).toHaveBeenNthCalledWith(1, CONFIG_CHANGED_IN_COMMIT);
    expect(infoSpy).toHaveBeenNthCalledWith(2, UPDATING_FROM_1_TO_5);
    expect(infoSpy).toHaveBeenNthCalledWith(4, CREATING_MISSING_LABELS);
    expect(infoSpy).toHaveBeenNthCalledWith(5, `Skipping excluded repository ${TEST_REPO}`);
    expect(warnSpy).not.toHaveBeenCalled();
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it("Should not globally update if it's disabled", async () => {
    const pusher = db.users.findFirst({ where: { id: { equals: 1 } } }) as unknown as Context["payload"]["sender"];
    const commits = inMemoryCommits(SHA_1);
    const { context, infoSpy, warnSpy, errorSpy } = innerSetup(
      1,
      commits,
      SHA_1,
      SHA_1,
      {
        owner: UBIQUITY,
        repo: TEST_REPO,
        sha: SHA_1,
        modified: [CONFIG_PATH],
        added: [],
        withBaseRateChanges: true,
        withPlugin: false,
        amount: 5,
      },
      pusher
    );

    if (!context.config.globalConfigUpdate) {
      context.config.globalConfigUpdate = {
        excludeRepos: [],
      };
    }
    context.config.globalConfigUpdate.excludeRepos = [TEST_REPO];
    await globalLabelUpdate(context);

    expect(infoSpy).toHaveBeenNthCalledWith(1, CONFIG_CHANGED_IN_COMMIT);
    expect(infoSpy).toHaveBeenNthCalledWith(2, UPDATING_FROM_1_TO_5);
    expect(infoSpy).toHaveBeenNthCalledWith(4, CREATING_MISSING_LABELS);
    expect(infoSpy).toHaveBeenNthCalledWith(5, `Skipping excluded repository ${TEST_REPO}`);
    expect(warnSpy).not.toHaveBeenCalled();
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it("Should not update base rate if the user is not authenticated", async () => {
    const pusher = db.users.findFirst({ where: { id: { equals: 2 } } }) as unknown as Context["payload"]["sender"];
    const commits = inMemoryCommits(SHA_1, false);
    const { context, errorSpy } = innerSetup(
      2,
      commits,
      SHA_1,
      SHA_1,
      {
        owner: USER_2,
        repo: TEST_REPO,
        sha: SHA_1,
        modified: [CONFIG_PATH],
        added: [],
        withBaseRateChanges: true,
        withPlugin: false,
        amount: 5,
      },
      pusher
    );

    await globalLabelUpdate(context);
    expect(errorSpy).toHaveBeenNthCalledWith(1, PUSHER_NOT_AUTHED);
    expect(errorSpy).toHaveBeenNthCalledWith(2, SENDER_NOT_AUTHED);
  });

  it("Should not update base rate if there are no changes", async () => {
    const pusher = db.users.findFirst({ where: { id: { equals: 1 } } }) as unknown as Context["payload"]["sender"];
    const commits = inMemoryCommits(SHA_1, true, false);
    const { context, infoSpy } = innerSetup(
      1,
      commits,
      SHA_1,
      SHA_1,
      {
        owner: UBIQUITY,
        repo: TEST_REPO,
        sha: SHA_1,
        modified: [],
        added: [],
        withBaseRateChanges: false,
        withPlugin: false,
        amount: 5,
      },
      pusher
    );

    await globalLabelUpdate(context);
    expect(infoSpy).toHaveBeenCalledWith("No files were changed in the commits, so no action is required.");
  });

  it("Should not update if non-auth pushes the code and admin merges the PR", async () => {
    const commits = inMemoryCommits(SHA_1, false, true, true);
    const pusher = db.users.findFirst({ where: { id: { equals: 2 } } }) as unknown as Context["payload"]["sender"];
    const { context, errorSpy, infoSpy, warnSpy } = innerSetup(
      1,
      commits,
      SHA_1,
      SHA_1,
      {
        owner: UBIQUITY,
        repo: TEST_REPO,
        sha: SHA_1,
        modified: [CONFIG_PATH],
        added: [],
        withBaseRateChanges: true,
        withPlugin: true,
        amount: 5,
      },
      pusher
    );

    await globalLabelUpdate(context);
    expect(errorSpy).toHaveBeenNthCalledWith(1, PUSHER_NOT_AUTHED);
    expect(warnSpy).toHaveBeenCalledWith(NEEDS_TRIGGERED_BY_ADMIN_OR_BILLING_MANAGER);
    expect(infoSpy).not.toHaveBeenCalled();
  });

  it("Should not update if non-auth pushes the code and billing manager merges the PR", async () => {
    const commits = inMemoryCommits(SHA_1, false, true, true);
    const pusher = db.users.findFirst({ where: { id: { equals: 2 } } }) as unknown as Context["payload"]["sender"];
    const { context, errorSpy, warnSpy } = innerSetup(
      3,
      commits,
      SHA_1,
      SHA_1,
      {
        owner: UBIQUITY,
        repo: TEST_REPO,
        sha: SHA_1,
        modified: [CONFIG_PATH],
        added: [],
        withBaseRateChanges: true,
        withPlugin: true,
        amount: 5,
      },
      pusher
    );

    await globalLabelUpdate(context);
    expect(errorSpy).toHaveBeenNthCalledWith(1, PUSHER_NOT_AUTHED);
    expect(warnSpy).toHaveBeenCalledWith(NEEDS_TRIGGERED_BY_ADMIN_OR_BILLING_MANAGER);
  });

  it("Should not update if auth pushes the code and non-auth merges the PR", async () => {
    const pusher = db.users.findFirst({ where: { id: { equals: 1 } } }) as unknown as Context["payload"]["sender"];
    const commits = inMemoryCommits(SHA_1, true, true, true);
    const { context, errorSpy, warnSpy } = innerSetup(
      2,
      commits,
      SHA_1,
      SHA_1,
      {
        owner: UBIQUITY,
        repo: TEST_REPO,
        sha: SHA_1,
        modified: [CONFIG_PATH],
        added: [],
        withBaseRateChanges: true,
        withPlugin: true,
        amount: 5,
      },
      pusher
    );

    await globalLabelUpdate(context);
    expect(errorSpy).toHaveBeenCalledWith(SENDER_NOT_AUTHED);
    expect(warnSpy).toHaveBeenCalledWith(NEEDS_TRIGGERED_BY_ADMIN_OR_BILLING_MANAGER);
  });

  it("Should not update base rate if a new branch was created", async () => {
    const pusher = db.users.findFirst({ where: { id: { equals: 1 } } }) as unknown as Context["payload"]["sender"];
    const commits = inMemoryCommits(SHA_1);
    const { context, errorSpy, infoSpy, warnSpy } = innerSetup(
      3,
      commits,
      ZERO_SHA,
      SHA_1,
      {
        owner: UBIQUITY,
        repo: TEST_REPO,
        sha: SHA_1,
        modified: [CONFIG_PATH],
        added: [],
        withBaseRateChanges: true,
        withPlugin: false,
        amount: 5,
      },
      pusher
    );

    await globalLabelUpdate(context);
    expect(infoSpy).toHaveBeenCalledTimes(1);
    expect(infoSpy).toHaveBeenCalledWith("Skipping push events. A new branch was created");

    expect(errorSpy).not.toHaveBeenCalled();
    expect(warnSpy).not.toHaveBeenCalled();
  });
});

function innerSetup(
  senderId: number,
  commits: Context<"push">["payload"]["commits"],
  before: string,
  after: string,
  commitParams: CreateCommitParams,
  pusher?: Context["payload"]["sender"],
  globalConfigUpdate?: {
    excludeRepos: string[];
  }
) {
  const sender = db.users.findFirst({ where: { id: { equals: senderId } } }) as unknown as Context["payload"]["sender"];

  createCommit(commitParams);

  const context = createContext(sender, commits, before, after, pusher, globalConfigUpdate);

  const infoSpy = jest.spyOn(context.logger, "info");
  const warnSpy = jest.spyOn(context.logger, "warn");
  const errorSpy = jest.spyOn(context.logger, "error");

  const repo = db.repo.findFirst({ where: { id: { equals: 1 } } });
  const issue1 = db.issue.findFirst({ where: { id: { equals: 1 } } });
  const issue2 = db.issue.findFirst({ where: { id: { equals: 3 } } });

  expect(repo?.labels).toHaveLength(29);
  expect(issue1?.labels).toHaveLength(3);
  expect(issue2?.labels).toHaveLength(2);

  return {
    context,
    infoSpy,
    warnSpy,
    errorSpy,
    repo,
    issue1,
    issue2,
  };
}

function createContext(
  sender: Context["payload"]["sender"],
  commits: Context<"push">["payload"]["commits"],
  before: string,
  after: string,
  pusher?: Context["payload"]["sender"],
  globalConfigUpdate?: {
    excludeRepos: string[];
  }
): Context {
  return {
    adapters: {} as never,
    payload: {
      action: "created",
      sender: sender as unknown as Context["payload"]["sender"],
      repository: db.repo.findFirst({ where: { id: { equals: 1 } } }) as unknown as Context["payload"]["repository"],
      installation: { id: 1 } as unknown as Context["payload"]["installation"],
      organization: { login: UBIQUITY } as unknown as Context["payload"]["organization"],
      after,
      before,
      base_ref: "refs/heads/main",
      ref: "refs/heads/main",
      commits,
      compare: "",
      created: false,
      deleted: false,
      forced: false,
      head_commit: {
        id: SHA_1,
        message: "feat: add base rate",
        timestamp: new Date().toISOString(),
        url: "",
        author: {
          email: UBQ_EMAIL,
          name: UBIQUITY,
          username: UBIQUITY,
        },
        committer: {
          email: UBQ_EMAIL,
          name: UBIQUITY,
          username: UBIQUITY,
        },
        added: [CONFIG_PATH],
        modified: [],
        removed: [],
        distinct: true,
        tree_id: SHA_1,
      },
      pusher: {
        name: pusher?.login ?? (sender?.login as string),
        email: "...",
        date: new Date().toISOString(),
        username: pusher?.login ?? (sender?.login as string),
      },
    } as Context<"push">["payload"],
    logger: {
      info: console.info,
      error: console.error,
      warn: console.warn,
      debug: console.debug,
      fatal: console.error,
    },
    config: {
      labels: {
        priority: PRIORITY_LABELS.map((label) => label.name),
        time: TIME_LABELS.map((label) => label.name),
      },
      publicAccessControl: {
        fundExternalClosedIssue: false,
        setLabel: true,
      },
      globalConfigUpdate: globalConfigUpdate ?? {
        excludeRepos: [],
      },
      basePriceMultiplier: 2,
    },
    octokit: octokit,
    eventName: "push",
  };
}
