import { Command } from "@commander-js/extra-typings";
import { InvalidArgumentError } from "commander";
import packageJson from "../../package.json";

export interface CommandArguments {
  username: string;
  labels: string[];
  command: string;
}

function parseUser(value: string) {
  if (!value.length || value.length < 2) {
    throw new InvalidArgumentError("Username should be at least 2 characters long.");
  }
  if (value[0] !== "@") {
    throw new InvalidArgumentError("Username should start with @.");
  }
  // Remove @ character
  return value.slice(1);
}

function parseCommand(value: string) {
  if (!value.length || value.length < 2) {
    throw new InvalidArgumentError("Command should be at least 2 characters long.");
  }
  if (value[0] !== "/") {
    throw new InvalidArgumentError("Command should start with /.");
  }
  return value;
}

const commandParser = new Command()
  .name(" ")
  .usage("/<command> @<username> [labels...]")
  .argument("<command>", "The command to execute, e.g. /allow", parseCommand)
  .argument("<username>", "User name to allow rights to, e.g @ubiquibot", parseUser)
  .argument("[labels...]", "Labels to allow, e.g time priority")
  .exitOverride()
  .version(packageJson.version);

export default commandParser;
