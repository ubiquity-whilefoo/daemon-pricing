import * as github from "@actions/github";
import { Octokit } from "@octokit/rest";
import { TransformDecodeCheckError, TransformDecodeError, Value, ValueError } from "@sinclair/typebox/value";
import { Env, envConfigValidator, envSchema } from "../types/env";
import { AssistivePricingSettings, assistivePricingSettingsSchema, assistivePricingSchemaValidator } from "../types/plugin-input";

export async function returnDataToKernel(repoToken: string, stateId: string, output: object, eventType = "return-data-to-ubiquity-os-kernel") {
  const octokit = new Octokit({ auth: repoToken });
  return octokit.repos.createDispatchEvent({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    event_type: eventType,
    client_payload: {
      state_id: stateId,
      output: JSON.stringify(output),
    },
  });
}

export function validateAndDecodeSchemas(rawEnv: object, rawSettings: object) {
  const errors: ValueError[] = [];

  const env = Value.Default(envSchema, rawEnv) as Env;
  if (!envConfigValidator.test(env)) {
    for (const error of envConfigValidator.errors(env)) {
      console.error(error);
      errors.push(error);
    }
  }

  const settings = Value.Default(assistivePricingSettingsSchema, rawSettings) as AssistivePricingSettings;
  if (!assistivePricingSchemaValidator.test(settings)) {
    for (const error of assistivePricingSchemaValidator.errors(settings)) {
      console.error(error);
      errors.push(error);
    }
  }

  if (errors.length) {
    throw { errors };
  }

  try {
    const decodedSettings = Value.Decode(assistivePricingSettingsSchema, settings);
    const decodedEnv = Value.Decode(envSchema, rawEnv || {});
    return { decodedEnv, decodedSettings };
  } catch (e) {
    console.error("validateAndDecodeSchemas", e);
    if (e instanceof TransformDecodeCheckError || e instanceof TransformDecodeError) {
      throw { errors: [e.error] };
    }
    throw e;
  }
}
