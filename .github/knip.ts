import type { KnipConfig } from "knip";

const config: KnipConfig = {
  entry: ["src/index.ts"],
  project: ["src/**/*.ts"],
  ignore: ["src/types/config.ts", "src/adapters/supabase/types/database.ts"],
  ignoreExportsUsedInFile: true,
  ignoreDependencies: [
    "ts-node",
    "@types/jest",
    "@eslint/js",
    "typescript-eslint",
    "eslint-plugin-sonarjs",
    "eslint-plugin-prettier",
    "eslint-plugin-check-file",
    "eslint-config-prettier",
    "@typescript-eslint/parser",
    "@typescript-eslint/eslint-plugin",
  ],
};

export default config;
