import { z } from "zod";

export type AppEnv = "development" | "production" | "test";

export interface IAppConfig {
  env: AppEnv;
  port: number;
}

const appConfigSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.string().transform(Number).default(3000),
});

const parsed = appConfigSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid app config variables", parsed.error.message);
  process.exit(1);
}

export const appConfig: IAppConfig = {
  env: parsed.data.NODE_ENV,
  port: parsed.data.PORT,
};
