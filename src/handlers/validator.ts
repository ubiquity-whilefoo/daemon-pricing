import { TransformDecodeCheckError, TransformDecodeError, Value, ValueError } from "@sinclair/typebox/value";
import { Env, envConfigValidator, envSchema } from "../types/env";
import { assistivePricingSchemaValidator, AssistivePricingSettings, assistivePricingSettingsSchema } from "../types/plugin-input";

export function validateAndDecodeSchemas(env: Env, rawSettings: object) {
  const errors: ValueError[] = [];
  const settings = Value.Default(assistivePricingSettingsSchema, rawSettings) as AssistivePricingSettings;

  if (!assistivePricingSchemaValidator.test(settings)) {
    for (const error of assistivePricingSchemaValidator.errors(settings)) {
      errors.push(error);
    }
  }

  if (!envConfigValidator.test(env)) {
    for (const error of envConfigValidator.errors(env)) {
      errors.push(error);
    }
  }

  if (errors.length) {
    throw { errors };
  }

  try {
    const decodedEnv = Value.Decode(envSchema, env);
    const decodedSettings = Value.Decode(assistivePricingSettingsSchema, settings);
    return { decodedEnv, decodedSettings };
  } catch (e) {
    if (e instanceof TransformDecodeCheckError || e instanceof TransformDecodeError) {
      throw { errors: [e.error] };
    }
    throw e;
  }
}
