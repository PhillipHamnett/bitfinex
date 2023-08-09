import type { Config } from "jest";

export default async (): Promise<Config> => {
  return {
    verbose: true,
    transform: {
      "\\.ts$": ["ts-jest", { tsconfig: "tsconfig.cjs.json" }],
    },
    preset: "ts-jest",
    modulePathIgnorePatterns: ["<rootDir>/lib/"],
  };
};
