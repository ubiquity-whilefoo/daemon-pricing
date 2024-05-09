import commandParser, { CommandArguments } from "../src/handlers/command-parser";
import { mainModule } from "../static/main";
import { db } from "./__mocks__/db";
import { server } from "./__mocks__/node";
import usersGet from "./__mocks__/users-get.json";
import { expect, describe, beforeAll, beforeEach, afterAll, afterEach, it } from "@jest/globals";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("User tests", () => {
  beforeEach(() => {
    for (const item of usersGet) {
      db.users.create(item);
    }
  });

  it("Should fetch all the users", async () => {
    const res = await fetch("https://api.ubiquity.com/users");
    const data = await res.json();
    expect(data).toMatchObject(usersGet);
    expect(async () => await mainModule()).not.toThrow();
  });

  it("Should parse the /allow command", () => {
    const command = "/allow @user time priority".split(/\s+/);
    const invalidCommand = "allow user time priority".split(/\s+/);
    const result: CommandArguments = {
      command: "",
      labels: [],
      username: "",
    };
    commandParser
      .action((command, username, labels) => {
        result.command = command;
        result.username = username;
        result.labels = labels;
      })
      .parse(command, { from: "user" });
    expect(result).toEqual({
      command: "/allow",
      labels: ["time", "priority"],
      username: "@user",
    });
    expect(() => commandParser.exitOverride().parse(invalidCommand, { from: "user" })).toThrow();
    console.log(commandParser.helpInformation());
  });
});
