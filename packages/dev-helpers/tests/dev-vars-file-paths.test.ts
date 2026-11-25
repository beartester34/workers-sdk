import path from "node:path";
import { describe, test, vi } from "vitest";
import { getVarsForDevFilePaths } from "../src/dev-vars";

describe("getVarsForDevFilePaths", () => {
	const configDir = path.resolve("/project");
	const configPath = path.join(configDir, "wrangler.jsonc");
	const inConfigDir = (...files: string[]) =>
		files.map((file) => path.join(configDir, file));

	test("returns .dev.vars and the default .env files", ({ expect }) => {
		expect(getVarsForDevFilePaths(configPath, undefined, undefined)).toEqual(
			inConfigDir(".dev.vars", ".env", ".env.local")
		);
	});

	test("includes the environment-specific files", ({ expect }) => {
		expect(getVarsForDevFilePaths(configPath, undefined, "staging")).toEqual(
			inConfigDir(
				".dev.vars.staging",
				".dev.vars",
				".env",
				".env.local",
				".env.staging",
				".env.staging.local"
			)
		);
	});

	test("returns only the explicit env files, which replace .dev.vars", ({
		expect,
	}) => {
		expect(
			getVarsForDevFilePaths(configPath, ["custom.env"], "staging")
		).toEqual(inConfigDir("custom.env"));
	});

	test("omits .env files when loading them is disabled", ({ expect }) => {
		vi.stubEnv("CLOUDFLARE_LOAD_DEV_VARS_FROM_DOT_ENV", "false");
		try {
			expect(getVarsForDevFilePaths(configPath, undefined, undefined)).toEqual(
				inConfigDir(".dev.vars")
			);
		} finally {
			vi.unstubAllEnvs();
		}
	});

	test("resolves against the working directory without a config file", ({
		expect,
	}) => {
		expect(getVarsForDevFilePaths(undefined, undefined, undefined)[0]).toBe(
			path.resolve(".dev.vars")
		);
	});
});
