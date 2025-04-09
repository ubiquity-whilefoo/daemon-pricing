import type { KnipConfig } from "knip";

const config: KnipConfig = {
  entry: ["build/index.ts", ".github/empty-string-checker.ts"],
  project: ["src/**/*.ts"],
  ignore: ["src/types/config.ts", "**/__mocks__/**", "**/__fixtures__/**", "eslint.config.mjs"],
  ignoreExportsUsedInFile: true,
  ignoreDependencies: ["ts-node", "eslint-config-prettier", "eslint-plugin-prettier", "@types/jest", "@mswjs/data", "husky"],
  eslint: true,
};

export default config;
